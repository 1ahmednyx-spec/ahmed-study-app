/* Official Ministry textbook library for Egypt's 2026/2027 Thanaweya Amma. */
(function () {
  const $ = selector => document.querySelector(selector);
  const MINISTRY_LIBRARY = 'https://studentbooks.moe.gov.eg/Books';
  const commonSubjects = [
    { name: 'اللغة الأجنبية الثانية', icon: '🌐' },
    { name: 'التربية الدينية', icon: '🕌' },
    { name: 'التربية الوطنية', icon: '🇪🇬' }
  ];
  const trackSubjects = {
    sci: [
      { name: 'اللغة العربية', icon: '📖' },
      { name: 'اللغة الأجنبية الأولى', icon: '🇬🇧' },
      { name: 'الأحياء', icon: '🧬' },
      { name: 'الكيمياء', icon: '🧪' },
      { name: 'الفيزياء', icon: '⚛️' }
    ],
    math: [
      { name: 'اللغة العربية', icon: '📖' },
      { name: 'اللغة الأجنبية الأولى', icon: '🇬🇧' },
      { name: 'الرياضيات', icon: '📐' },
      { name: 'الكيمياء', icon: '🧪' },
      { name: 'الفيزياء', icon: '⚛️' }
    ],
    lit: [
      { name: 'اللغة العربية', icon: '📖' },
      { name: 'اللغة الأجنبية الأولى', icon: '🇬🇧' },
      { name: 'التاريخ', icon: '🏛️' },
      { name: 'الجغرافيا', icon: '🗺️' },
      { name: 'الإحصاء', icon: '📊' }
    ]
  };
  const trackLabels = { sci: 'علمي علوم', math: 'علمي رياضة', lit: 'أدبي' };
  let selected = '';
  let track = 'sci';

  function getSubjects() {
    return [...(trackSubjects[track] || trackSubjects.sci), ...commonSubjects];
  }

  function render() {
    const grid = $('#ministrySubjectGrid');
    const detail = $('#ministrySubjectDetail');
    if (!grid || !detail) return;

    const query = ($('#ministryBookSearch')?.value || '').trim().toLocaleLowerCase('ar');
    const subjects = getSubjects();
    if (!subjects.some(subject => subject.name === selected)) selected = subjects[0]?.name || '';
    const filtered = subjects.filter(subject => subject.name.toLocaleLowerCase('ar').includes(query));

    grid.innerHTML = filtered.map(subject =>
      '<button type="button" class="ministry-subject-card' +
      (selected === subject.name ? ' active' : '') +
      '" data-ministry-subject="' + subject.name + '">' +
      '<span class="ministry-subject-icon" aria-hidden="true">' + subject.icon + '</span>' +
      '<span><b>' + subject.name + '</b><small>' +
      (commonSubjects.some(item => item.name === subject.name) ? 'مادة مشتركة • تحقق من توفر الكتاب' : 'مادة تخصصية • الصف الثالث الثانوي') +
      '</small></span><span class="ministry-subject-arrow" aria-hidden="true">←</span></button>'
    ).join('') || '<p class="empty">لا توجد مادة مطابقة للبحث.</p>';

    grid.querySelectorAll('[data-ministry-subject]').forEach(button => {
      button.addEventListener('click', () => {
        selected = button.dataset.ministrySubject;
        render();
      });
    });

    const current = subjects.find(subject => subject.name === selected);
    if (!current) {
      detail.innerHTML = '';
      return;
    }

    const isCommon = commonSubjects.some(item => item.name === selected);
    detail.innerHTML =
      '<div class="ministry-detail-heading"><div><span class="eyebrow">OFFICIAL MINISTRY BOOK</span><h2>' + current.name +
      '</h2><p>الصف الثالث الثانوي • ' + trackLabels[track] + (isCommon ? ' • مادة عامة' : ' • مادة تخصصية') + '</p></div>' +
      '<span class="ministry-detail-icon" aria-hidden="true">' + current.icon + '</span></div>' +
      '<div class="ministry-book-row"><div class="ministry-book-cover" aria-hidden="true">📘</div>' +
      '<div class="ministry-book-info"><b>كتاب الوزارة الرسمي</b>' +
      '<small>العام الدراسي 2026/2027 — عند توفر النسخة على مكتبة الوزارة</small>' +
      '<span class="ministry-source-status">المصدر: وزارة التربية والتعليم</span></div></div>' +
      '<div class="ministry-book-actions"><a class="p ministry-open-link" href="' + MINISTRY_LIBRARY +
      '" target="_blank" rel="noopener">افتح مكتبة الكتب الرسمية واختر الكتاب <span aria-hidden="true">↗</span></a></div>' +
      '<ol class="ministry-book-steps"><li>اختر المرحلة الثانوية.</li><li>اختر الصف الثالث الثانوي والعام الدراسي 2026/2027.</li>' +
      '<li>اختر مادة ' + current.name + ' ثم افتح الكتاب أو حمّله إذا أتاح الموقع ذلك.</li></ol>' +
      '<p class="hint">هذا رابط بوابة الكتب الرسمية وليس رابط PDF مباشرًا. لم نعرض قارئًا داخليًا أو زر تنزيل مستقلًا لأن رابط ملف الكتاب لم يُتحقق منه بعد.</p>';
  }

  function init() {
    const trackSelect = $('#trk');
    track = trackSelect?.value || 'sci';
    selected = getSubjects()[0]?.name || '';
    $('#ministryBookSearch')?.addEventListener('input', render);
    trackSelect?.addEventListener('change', event => {
      track = event.target.value;
      selected = getSubjects()[0]?.name || '';
      render();
    });
    render();
  }

  window.StudyMinistryLibrary = { init, render };
  window.ministryLibraryRender = render;
})();
