/* Ahmed Study Platform — daily and weekly study planner */
(function (global) {
  'use strict';

  function init({state, save, escapeHtml}) {
    const root = document.getElementById('smartPlannerRoot');
    if (!root) return {render:function(){}};
    const esc = typeof escapeHtml === 'function' ? escapeHtml : value => String(value);
    const subjects = ['اللغة العربية','اللغة الأجنبية الأولى','الأحياء','الكيمياء','الفيزياء','الرياضيات','التاريخ','الجغرافيا','الإحصاء','اللغة الأجنبية الثانية','تعلم الإنجليزية','مراجعة عامة','أخرى'];
    const types = [{id:'lesson',label:'مذاكرة درس'},{id:'practice',label:'حل تدريبات'},{id:'revision',label:'مراجعة'},{id:'exam',label:'اختبار تجريبي'},{id:'reading',label:'قراءة وتلخيص'}];
    state.studyPlan = state.studyPlan && typeof state.studyPlan === 'object' && !Array.isArray(state.studyPlan) ? state.studyPlan : {};
    state.studyPlan.tasks = Array.isArray(state.studyPlan.tasks) ? state.studyPlan.tasks : [];
    let selectedDate = dateKey(new Date());
    let view = 'day';
    let editingId = null;
    const $ = selector => root.querySelector(selector);
    const pad = n => String(n).padStart(2,'0');
    function dateKey(date) { return date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate()); }
    function parseDate(value) { const parts=String(value||'').split('-').map(Number); return new Date(parts[0],parts[1]-1,parts[2],12); }
    function shiftDate(value,days) { const d=parseDate(value); d.setDate(d.getDate()+days); return dateKey(d); }
    function weekStart(value) { const d=parseDate(value); d.setDate(d.getDate()-((d.getDay()+6)%7)); return dateKey(d); }
    function label(value, options={weekday:'long',day:'numeric',month:'long'}) { return parseDate(value).toLocaleDateString('ar-EG',options); }
    function tasks() { return state.studyPlan.tasks.filter(t=>t&&t.id&&t.title&&/^\d{4}-\d{2}-\d{2}$/.test(t.date)); }
    function selectedTasks() {
      const start=view==='week'?weekStart(selectedDate):selectedDate;
      const end=view==='week'?shiftDate(start,6):start;
      return tasks().filter(t=>t.date>=start&&t.date<=end).sort((a,b)=>a.date.localeCompare(b.date)||String(a.time||'').localeCompare(String(b.time||'')));
    }
    function stats() {
      const list=selectedTasks();
      return {list,total:list.length,done:list.filter(t=>t.done).length,minutes:list.reduce((sum,t)=>sum+(Number(t.duration)||0),0),doneMinutes:list.filter(t=>t.done).reduce((sum,t)=>sum+(Number(t.duration)||0),0)};
    }
    function recommendations() {
      const suggestions=[];
      const records=Array.isArray(state.prac)?state.prac:[];
      const bySubject={};
      records.forEach(item=>{
        if(!item||!item.s||!Number(item.n))return;
        const row=bySubject[item.s]||(bySubject[item.s]={n:0,c:0});
        row.n+=Number(item.n)||0; row.c+=Number(item.c)||0;
      });
      Object.entries(bySubject).map(([subject,row])=>({subject,accuracy:Math.round(row.c/row.n*100),n:row.n}))
        .filter(item=>item.n>=5&&item.accuracy<70)
        .sort((a,b)=>a.accuracy-b.accuracy)
        .slice(0,2).forEach(item=>suggestions.push({key:'weak:'+item.subject,title:'تدريب إضافي في '+item.subject,subject:item.subject,kind:'practice',detail:'دقة التدريب المسجلة '+item.accuracy+'%'}));
      const exams=(Array.isArray(state.examHistory)?state.examHistory:[]).filter(item=>Number.isFinite(Number(item.percent))&&Number(item.percent)<70).slice(0,2);
      exams.forEach(item=>suggestions.push({key:'exam:'+item.subject,title:'مراجعة نقاط اختبار '+(item.subject||'السابق'),subject:item.subject||'مراجعة عامة',kind:'revision',detail:'آخر نتيجة مسجلة '+item.percent+'%'}));
      const today=dateKey(new Date());
      const due=Object.values(state.smartReview||{}).filter(item=>item&&item.due&&item.due<=today).length;
      if(due)suggestions.push({key:'due:'+today,title:'جلسة المراجعة الذكية',subject:'مراجعة عامة',kind:'revision',detail:due+' بطاقة مراجعة مستحقة أو متأخرة',link:'reviewCenter'});
      const progress=(global.StudySubjectCourses?.getProgressStats(state)||[]).concat(global.StudyEnglishPath?.getProgressStats(state)||[]);
      const incomplete=progress.filter(item=>item.total>item.completed).sort((a,b)=>a.percent-b.percent);
      if(incomplete.length) {
        const item=incomplete[0];
        suggestions.push({key:'progress:'+item.id,title:'أكمل درسًا في '+item.name,subject:item.name,kind:'lesson',detail:'التقدم الحالي '+item.percent+'% من الدروس'});
      }
      return suggestions.slice(0,4);
    }
    function options(selected) { return subjects.map(s=>'<option value="'+esc(s)+'"'+(selected===s?' selected':'')+'>'+esc(s)+'</option>').join(''); }
    function typeLabel(id) { return (types.find(t=>t.id===id)||types[0]).label; }
    function renderTasks(list) {
      if(!list.length)return '<div class="planner-empty"><b>لا توجد مهام في هذه الفترة.</b><p>أضف أول مهمة أو استخدم الاقتراحات لبدء خطتك.</p></div>';
      if(view==='day')return '<div class="planner-task-list">'+list.map(taskCard).join('')+'</div>';
      const groups={};
      list.forEach(task=>(groups[task.date]=groups[task.date]||[]).push(task));
      return '<div class="planner-week-list">'+Object.entries(groups).map(([date,items])=>'<section class="planner-day-group"><h4>'+esc(label(date))+' <small>'+items.length+' مهام</small></h4><div class="planner-task-list">'+items.map(taskCard).join('')+'</div></section>').join('')+'</div>';
    }
    function taskCard(task) {
      return '<article class="planner-task'+(task.done?' is-done':'')+'"><button type="button" class="planner-check" data-plan-done="'+esc(task.id)+'" aria-label="'+(task.done?'إلغاء الإنجاز':'تسجيل الإنجاز')+'" aria-pressed="'+Boolean(task.done)+'">'+(task.done?'✓':'')+'</button><div class="planner-task-content"><div class="planner-task-meta"><span>'+esc(typeLabel(task.kind))+'</span><span>'+esc(task.subject||'أخرى')+'</span></div><b>'+esc(task.title)+'</b><small>'+ (view==='week'?esc(label(task.date,{weekday:'short',day:'numeric',month:'short'})+' · '):'')+esc(task.time||'بدون وقت')+' · '+(Number(task.duration)||30)+' دقيقة</small>'+(task.note?'<p>'+esc(task.note)+'</p>':'')+'</div><div class="planner-task-actions"><button type="button" class="planner-icon-btn" data-plan-edit="'+esc(task.id)+'" aria-label="تعديل المهمة">✎</button><button type="button" class="planner-icon-btn danger" data-plan-delete="'+esc(task.id)+'" aria-label="حذف المهمة">×</button></div></article>';
    }
    function render() {
      const data=stats(), start=view==='week'?weekStart(selectedDate):selectedDate, end=view==='week'?shiftDate(start,6):start;
      const ideas=recommendations();
      root.innerHTML='<div class="planner-hero"><div><span class="eyebrow">PLAN · FOCUS · ACHIEVE</span><h2>مخطط المذاكرة الذكي</h2><p>حوّل أهدافك إلى مهام واضحة، وتابع إنجازك يومًا بعد يوم.</p></div><div class="planner-hero-mark">A</div></div>'+
        '<div class="planner-stats"><article><small>المهام المخططة</small><strong>'+data.total+'</strong></article><article><small>المهام المنجزة</small><strong>'+data.done+'</strong></article><article><small>وقت المذاكرة</small><strong>'+data.minutes+' <em>دقيقة</em></strong></article></div>'+
        '<div class="planner-layout"><section class="planner-panel"><div class="planner-panel-head"><div><span class="eyebrow">YOUR PLAN</span><h3>جدولك</h3></div><div class="planner-view-toggle"><button type="button" data-plan-view="day" class="'+(view==='day'?'active':'')+'">يومي</button><button type="button" data-plan-view="week" class="'+(view==='week'?'active':'')+'">أسبوعي</button></div></div>'+
        '<div class="planner-date-nav"><button type="button" data-plan-shift="-1" aria-label="الفترة السابقة">‹</button><label><span>'+esc(view==='week'?'الأسبوع المحدد':'اليوم المحدد')+'</span><input type="date" id="plannerDate" value="'+selectedDate+'"></label><button type="button" data-plan-shift="1" aria-label="الفترة التالية">›</button><button type="button" class="planner-today" data-plan-today>اليوم</button></div>'+
        '<div class="planner-progress"><div><span>إنجاز الفترة</span><b>'+data.done+' / '+data.total+'</b></div><i><span style="width:'+(data.total?Math.round(data.done/data.total*100):0)+'%"></span></i></div>'+
        '<div class="planner-period-label">'+esc(view==='week'?label(start,{day:'numeric',month:'short'})+' — '+label(end,{day:'numeric',month:'long'}):label(selectedDate))+'</div>'+renderTasks(data.list)+'</section>'+
        '<aside class="planner-panel planner-form-panel"><span class="eyebrow">BUILD YOUR ROUTINE</span><h3 id="plannerFormTitle">'+(editingId?'تعديل المهمة':'أضف مهمة جديدة')+'</h3><form id="plannerForm"><label for="plannerTitle">عنوان المهمة</label><input id="plannerTitle" maxlength="100" required placeholder="مثال: مذاكرة قوانين الحركة"><div class="planner-form-row"><div><label for="plannerSubject">المادة</label><select id="plannerSubject">'+options('')+'</select></div><div><label for="plannerKind">نوع المهمة</label><select id="plannerKind">'+types.map(t=>'<option value="'+t.id+'">'+t.label+'</option>').join('')+'</select></div></div><div class="planner-form-row"><div><label for="plannerTaskDate">التاريخ</label><input id="plannerTaskDate" type="date" required value="'+selectedDate+'"></div><div><label for="plannerTime">الوقت</label><input id="plannerTime" type="time" value="18:00"></div></div><label for="plannerDuration">المدة بالدقائق</label><select id="plannerDuration"><option value="15">15 دقيقة</option><option value="30" selected>30 دقيقة</option><option value="45">45 دقيقة</option><option value="60">ساعة</option><option value="90">ساعة ونصف</option><option value="120">ساعتان</option></select><label for="plannerNote">ملاحظات (اختياري)</label><textarea id="plannerNote" rows="2" maxlength="300" placeholder="حدد الجزء أو الهدف من الجلسة"></textarea><div class="planner-form-actions"><button class="p" type="submit">'+(editingId?'حفظ التعديل':'إضافة إلى الخطة')+'</button>'+(editingId?'<button class="s" type="button" data-plan-cancel>إلغاء</button>':'')+'</div></form></aside></div>'+
        '<section class="planner-panel planner-suggestions"><div class="planner-panel-head"><div><span class="eyebrow">SMART RECOMMENDATIONS</span><h3>اقتراحات مبنية على تقدمك</h3></div><button type="button" class="s" data-go-tab="reviewCenter">المراجعة الذكية ↗</button></div>'+
        (ideas.length?'<div class="planner-ideas">'+ideas.map(item=>'<article class="planner-idea"><div><b>'+esc(item.title)+'</b><small>'+esc(item.detail)+'</small></div>'+(item.link?'<button type="button" class="s" data-go-tab="'+item.link+'">ابدأ</button>':'<button type="button" class="s" data-plan-suggest="'+esc(item.key)+'">أضف للخطة</button>')+'</article>').join('')+'</div>':'<div class="planner-empty"><b>لا توجد اقتراحات خاصة حاليًا.</b><p>سجّل جلسات التدريب أو الاختبارات، وأكمل بعض الدروس لتظهر اقتراحات أدق.</p></div>')+
        '<p class="planner-footnote">الاقتراحات تعتمد فقط على نتائج التدريب والاختبارات وتقدم الدروس والمراجعات المسجلة. لا يتم إنشاء مهام تلقائيًا دون اختيارك.</p></section>';
      bindForm();
    }
    function clearForm() { editingId=null; render(); }
    function bindForm() {
      $('#plannerForm').addEventListener('submit',event=>{
        event.preventDefault();
        const title=$('#plannerTitle').value.trim();
        const date=$('#plannerTaskDate').value;
        if(!title||!date)return;
        const values={title,subject:$('#plannerSubject').value,kind:$('#plannerKind').value,date,time:$('#plannerTime').value,duration:Number($('#plannerDuration').value)||30,note:$('#plannerNote').value.trim()};
        if(editingId) {
          const item=tasks().find(t=>t.id===editingId);
          if(item)Object.assign(item,values);
        } else state.studyPlan.tasks.push({id:'plan-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),...values,done:false,createdAt:new Date().toISOString()});
        selectedDate=date; editingId=null; save(); render();
      });
      if(editingId) {
        const item=tasks().find(t=>t.id===editingId);
        if(item) {
          $('#plannerTitle').value=item.title; $('#plannerSubject').value=item.subject||'';
          $('#plannerKind').value=item.kind||'lesson'; $('#plannerTaskDate').value=item.date;
          $('#plannerTime').value=item.time||''; $('#plannerDuration').value=String(item.duration||30);
          $('#plannerNote').value=item.note||'';
        }
      }
    }
    root.addEventListener('click',event=>{
      const button=event.target.closest('button'); if(!button)return;
      if(button.dataset.planView){view=button.dataset.planView;render();}
      else if(button.dataset.planShift){selectedDate=shiftDate(selectedDate,Number(button.dataset.planShift)*(view==='week'?7:1));render();}
      else if(button.hasAttribute('data-plan-today')){selectedDate=dateKey(new Date());render();}
      else if(button.dataset.planDone){
        const item=tasks().find(t=>t.id===button.dataset.planDone);
        if(item){item.done=!item.done;item.completedAt=item.done?new Date().toISOString():null;save();render();}
      } else if(button.dataset.planDelete){
        state.studyPlan.tasks=tasks().filter(t=>t.id!==button.dataset.planDelete);
        if(editingId===button.dataset.planDelete)editingId=null;
        save();render();
      } else if(button.dataset.planEdit){
        editingId=button.dataset.planEdit;render();
      } else if(button.hasAttribute('data-plan-cancel')) clearForm();
      else if(button.dataset.planSuggest){
        const item=recommendations().find(x=>x.key===button.dataset.planSuggest);
        if(item){
          const exists=tasks().some(t=>t.date===selectedDate&&t.title===item.title);
          if(!exists)state.studyPlan.tasks.push({id:'plan-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,6),title:item.title,subject:item.subject,kind:item.kind,date:selectedDate,time:'18:00',duration:30,note:item.detail,done:false,createdAt:new Date().toISOString()});
          save();render();
        }
      }
    });
    root.addEventListener('change',event=>{
      if(event.target.id==='plannerDate'){selectedDate=event.target.value||dateKey(new Date());render();}
    });
    render();
    return {render};
  }
  global.StudySmartPlanner=Object.freeze({init});
})(window);
