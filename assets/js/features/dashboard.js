/* Ahmed Study Platform — live study dashboard */
(function (global) {
  'use strict';
  function init({state, escapeHtml: esc}) {
    const root = document.getElementById('smartDashboard');
    if (!root) return;
    const safe = typeof esc === 'function' ? esc : value => String(value);
    const pad = value => String(value).padStart(2, '0');
    const dateKey = date => date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate());
    const today = new Date();
    const todayKey = dateKey(today);
    const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const dateLabel = value => {
      const date = new Date(value + 'T12:00:00');
      return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('ar-EG', {day:'numeric',month:'short'});
    };
    const subjectStats = () => {
      const subjects = global.StudySubjectCourses?.getProgressStats(state) || [];
      const english = global.StudyEnglishPath?.getProgressStats(state);
      if (english) subjects.push(english);
      return subjects;
    };
    function snapshot() {
      const subjects = subjectStats();
      const completedLessons = subjects.reduce((sum, item) => sum + item.completed, 0);
      const totalLessons = subjects.reduce((sum, item) => sum + item.total, 0);
      const exams = Array.isArray(state.examHistory) ? state.examHistory : [];
      const validExams = exams.filter(item => Number.isFinite(Number(item.percent)));
      const average = validExams.length ? Math.round(validExams.reduce((sum, item) => sum + Number(item.percent), 0) / validExams.length) : null;
      const practice = (Array.isArray(state.prac) ? state.prac : []).filter(item => {
        if (!item.d) return false;
        const date = new Date(item.d + 'T12:00:00');
        return !Number.isNaN(date.getTime()) && date >= weekStart && date <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      });
      const questions = practice.reduce((sum, item) => sum + (Number(item.n) || 0), 0);
      const correct = practice.reduce((sum, item) => sum + (Number(item.c) || 0), 0);
      const activeDays = new Set(practice.map(item => item.d)).size;
      const events = (Array.isArray(state.ev) ? state.ev : []).filter(item => !item.done && item.d && item.t)
        .map(item => ({...item, at:new Date(item.d + 'T' + item.t)}))
        .filter(item => !Number.isNaN(item.at.getTime()) && item.at >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
        .sort((a,b) => a.at-b.at);
      return {subjects, completedLessons,totalLessons,exams,validExams,average,practice,questions,correct,activeDays,events};
    }
    function render() {
      const data = snapshot();
      const overall = data.totalLessons ? Math.round(data.completedLessons / data.totalLessons * 100) : 0;
      const bestNext = data.subjects.filter(item => item.total > 0).sort((a,b) => a.percent-b.percent)[0];
      const nextEvent = data.events[0];
      const recent = data.validExams.slice(0,3);
      const activityPercent = data.questions ? Math.round(data.correct / data.questions * 100) : 0;
      root.innerHTML =
        '<div class="smart-heading"><div><span class="eyebrow">YOUR LEARNING OVERVIEW</span><h2>لوحة تقدمك</h2><p>ملخص مباشر لما أنجزته وما يحتاج إلى متابعة.</p></div><span class="smart-updated">تُحدّث عند فتح الرئيسية</span></div>'+
        '<div class="smart-metrics">'+
          '<article class="smart-metric"><span class="smart-metric-icon">✓</span><small>الدروس المكتملة</small><strong>'+data.completedLessons+' <em>/ '+data.totalLessons+'</em></strong><div class="smart-mini-track"><i style="width:'+overall+'%"></i></div><b>'+overall+'% من إجمالي الدروس</b></article>'+
          '<article class="smart-metric"><span class="smart-metric-icon">✎</span><small>الاختبارات المنجزة</small><strong>'+data.validExams.length+'</strong><b>'+(data.average===null?'لم تسجل نتيجة بعد':'متوسط الدرجات '+data.average+'%')+'</b></article>'+
          '<article class="smart-metric"><span class="smart-metric-icon">◎</span><small>أسئلة هذا الأسبوع</small><strong>'+data.questions+'</strong><b>'+data.activeDays+' أيام نشاط خلال آخر 7 أيام</b></article>'+
          '<article class="smart-metric"><span class="smart-metric-icon">★</span><small>دقة إجابات التدريب</small><strong>'+(data.questions?activityPercent+'%':'—')+'</strong><b>'+(data.questions?data.correct+' إجابة صحيحة من '+data.questions:'ابدأ تسجيل جلسات التدريب')+'</b></article>'+
        '</div>'+
        '<div class="smart-columns"><section class="smart-card"><div class="smart-card-heading"><div><span class="eyebrow">SUBJECT TRACKER</span><h3>تقدم المواد</h3></div><span class="smart-muted">'+data.subjects.length+' مسارات</span></div>'+
          (data.subjects.length?data.subjects.map(item=>'<div class="smart-subject"><div class="smart-subject-line"><b>'+safe(item.name)+'</b><span>'+item.completed+'/'+item.total+' · '+item.percent+'%</span></div><div class="smart-progress"><i style="width:'+item.percent+'%"></i></div></div>').join(''):'<p class="smart-muted">لا توجد بيانات تقدم متاحة بعد.</p>')+
        '</section><section class="smart-card"><div class="smart-card-heading"><div><span class="eyebrow">NEXT STEPS</span><h3>ماذا تتابع الآن؟</h3></div></div>'+
          (nextEvent?'<div class="smart-next-item"><small>الموعد القادم</small><b>'+safe(nextEvent.title)+'</b><span>'+dateLabel(nextEvent.d)+' · '+safe(nextEvent.t)+'</span><button class="s" type="button" data-go-tab="sched">فتح جدول المذاكرة</button></div>':
          '<div class="smart-next-item"><small>لا توجد مواعيد قادمة</small><b>خطط لجلسة مذاكرة جديدة</b><span>أضف موعدًا حتى تتابع التزاماتك من هنا.</span><button class="s" type="button" data-go-tab="sched">إضافة موعد مذاكرة</button></div>')+
          (bestNext?'<div class="smart-focus"><small>مسار يحتاج إلى اهتمام</small><b>'+safe(bestNext.name)+'</b><span>نسبة الإنجاز الحالية '+bestNext.percent+'%</span><button class="s" type="button" data-go-tab="'+bestNext.id+'">متابعة المادة</button></div>':'')+
        '</section></div>'+
        '<section class="smart-card smart-recent"><div class="smart-card-heading"><div><span class="eyebrow">RECENT RESULTS</span><h3>آخر نتائج الاختبارات</h3></div><button class="s" type="button" data-go-tab="examCenter">مركز الاختبارات</button></div>'+
          (recent.length?'<div class="smart-results">'+recent.map(item=>'<div class="smart-result"><div><b>'+safe(item.subject||'اختبار')+'</b><small>'+safe(item.date||'')+' · '+(Number(item.correct)||0)+'/'+(Number(item.total)||0)+' صحيحة</small></div><strong class="'+(Number(item.percent)>=70?'smart-score-good':'smart-score-low')+'">'+Number(item.percent)+'%</strong></div>').join('')+'</div>':'<p class="smart-muted">لم تسجل اختبارات بعد. ابدأ اختبارًا لتظهر نتائجك هنا.</p>')+
        '</section>'+
        '<p class="smart-footnote">تعرض اللوحة البيانات المحفوظة على هذا الجهاز فقط. لا نحسب ساعات مذاكرة غير مسجلة، ولا نعرض إحصاءات غير متوفرة.</p>';
    }
    render();
    return {render};
  }
  global.StudyDashboard = Object.freeze({init});
})(window);
