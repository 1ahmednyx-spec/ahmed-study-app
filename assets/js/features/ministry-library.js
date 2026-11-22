/* Official Ministry textbook library — links only to verified Ministry entry points. */
(function () {
  const $ = selector => document.querySelector(selector);
  const MINISTRY_LIBRARY = 'https://ellibrary.moe.gov.eg/Books-sec/';
  const subjects = {
    sci: ['اللغة العربية','اللغة الإنجليزية','اللغة الأجنبية الثانية','الأحياء','الكيمياء','الفيزياء','الجيولوجيا'],
    math: ['اللغة العربية','اللغة الإنجليزية','اللغة الأجنبية الثانية','الرياضيات','الفيزياء','الكيمياء'],
    lit: ['اللغة العربية','اللغة الإنجليزية','اللغة الأجنبية الثانية','التاريخ','الجغرافيا','الفلسفة والمنطق','علم النفس والاجتماع']
  };
  const icons = {'اللغة العربية':'📖','اللغة الإنجليزية':'🇬🇧','اللغة الأجنبية الثانية':'🌐','الأحياء':'🧬','الكيمياء':'🧪','الفيزياء':'⚛️','الجيولوجيا':'🌍','الرياضيات':'📐','التاريخ':'🏛️','الجغرافيا':'🗺️','الفلسفة والمنطق':'💭','علم النفس والاجتماع':'🧠'};
  let selected = '';
  let track = 'sci';
  function render() {
    const grid = $('#ministrySubjectGrid');
    const detail = $('#ministrySubjectDetail');
    if (!grid || !detail) return;
    const query = ($('#ministryBookSearch')?.value || '').trim().toLowerCase();
    const list = subjects[track] || subjects.sci;
    grid.innerHTML = list.filter(name => name.toLowerCase().includes(query)).map(name =>
      '<button type="button" class="ministry-subject-card' + (selected === name ? ' active' : '') + '" data-ministry-subject="' + name + '">' +
      '<span class="ministry-subject-icon" aria-hidden="true">' + (icons[name] || '📚') + '</span>' +
      '<span><b>' + name + '</b><small>كتاب الوزارة • الصف الثالث الثانوي</small></span><span class="ministry-subject-arrow" aria-hidden="true">←</span></button>'
    ).join('') || '<p class="empty">لا توجد مادة مطابقة للبحث.</p>';
    grid.querySelectorAll('[data-ministry-subject]').forEach(button => {
      button.addEventListener('click', () => { selected = button.dataset.ministrySubject; render(); });
    });
    if (!list.includes(selected)) selected = list[0] || '';
    if (!selected) { detail.innerHTML = ''; return; }
    detail.innerHTML = '<div class="ministry-detail-heading"><div><span class="eyebrow">OFFICIAL MINISTRY BOOK</span><h2>' + selected + '</h2><p>الصف الثالث الثانوي • ' + (track === 'sci' ? 'علمي علوم' : track === 'math' ? 'علمي رياضة' : 'أدبي') + '</p></div><span class="ministry-detail-icon">' + (icons[selected] || '📚') + '</span></div>' +
      '<div class="ministry-book-row"><div class="ministry-book-cover" aria-hidden="true">📘</div><div class="ministry-book-info"><b>كتاب الوزارة الرسمي</b><small>النسخة المتاحة على مكتبة وزارة التربية والتعليم</small><span class="ministry-source-status">المصدر الرسمي للوزارة</span></div></div>' +
      '<div class="ministry-book-actions"><a class="p ministry-open-link" href="' + MINISTRY_LIBRARY + '" target="_blank" rel="noopener">افتح مكتبة الوزارة <span aria-hidden="true">↗</span></a></div>' +
      '<p class="hint">ستحتاج إلى اختيار الصف الثالث الثانوي ثم مادة ' + selected + ' داخل موقع الوزارة. لم نضع رابط PDF مباشرًا قبل التحقق من مطابقته للعام الدراسي 2026/2027.</p>';
  }
  function init() {
    const trackSelect = $('#trk');
    track = trackSelect?.value || 'sci';
    selected = (subjects[track] || subjects.sci)[0];
    $('#ministryBookSearch')?.addEventListener('input', render);
    trackSelect?.addEventListener('change', event => {
      track = event.target.value;
      selected = (subjects[track] || subjects.sci)[0];
      render();
    });
    render();
  }
  window.StudyMinistryLibrary = { init, render };
  window.ministryLibraryRender = render;
})();
