/* Official Ministry textbook library for Egypt's 2026/2027 Thanaweya Amma. */
(function () {
  const $ = selector => document.querySelector(selector);
  const MINISTRY_LIBRARY = 'https://studentbooks.moe.gov.eg/Books';
  // Direct textbook links are added only when supplied or verified for the exact grade/year.
  const directBooks = {
    'اللغة العربية': {
      title: 'كتاب اللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Arabic_language_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.',
      supplementaryBooks: [
        {
          title: 'كتاب اللغة العربية — القصة — الفصل الدراسي الأول',
          actionLabel: 'القصة',
          url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Arabic_language_Story_Sec3.pdf'
        },
        {
          title: 'كتاب اللغة العربية — القواعد الأساسية للنحو والصرف — الفصل الدراسي الأول',
          actionLabel: 'القواعد',
          url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Arabic_language_NAHO_Sec3.pdf'
        }
      ]
    },
    'الكيمياء': {
      title: 'كتاب الكيمياء باللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Chemistry_Arabic_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'اللغة الأجنبية الأولى': {
      title: 'كتاب اللغة الإنجليزية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/English_language_Sec3_tr1.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'اللغة الأجنبية الثانية': {
      title: 'كتاب اللغة الفرنسية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Premiere_langue_francaise_SB_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'الأحياء': {
      title: 'كتاب الأحياء باللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Biology_ARABIC_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'الفيزياء': {
      title: 'كتاب الفيزياء باللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Physics_Arabic_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'الرياضيات البحتة': {
      title: 'كتاب الرياضيات البحتة باللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/pure_Mathematics_ARABIC_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'الرياضيات': {
      title: 'كتاب الرياضيات البحتة — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/pure_Mathematics_ARABIC_Sec3.pdf',
      note: 'يضم سجل الرياضيات كتابي الرياضيات البحتة والتطبيقية المتاحين في المكتبة.',
      supplementaryBooks: [
        {
          title: 'كتاب الرياضيات التطبيقية باللغة العربية — الفصل الدراسي الأول',
          actionLabel: 'الرياضيات التطبيقية',
          url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/applied_Mathematics_ARABIC_Sec3.pdf'
        }
      ]
    },
    'الرياضيات التطبيقية': {
      title: 'كتاب الرياضيات التطبيقية باللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/applied_Mathematics_ARABIC_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'الإحصاء': {
      title: 'كتاب الإحصاء باللغة العربية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Statistics_Arabic_Sec3.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'التربية الوطنية': {
      title: 'كتاب التربية الوطنية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/National_Education_Sec3_tr1.pdf',
      note: 'رابط ملف PDF الذي أرسله المستخدم؛ لم نتمكن من فحص استجابة خادم الملفات آليًا.'
    },
    'التربية الدينية': {
      title: 'كتب التربية الدينية — الفصل الدراسي الأول',
      year: '2026/2027',
      term: 'الفصل الدراسي الأول',
      note: 'اختر الكتاب المناسب لك. الروابط أرسلها المستخدم ولم نتمكن من فحص استجابة خادم الملفات آليًا.',
      supplementaryBooks: [
        {
          title: 'كتاب التربية الدينية الإسلامية — الفصل الدراسي الأول',
          actionLabel: 'التربية الدينية الإسلامية',
          url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Islamic_religion_Sec3.pdf'
        },
        {
          title: 'كتاب التربية الدينية المسيحية — الفصل الدراسي الأول',
          actionLabel: 'التربية الدينية المسيحية',
          url: 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Christian_religion_Sec3.pdf'
        }
      ]
    }
  };
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
    const book = directBooks[current.name];
    const bookContent = book
      ? '<div class="ministry-book-row"><div class="ministry-book-cover" aria-hidden="true">📕</div>' +
        '<div class="ministry-book-info"><b>' + book.title + '</b>' +
        '<small>الصف الثالث الثانوي • ' + book.year + ' • ' + book.term + '</small>' +
        '<span class="ministry-source-status">ملف PDF مباشر — رابط مقدم للمكتبة</span></div></div>' +
        '<div class="ministry-book-actions">' +
        '<a class="p ministry-open-link" href="' + book.url + '" target="_blank" rel="noopener">عرض الكتاب PDF <span aria-hidden="true">↗</span></a>' +
        '<a class="s ministry-open-link" href="' + book.url + '" target="_blank" rel="noopener" download>تحميل PDF <span aria-hidden="true">↓</span></a></div>' +
        (book.supplementaryBooks || []).map(extra =>
          '<div class="ministry-book-row"><div class="ministry-book-cover" aria-hidden="true">📖</div>' +
          '<div class="ministry-book-info"><b>' + extra.title + '</b>' +
          '<small>الصف الثالث الثانوي • 2026/2027 • الفصل الدراسي الأول</small>' +
          '<span class="ministry-source-status">ملف PDF مباشر — رابط مقدم للمكتبة</span></div></div>' +
          '<div class="ministry-book-actions">' +
          '<a class="p ministry-open-link" href="' + extra.url + '" target="_blank" rel="noopener">عرض ' + extra.actionLabel + ' PDF <span aria-hidden="true">↗</span></a>' +
          '<a class="s ministry-open-link" href="' + extra.url + '" target="_blank" rel="noopener" download>تحميل ' + extra.actionLabel + ' PDF <span aria-hidden="true">↓</span></a></div>'
        ).join('') +
        '<p class="hint">' + book.note + '</p>'
      : '<div class="ministry-book-row"><div class="ministry-book-cover" aria-hidden="true">📘</div>' +
        '<div class="ministry-book-info"><b>كتاب الوزارة الرسمي</b>' +
        '<small>العام الدراسي 2026/2027 — لم يضف رابط PDF مباشر لهذه المادة بعد</small>' +
        '<span class="ministry-source-status">المصدر المرجعي: بوابة وزارة التربية والتعليم</span></div></div>' +
        '<div class="ministry-book-actions"><a class="p ministry-open-link" href="' + MINISTRY_LIBRARY +
        '" target="_blank" rel="noopener">افتح مكتبة الكتب الرسمية <span aria-hidden="true">↗</span></a></div>' +
        '<p class="hint">لم نضف رابط PDF تخمينيًا. أضف رابط الكتاب الرسمي لهذه المادة ليظهر هنا مثل كتاب اللغة العربية.</p>';

    detail.innerHTML =
      '<div class="ministry-detail-heading"><div><span class="eyebrow">OFFICIAL MINISTRY BOOK</span><h2>' + current.name +
      '</h2><p>الصف الثالث الثانوي • ' + trackLabels[track] + (isCommon ? ' • مادة عامة' : ' • مادة تخصصية') + '</p></div>' +
      '<span class="ministry-detail-icon" aria-hidden="true">' + current.icon + '</span></div>' +
      bookContent;
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

  function openSubject(subjectName) {
    const trackSelect = $('#trk');
    track = trackSelect?.value || track;
    if (!getSubjects().some(subject => subject.name === subjectName)) {
      const matchingTrack = Object.keys(trackSubjects).find(key =>
        (trackSubjects[key] || []).some(subject => subject.name === subjectName)
      );
      if (!matchingTrack) return false;
      track = matchingTrack;
      if (trackSelect && trackSelect.value !== matchingTrack) {
        trackSelect.value = matchingTrack;
        trackSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    selected = subjectName;
    const search = $('#ministryBookSearch');
    if (search) search.value = '';
    if (typeof window.activateTab === 'function') window.activateTab('library');
    render();
    const detail = $('#ministrySubjectDetail');
    if (detail) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }

  window.StudyMinistryLibrary = { init, render, openSubject };
  window.ministryLibraryRender = render;
})();
