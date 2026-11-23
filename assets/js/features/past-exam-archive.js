/* Past examination archive — metadata-first catalogue.
   Only verified exam files should be added to EXAMS with an official source URL. */
(function () {
  const YEARS = Array.from({ length: 8 }, (_, index) => String(2019 + index));
  const SUBJECTS = [
    'اللغة العربية', 'اللغة الأجنبية الأولى', 'اللغة الأجنبية الثانية',
    'الأحياء', 'الكيمياء', 'الفيزياء', 'الرياضيات',
    'التاريخ', 'الجغرافيا', 'الإحصاء', 'الفلسفة والمنطق'
  ];
  const SYSTEMS = [
    { value: 'all', label: 'كل الأنظمة' },
    { value: 'legacy', label: 'النظام القديم' },
    { value: 'modern', label: 'النظام الحديث' },
    { value: 'baccalaureate', label: 'البكالوريا المصرية' }
  ];
  const TYPES = [
    { value: 'official', label: 'امتحان وزارة رسمي' },
    { value: 'governorate', label: 'امتحان محافظة / إدارة' },
    { value: 'model', label: 'نموذج استرشادي' }
  ];

  // Intentionally empty until each PDF and its provenance are verified.
  const EXAMS = [];

  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const option = (item, selected) =>
    `<option value="${escapeHTML(item.value)}" ${item.value === selected ? 'selected' : ''}>${escapeHTML(item.label)}</option>`;

  function init() {
    const root = document.getElementById('pastExamArchiveRoot');
    if (!root) return;
    root.innerHTML = `
      <div class="past-exam-hero">
        <span class="eyebrow">PAST EXAMINATIONS · 2019–2026</span>
        <h2>أرشيف امتحانات الثانوية العامة</h2>
        <p>امتحانات الوزارة الرسمية، وامتحانات المحافظات، والنماذج الاسترشادية — مع فصل كل نظام تعليمي عن الآخر.</p>
        <div class="past-exam-stats">
          <div><strong>8</strong><span>سنوات مستهدفة</span></div>
          <div><strong>${SUBJECTS.length}</strong><span>مواد وفروع</span></div>
          <div><strong>3</strong><span>أنواع مصادر</span></div>
        </div>
      </div>
      <div class="panel past-exam-filters">
        <div class="past-exam-filter-grid">
          <div><label for="pastExamSystem">النظام التعليمي</label><select id="pastExamSystem">${SYSTEMS.map(item => option(item, 'all')).join('')}</select></div>
          <div><label for="pastExamYear">السنة</label><select id="pastExamYear"><option value="all">كل السنوات</option>${YEARS.map(year => `<option value="${year}">${year}</option>`).join('')}</select></div>
          <div><label for="pastExamSubject">المادة</label><select id="pastExamSubject"><option value="all">كل المواد</option>${SUBJECTS.map(subject => `<option value="${escapeHTML(subject)}">${escapeHTML(subject)}</option>`).join('')}</select></div>
          <div><label for="pastExamType">نوع الامتحان</label><select id="pastExamType"><option value="all">كل الأنواع</option>${TYPES.map(item => option(item, '')).join('')}</select></div>
        </div>
        <label for="pastExamSearch">بحث داخل الأرشيف</label>
        <input id="pastExamSearch" type="search" placeholder="ابحث باسم المادة أو السنة أو الدور...">
      </div>
      <div class="past-exam-results-head"><div><h3>الامتحانات والملفات</h3><span id="pastExamCount" class="hint"></span></div><span class="past-exam-integrity">المصدر يُراجع قبل الإضافة</span></div>
      <div id="pastExamResults" class="past-exam-results" aria-live="polite"></div>
      <div class="panel past-exam-note">
        <h3>كيف نضمن دقة الأرشيف؟</h3>
        <ul>
          <li>لن يُصنّف أي ملف على أنه رسمي إلا بعد التحقق من مصدر وزارة التربية والتعليم.</li>
          <li>سنفصل الدور الأول عن الدور الثاني، ونماذج الأسئلة عن نماذج الإجابة.</li>
          <li>امتحانات المحافظات والنماذج الاسترشادية ستظهر بتصنيف واضح، لا كأنها امتحانات وزارة.</li>
          <li>السنوات التي لم تتوفر لها ملفات موثقة ستظل معلّمة بأنها قيد الاستكمال.</li>
        </ul>
        <a href="https://moe.gov.eg/" target="_blank" rel="noopener noreferrer">الموقع الرسمي لوزارة التربية والتعليم المصرية</a>
      </div>`;

    const controls = ['pastExamSystem', 'pastExamYear', 'pastExamSubject', 'pastExamType', 'pastExamSearch']
      .map(id => document.getElementById(id));
    controls.forEach(control => control.addEventListener('input', render));
    render();

    function render() {
      const [system, year, subject, type, search] = controls.map(control => control.value.trim().toLowerCase());
      const filtered = EXAMS.filter(exam =>
        (system === 'all' || exam.system === system) &&
        (year === 'all' || exam.year === year) &&
        (subject === 'all' || exam.subject === controls[2].value) &&
        (type === 'all' || exam.type === type) &&
        (!search || [exam.year, exam.subject, exam.round, exam.title, exam.systemLabel, exam.typeLabel].join(' ').toLowerCase().includes(search))
      );
      document.getElementById('pastExamCount').textContent = `${filtered.length} ملف موثق`;
      const results = document.getElementById('pastExamResults');
      if (!filtered.length) {
        results.innerHTML = `
          <div class="past-exam-empty">
            <span aria-hidden="true">📚</span>
            <h3>الأرشيف قيد التجهيز</h3>
            <p>${EXAMS.length ? 'لا توجد ملفات تطابق خيارات البحث الحالية.' : 'لم نضف ملفات بعد. سنضيف كل امتحان بعد التحقق من الملف ومصدره الرسمي، ولن نعرض روابط تجريبية أو ملفات غير مؤكدة.'}</p>
            <small>الفلاتر جاهزة — محتوى الامتحانات سيُضاف على مراحل.</small>
          </div>`;
        return;
      }
      results.innerHTML = filtered.map(exam => `
        <article class="past-exam-card">
          <div class="past-exam-card-top"><span>${escapeHTML(exam.typeLabel)}</span><b>${escapeHTML(exam.year)}</b></div>
          <h3>${escapeHTML(exam.subject)}</h3>
          <p>${escapeHTML(exam.title)} · ${escapeHTML(exam.round)}</p>
          <div class="past-exam-card-meta"><span>${escapeHTML(exam.systemLabel)}</span><a href="${escapeHTML(exam.pdfUrl)}" target="_blank" rel="noopener noreferrer">فتح ملف الامتحان ↗</a></div>
          ${exam.answerUrl ? `<a class="past-exam-answer" href="${escapeHTML(exam.answerUrl)}" target="_blank" rel="noopener noreferrer">نموذج الإجابة ↗</a>` : ''}
        </article>`).join('');
    }
  }

  window.StudyPastExamArchive = { init, years: YEARS.slice(), subjects: SUBJECTS.slice() };
})();
