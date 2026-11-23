/* Ahmed Study Platform — timed exam center */
(function (global) {
  'use strict';
  function init({state, save, escapeHtml: esc}) {
    const root = document.getElementById('examCenterRoot');
    if (!root) return;
    state.examHistory = Array.isArray(state.examHistory) ? state.examHistory : [];
    let active = null;
    let timer = null;

    const SUBJECTS = [
      {id:'all', name:'كل المواد'},
      {id:'arabic2027', name:'اللغة العربية'},
      {id:'chemistry2027', name:'الكيمياء'},
      {id:'physics2027', name:'الفيزياء'},
      {id:'math2027', name:'الرياضيات'},
      {id:'biology2027', name:'الأحياء'},
      {id:'englishPath', name:'الإنجليزية — المسار التعليمي'}
    ];
    const $ = selector => root.querySelector(selector);
    const shuffle = items => {
      const copy = items.slice();
      for (let i=copy.length-1;i>0;i--) {
        const j=Math.floor(Math.random()*(i+1));
        [copy[i],copy[j]]=[copy[j],copy[i]];
      }
      return copy;
    };
    function bankFor(id) {
      if (id === 'englishPath') return global.StudyEnglishPath.getExamQuestions();
      if (id === 'all') {
        return SUBJECTS.filter(s=>s.id!=='all').flatMap(s=>bankFor(s.id));
      }
      return global.StudySubjectCourses.getExamQuestions(id);
    }
    function fmt(seconds) {
      const safe=Math.max(0,seconds);
      return String(Math.floor(safe/60)).padStart(2,'0')+':'+String(safe%60).padStart(2,'0');
    }
    function stopTimer() {
      if (timer) global.clearInterval(timer);
      timer=null;
    }
    function renderHistory() {
      const list=$('#examHistory');
      const items=state.examHistory.slice(0,8);
      list.innerHTML=items.length ? items.map(item=>
        '<div class="exam-history-item"><div><b>'+esc(item.subject)+'</b><small>'+esc(item.date)+' · '+item.correct+'/'+item.total+' إجابة صحيحة</small></div><strong class="'+(item.percent>=70?'exam-good':'exam-low')+'">'+item.percent+'%</strong></div>'
      ).join('') : '<div class="empty">لم تؤدِّ أي امتحان بعد. أول نتيجة ستظهر هنا.</div>';
    }
    function renderSetup() {
      stopTimer();
      active=null;
      root.innerHTML =
        '<div class="exam-hero"><span class="welcome-kicker">ASSESS · REVIEW · IMPROVE</span><h2>مركز الاختبارات</h2><p>اختبر فهمك من أسئلة الدروس، واعرف نتيجتك ونقاط تحتاج إلى مراجعة.</p><div class="exam-hero-stats"><span>اختيار المادة</span><span>وقت محدد</span><span>تصحيح ومراجعة</span></div></div>'+
        '<div class="panel exam-setup"><h3>إعداد امتحان جديد</h3><label for="examSubject">المادة</label><select id="examSubject">'+SUBJECTS.map(s=>'<option value="'+s.id+'">'+esc(s.name)+'</option>').join('')+'</select>'+
        '<div class="exam-setup-grid"><div><label for="examCount">عدد الأسئلة</label><select id="examCount"><option value="5">5 أسئلة</option><option value="10" selected>10 أسئلة</option><option value="15">15 سؤالًا</option><option value="20">20 سؤالًا</option></select></div><div><label for="examMinutes">الوقت</label><select id="examMinutes"><option value="10">10 دقائق</option><option value="20" selected>20 دقيقة</option><option value="30">30 دقيقة</option><option value="45">45 دقيقة</option></select></div></div>'+
        '<p class="hint" id="examBankInfo"></p><button class="p" type="button" id="examStart">ابدأ الامتحان</button></div>'+
        '<section class="exam-history"><div class="row"><h3>سجل محاولاتك</h3><span class="hint">آخر 8 امتحانات</span></div><div id="examHistory"></div></section>';
      $('#examSubject').addEventListener('change',updateBankInfo);
      $('#examStart').addEventListener('click',startExam);
      updateBankInfo();
      renderHistory();
    }
    function updateBankInfo() {
      const bank=bankFor($('#examSubject').value);
      $('#examBankInfo').textContent=bank.length ? 'متاح حاليًا '+bank.length+' سؤالًا في بنك هذه المادة. سيختار الامتحان أسئلة متنوعة عشوائيًا.' : 'لا توجد أسئلة متاحة لهذه المادة حتى الآن.';
      $('#examStart').disabled=bank.length===0;
    }
    function startExam() {
      const subjectId=$('#examSubject').value;
      const bank=bankFor(subjectId);
      const requested=Number($('#examCount').value);
      if (!bank.length) return;
      const questions=shuffle(bank).slice(0,Math.min(requested,bank.length));
      const subject=SUBJECTS.find(s=>s.id===subjectId)?.name || 'كل المواد';
      const duration=Number($('#examMinutes').value)*60;
      active={subject,questions,answers:{},duration,endsAt:Date.now()+duration*1000,finished:false};
      renderExam();
      stopTimer();
      timer=global.setInterval(()=>{
        if (!active || active.finished) return;
        const left=Math.ceil((active.endsAt-Date.now())/1000);
        const clock=$('#examClock');
        if(clock){clock.textContent=fmt(left);clock.classList.toggle('exam-time-low',left<=60);}
        if(left<=0) finishExam(true);
      },250);
    }
    function renderExam() {
      const a=active;
      root.innerHTML='<div class="exam-live-head"><div><span class="welcome-kicker">EXAM IN PROGRESS</span><h2>'+esc(a.subject)+'</h2><p class="hint">'+a.questions.length+' سؤالًا · اختر إجابة واحدة لكل سؤال</p></div><div class="exam-clock" id="examClock">'+fmt(Math.ceil((a.endsAt-Date.now())/1000))+'</div></div>'+
        '<div class="exam-question-list">'+a.questions.map((q,i)=>
          '<article class="exam-question" data-question="'+i+'"><div class="exam-question-top"><span>السؤال '+(i+1)+' من '+a.questions.length+'</span><small>'+esc(q.lesson)+'</small></div><h3>'+esc(q.question)+'</h3><div class="exam-options">'+q.options.map((option,j)=>
            '<label><input type="radio" name="exam-q-'+i+'" value="'+j+'" '+(a.answers[i]===j?'checked':'')+'><span>'+esc(option)+'</span></label>'
          ).join('')+'</div></article>'
        ).join('')+'</div><div class="exam-submit-bar"><span class="hint" id="examAnswered">أجبت عن 0 من '+a.questions.length+'</span><button class="p" type="button" id="examSubmit">تسليم الامتحان</button></div>';
      root.querySelectorAll('.exam-options input').forEach(input=>input.addEventListener('change',()=>{
        const card=input.closest('[data-question]');
        a.answers[Number(card.dataset.question)]=Number(input.value);
        $('#examAnswered').textContent='أجبت عن '+Object.keys(a.answers).length+' من '+a.questions.length;
      }));
      $('#examSubmit').addEventListener('click',()=>finishExam(false));
    }
    function finishExam(byTime) {
      if(!active || active.finished)return;
      active.finished=true;stopTimer();
      const a=active;
      let correct=0;
      const reviewed=a.questions.map((q,i)=>{
        const selected=a.answers[i];
        const isCorrect=selected===q.answer;
        if(isCorrect)correct++;
        return {...q,selected,correct:isCorrect};
      });
      const percent=Math.round(correct/a.questions.length*100);
      const elapsed=Math.min(a.duration,Math.max(0,Math.round((Date.now()-(a.endsAt-a.duration*1000))/1000)));
      const record={id:Date.now().toString(36),subject:a.subject,total:a.questions.length,correct,percent,duration:elapsed,date:new Date().toLocaleString('ar-EG'),byTime};
      state.examHistory.unshift(record);
      state.examHistory=state.examHistory.slice(0,50);
      save();
      root.innerHTML='<div class="exam-result-hero"><span class="welcome-kicker">YOUR RESULT</span><h2>'+(percent>=85?'ممتاز! أداء قوي 👏':percent>=70?'أحسنت، استمر في التقدم':'انتهى الامتحان — راجع أخطاءك')+'</h2><div class="exam-score">'+percent+'<small>%</small></div><p>أجبت إجابة صحيحة عن '+correct+' من '+a.questions.length+' سؤالًا.</p>'+(byTime?'<p class="exam-time-note">انتهى الوقت وتم تسليم إجاباتك تلقائيًا.</p>':'')+'</div>'+
        '<div class="exam-result-actions"><button class="p" type="button" id="examAgain">امتحان جديد</button><button class="s" type="button" id="examShowHistory">عرض سجل المحاولات</button></div>'+
        '<h3>مراجعة الإجابات</h3><div class="exam-review-list">'+reviewed.map((q,i)=>
          '<article class="exam-review '+(q.correct?'is-correct':'is-wrong')+'"><b>السؤال '+(i+1)+': '+esc(q.question)+'</b><p>إجابتك: '+(q.selected===undefined?'<span>لم تجب</span>':esc(q.options[q.selected]))+'</p><p>الإجابة الصحيحة: <strong>'+esc(q.options[q.answer])+'</strong></p><p class="hint">'+esc(q.explanation)+'</p><small>'+esc(q.subject)+' · '+esc(q.lesson)+'</small></article>'
        ).join('')+'</div>';
      $('#examAgain').addEventListener('click',renderSetup);
      $('#examShowHistory').addEventListener('click',renderSetup);
    }
    renderSetup();
    return {render:renderSetup};
  }
  global.StudyExamCenter={init};
})(window);
