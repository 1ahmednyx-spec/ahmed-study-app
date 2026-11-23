/* Ahmed Study Platform — spaced revision center */
(function (global) {
  'use strict';

  function init({state, save, escapeHtml}) {
    const root = document.getElementById('smartReviewRoot');
    if (!root) return {render:function(){}};
    const esc = typeof escapeHtml === 'function' ? escapeHtml : value => String(value);
    state.smartReview = state.smartReview && typeof state.smartReview === 'object' && !Array.isArray(state.smartReview) ? state.smartReview : {};
    let session = null;
    let sessionIndex = 0;
    let revealed = false;
    let lastSummary = '';

    const today = () => {
      const d = new Date();
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    };
    const addDays = (date, days) => {
      const d = new Date(date + 'T12:00:00');
      d.setDate(d.getDate() + days);
      return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
    };
    const dateLabel = value => {
      if (!value) return 'اليوم';
      const d = new Date(value + 'T12:00:00');
      return Number.isNaN(d.getTime()) ? value : d.toLocaleDateString('ar-EG',{day:'numeric',month:'short'});
    };

    function collectItems() {
      const items = [];
      (Array.isArray(state.words) ? state.words : []).forEach(word => {
        if (!word || !word.id || !word.e) return;
        items.push({id:'word:'+word.id,source:'word',sourceId:String(word.id),kind:'كلمة إنجليزية',subject:'قاموس الكلمات',title:word.e,front:word.e,back:word.a || 'لم يُسجل المعنى بعد'});
      });
      (Array.isArray(state.mist) ? state.mist : []).forEach(mistake => {
        if (!mistake || !mistake.id || !mistake.q || Number(mistake.box) >= 2) return;
        items.push({id:'mistake:'+mistake.id,source:'mistake',sourceId:String(mistake.id),kind:'خطأ سابق',subject:mistake.s || 'مادة أخرى',title:mistake.q,front:mistake.q,back:'سبب الخطأ المسجل: ' + (mistake.r || 'لم يُحدد')});
      });
      const subjectLessons = global.StudySubjectCourses?.getReviewItems(state) || [];
      const englishLessons = global.StudyEnglishPath?.getReviewItems(state) || [];
      subjectLessons.concat(englishLessons).forEach(item => items.push({...item,kind:'درس مكتمل'}));
      return items.map(item => {
        const progress = state.smartReview[item.id] || {};
        const legacyMistake = item.source === 'mistake' ? state.mist.find(x => String(x.id) === item.sourceId) : null;
        const due = progress.due || (legacyMistake && legacyMistake.due) || today();
        return {...item, progress, due};
      });
    }

    function getStats() {
      const all = collectItems();
      const now = today();
      const due = all.filter(item => item.due <= now).sort((a,b) => {
        if (a.due !== b.due) return a.due.localeCompare(b.due);
        const priority = {mistake:0,word:1,lesson:2};
        return priority[a.source]-priority[b.source] || a.title.localeCompare(b.title,'ar');
      });
      const reviewed = Object.values(state.smartReview).filter(item => item && item.lastReviewed === now).length;
      const future = all.filter(item => item.due > now).sort((a,b)=>a.due.localeCompare(b.due));
      return {all,due,reviewed,future};
    }

    function renderSession() {
      const item = session && session[sessionIndex];
      if (!item) {
        root.innerHTML = '<div class="revision-complete"><span class="revision-check">✓</span><h2>أحسنت! أنهيت جلسة المراجعة</h2><p>'+esc(lastSummary || 'تم حفظ تقييماتك ومواعيد المراجعة القادمة.')+'</p><button class="p" type="button" data-review-home>عرض ملخص المراجعة</button></div>';
        return;
      }
      const total = session.length;
      root.innerHTML = '<div class="revision-session-head"><button class="s" type="button" data-review-exit>← إنهاء الجلسة</button><span>البطاقة '+(sessionIndex+1)+' من '+total+'</span></div>'+
        '<div class="revision-session-progress"><i style="width:'+Math.round(sessionIndex/total*100)+'%"></i></div>'+
        '<article class="revision-card" aria-live="polite"><span class="revision-kind">'+esc(item.kind)+' · '+esc(item.subject)+'</span><h2>'+esc(item.front)+'</h2>'+
        (revealed?'<div class="revision-answer"><b>الإجابة / المعلومة</b><p>'+esc(item.back).replace(/\n/g,'<br>')+'</p></div>':'<p class="revision-prompt">حاول استرجاع المعلومة من ذاكرتك قبل إظهار الإجابة.</p>')+
        (revealed?'<div class="revision-rating"><p>كيف كان تذكّرك؟</p><div class="revision-rating-grid"><button type="button" class="s" data-review-rate="again">لم أتذكر</button><button type="button" class="s" data-review-rate="hard">بصعوبة</button><button type="button" class="p" data-review-rate="good">جيد</button><button type="button" class="s" data-review-rate="easy">سهل</button></div></div>':'<button type="button" class="p revision-reveal" data-review-reveal>أظهر الإجابة</button>')+
        '</article>';
    }

    function render() {
      if (session) { renderSession(); return; }
      const stats = getStats();
      const dueCount = stats.due.length;
      const next = stats.future[0];
      const preview = stats.due.slice(0,5);
      root.innerHTML = '<div class="revision-heading"><div><span class="eyebrow">SPACED REPETITION</span><h2>المراجعة الذكية</h2><p>راجع على فترات متباعدة حتى تثبت المعلومات في ذاكرتك.</p></div><span class="revision-day">'+esc(today())+'</span></div>'+
        '<div class="revision-stats"><article><small>مستحق اليوم</small><strong>'+dueCount+'</strong></article><article><small>راجعت اليوم</small><strong>'+stats.reviewed+'</strong></article><article><small>إجمالي البطاقات</small><strong>'+stats.all.length+'</strong></article></div>'+
        '<div class="revision-main"><section class="revision-panel"><div class="revision-panel-title"><div><span class="eyebrow">TODAY’S QUEUE</span><h3>قائمة مراجعتك اليوم</h3></div><span class="revision-count">'+Math.min(dueCount,10)+' / 10</span></div>'+
        (dueCount?'<div class="revision-preview">'+preview.map(item=>'<div class="revision-preview-item"><span class="revision-type">'+esc(item.kind)+'</span><div><b>'+esc(item.title)+'</b><small>'+esc(item.subject)+' · '+(item.due<today()?'متأخر':'مستحق اليوم')+'</small></div></div>').join('')+(dueCount>5?'<p class="revision-muted">و '+(dueCount-5)+' بطاقات أخرى مستحقة.</p>':'')+'</div>':'<div class="revision-empty"><b>لا توجد مراجعات مستحقة الآن.</b><p>'+(next?'المراجعة التالية: '+dateLabel(next.due):'أكمل درسًا أو أضف كلمة أو سجل خطأ لتبدأ البطاقات في الظهور.')+'</p></div>')+
        '<button type="button" class="p revision-start" data-review-start '+(dueCount?'':'disabled')+'>ابدأ جلسة اليوم ('+Math.min(dueCount,10)+' بطاقات)</button></section>'+
        '<aside class="revision-panel revision-how"><span class="eyebrow">HOW IT WORKS</span><h3>كيف يعمل التكرار المتباعد؟</h3><ul><li><b>لم أتذكر:</b> أعد البطاقة غدًا.</li><li><b>بصعوبة:</b> زد الفاصل قليلًا.</li><li><b>جيد:</b> انتقل إلى فاصل أطول.</li><li><b>سهل:</b> وسّع الفاصل بشكل أكبر.</li></ul><p class="revision-muted">تظهر هنا الكلمات والأخطاء والدروس التي وضعت علامة إتمام عليها.</p></aside></div>'+
        '<p class="revision-footnote">تُحفظ مواعيد المراجعة محليًا داخل بيانات المنصة الحالية. لا يتم حذف أو استبدال بيانات الكلمات أو الأخطاء أو تقدم الدروس.</p>';
    }

    function startSession() {
      const stats = getStats();
      session = stats.due.slice(0,10);
      sessionIndex = 0;
      revealed = false;
      lastSummary = '';
      renderSession();
    }

    function rate(value) {
      const item = session && session[sessionIndex];
      if (!item) return;
      const previous = state.smartReview[item.id] || {};
      let reps = Number(previous.reps) || 0;
      let interval = Number(previous.interval) || 0;
      let lapses = Number(previous.lapses) || 0;
      if (value === 'again') { reps = 0; interval = 1; lapses += 1; }
      else if (value === 'hard') { interval = Math.max(1, Math.ceil((interval || 1) * 1.2)); reps = Math.max(1, reps + 1); }
      else if (value === 'good') { interval = reps === 0 ? 1 : reps === 1 ? 3 : Math.max(7, Math.round((interval || 3) * 2)); reps += 1; }
      else if (value === 'easy') { interval = Math.max(4, Math.round((interval || 2) * 2.5)); reps += 1; }
      state.smartReview[item.id] = {
        source:item.source, sourceId:item.sourceId, due:addDays(today(),interval),
        interval, reps, lapses, lastRating:value, lastReviewed:today()
      };
      save();
      sessionIndex += 1;
      revealed = false;
      if (sessionIndex >= session.length) {
        lastSummary = 'راجعت '+session.length+' بطاقة. تم حفظ المواعيد القادمة تلقائيًا.';
        session = null;
        render();
      } else renderSession();
    }

    root.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.matches('[data-review-start]')) startSession();
      else if (button.matches('[data-review-reveal]')) { revealed = true; renderSession(); }
      else if (button.matches('[data-review-rate]')) rate(button.dataset.reviewRate);
      else if (button.matches('[data-review-exit], [data-review-home]')) { session = null; revealed = false; render(); }
    });

    render();
    return {render};
  }

  global.StudySmartRevision = Object.freeze({init});
})(window);
