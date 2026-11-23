/* Past examination archive — metadata-first catalogue.
   Only verified exam files should be added to EXAMS with an official source URL. */
(function () {
  const YEARS = Array.from({ length: 8 }, (_, index) => String(2019 + index));
  const SUBJECTS = [
    'اللغة العربية', 'اللغة الأجنبية الأولى', 'اللغة الأجنبية الثانية',
    'الأحياء', 'الكيمياء', 'الفيزياء', 'الرياضيات',
    'التاريخ', 'الجغرافيا', 'الإحصاء', 'الفلسفة والمنطق', 'علم النفس والاجتماع', 'الاقتصاد', 'التربية الوطنية', 'كل المواد'
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

  // Verified Ministry-hosted files. Answers and model papers are classified separately from exam papers.
  const EXAMS = [
  {
    "id": "2020-chemistry-first",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "الكيمياء",
    "type": "official",
    "typeLabel": "امتحان وزارة رسمي — فئات خاصة",
    "fileKind": "paper",
    "title": "امتحان الكيمياء — نسخة دمج للمكفوفين",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/ivpmsmdj/الكيمياء-دمج_مكفوفين_1.pdf",
    "fileLabel": "فتح ورقة الامتحان"
  },
  {
    "id": "2020-psychology-second",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "علم النفس والاجتماع",
    "type": "official",
    "typeLabel": "امتحان وزارة رسمي — فئات خاصة",
    "fileKind": "paper",
    "title": "امتحان علم النفس والاجتماع — نسخة دمج (الدور الثاني)",
    "round": "الدور الثاني",
    "pdfUrl": "https://moe.gov.eg/media/sh5lfevy/علم_نفس_دور_ثانى-شلل.pdf",
    "fileLabel": "فتح ورقة الامتحان"
  },
  {
    "id": "2020-economics-answer",
    "year": "2020",
    "system": "modern",
    "systemLabel": "نظام الثانوية العامة 2020",
    "subject": "الاقتصاد",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — فئات خاصة",
    "fileKind": "answer",
    "title": "نموذج إجابة الاقتصاد — نسخة لضعاف السمع",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/rnkh43k0/نموذج_اجابه_الاقتصاد-ضعاف_سمع.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-science-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الفيزياء",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي — الشعبة العلمية",
    "fileKind": "answer",
    "title": "نموذج إجابة الفيزياء باللغة العربية — الشعبة العلمية",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/evqfv1il/scinece-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-math-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الرياضيات",
    "type": "official",
    "typeLabel": "نموذج إجابة رسمي",
    "fileKind": "answer",
    "title": "نماذج إجابة الرياضيات — الشعبة العلمية",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/tzfj0lya/mathematica-exammodels.pdf",
    "fileLabel": "فتح نموذج الإجابة"
  },
  {
    "id": "2023-literary-answer",
    "year": "2023",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "كل المواد",
    "type": "official",
    "typeLabel": "نماذج إجابة رسمية — الشعبة الأدبية",
    "fileKind": "answer",
    "title": "نماذج إجابة مواد الشعبة الأدبية — 2023",
    "round": "الدور الأول",
    "pdfUrl": "https://moe.gov.eg/media/xmhd3sow/arts-answermodels.pdf",
    "fileLabel": "فتح نماذج الإجابة"
  },
  {
    "id": "2019-history-model",
    "year": "2019",
    "system": "legacy",
    "systemLabel": "نظام الثانوية العامة 2019",
    "subject": "التاريخ",
    "type": "model",
    "typeLabel": "نموذج استرشادي رسمي — فئة ضعاف السمع",
    "fileKind": "model",
    "title": "نموذج امتحان التاريخ — نظام الدمج (ضعاف السمع)",
    "round": "نموذج استرشادي",
    "pdfUrl": "https://moe.gov.eg/media/y1hdk03m/history_hearing_weakness_guide_19.pdf",
    "fileLabel": "فتح النموذج الاسترشادي"
  },
  {
    "id": "2026-applied-math-model-5",
    "year": "2026",
    "system": "modern",
    "systemLabel": "النظام الحديث",
    "subject": "الرياضيات",
    "type": "model",
    "typeLabel": "نموذج استرشادي رسمي",
    "fileKind": "model",
    "title": "النموذج الاسترشادي الخامس — الرياضيات التطبيقية",
    "round": "العام الدراسي 2025/2026",
    "pdfUrl": "https://ellibrary.moe.gov.eg/sec3guideforms/publish5/Applid_Math_EN_Model_5.pdf",
    "fileLabel": "فتح النموذج الاسترشادي"
  },
{
  "id": "2021-history-trial-answer",
  "year": "2021",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2021",
  "subject": "التاريخ",
  "type": "model",
  "typeLabel": "إجابة امتحان تجريبي رسمي",
  "fileKind": "answer",
  "title": "إجابة امتحان التاريخ التجريبي — يونيو 2021",
  "round": "اختبار تجريبي — وليس امتحان الدور النهائي",
  "pdfUrl": "https://moe.gov.eg/media/qe4doi3f/history-answer.pdf",
  "fileLabel": "فتح إجابة النموذج"
},
{
  "id": "2023-ministry-exam-portal",
  "year": "2023",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2023",
  "subject": "كل المواد",
  "type": "official",
  "typeLabel": "بوابة امتحانات الوزارة",
  "title": "بوابة امتحانات الثانوية العامة 2022/2023",
  "round": "الدور الأول",
  "pdfUrl": "https://moe.gov.eg/ar/exam-model2022-2023/",
  "fileLabel": "فتح بوابة الوزارة"
},
{
  "id": "2024-madrasetna-plus",
  "year": "2024",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2024",
  "subject": "كل المواد",
  "type": "official",
  "typeLabel": "مصدر رسمي — مدرستنا بلس",
  "title": "أسئلة وإجابات امتحانات 2023/2024 والنماذج الأربعة",
  "round": "الدور الأول",
  "pdfUrl": "https://madrasetnaplus.eg/",
  "fileLabel": "فتح المصدر الرسمي"
},
{
  "id": "2025-ministry-models",
  "year": "2025",
  "system": "modern",
  "systemLabel": "نظام الثانوية العامة 2025",
  "subject": "كل المواد",
  "type": "model",
  "typeLabel": "بوابة النماذج الاسترشادية الرسمية",
  "title": "نماذج الثانوية العامة 2025",
  "round": "نماذج استرشادية",
  "pdfUrl": "https://content.moe.gov.eg/qa",
  "fileLabel": "فتح بوابة الوزارة"
}
];

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
      document.getElementById('pastExamCount').textContent = `${filtered.length} ملف موثق من أصل ${EXAMS.length}`;
      const results = document.getElementById('pastExamResults');
      if (!filtered.length) {
        results.innerHTML = `
          <div class="past-exam-empty">
            <span aria-hidden="true">📚</span>
            <h3>الأرشيف قيد التجهيز</h3>
            <p>${EXAMS.length ? 'لا توجد ملفات تطابق خيارات البحث الحالية. ما زالت بقية السنوات والمواد قيد الجمع والتحقق.' : 'لم نضف ملفات بعد. سنضيف كل امتحان بعد التحقق من الملف ومصدره الرسمي، ولن نعرض روابط تجريبية أو ملفات غير مؤكدة.'}</p>
            <small>الفلاتر جاهزة — محتوى الامتحانات سيُضاف على مراحل.</small>
          </div>`;
        return;
      }
      results.innerHTML = filtered.map(exam => `
        <article class="past-exam-card">
          <div class="past-exam-card-top"><span>${escapeHTML(exam.typeLabel)}</span><b>${escapeHTML(exam.year)}</b></div>
          <h3>${escapeHTML(exam.subject)}</h3>
          <p>${escapeHTML(exam.title)} · ${escapeHTML(exam.round)}</p>
          <div class="past-exam-card-meta"><span>${escapeHTML(exam.systemLabel)}</span><a href="${escapeHTML(exam.pdfUrl)}" target="_blank" rel="noopener noreferrer">${escapeHTML(exam.fileLabel || "فتح الملف")} ↗</a></div>
          ${exam.answerUrl ? `<a class="past-exam-answer" href="${escapeHTML(exam.answerUrl)}" target="_blank" rel="noopener noreferrer">نموذج الإجابة ↗</a>` : ''}
        </article>`).join('');
    }
  }

  window.StudyPastExamArchive = { init, years: YEARS.slice(), subjects: SUBJECTS.slice() };
})();
