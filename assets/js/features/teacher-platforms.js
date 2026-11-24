(function (global) {
  'use strict';

  const SUBJECTS = ['كل المواد','اللغة العربية','اللغة الأجنبية الأولى','اللغة الإنجليزية','الأحياء','الرياضيات','الفيزياء','الكيمياء','التاريخ','الجغرافيا','الإحصاء','مواد أخرى'];
  const $ = selector => document.querySelector(selector);
  const SUBJECT_STYLES = {
    'اللغة العربية': {className:'arabic', icon:'📚'},
    'الكيمياء': {className:'chemistry', icon:'🧪'},
    'الفيزياء': {className:'physics', icon:'⚛️'},
    'اللغة الإنجليزية': {className:'english', icon:'🌍'},
    'اللغة الأجنبية الأولى': {className:'english', icon:'🌍'},
    'الأحياء': {className:'biology', icon:'🧬'},
    'الرياضيات': {className:'math', icon:'📐'},
    'التاريخ': {className:'history', icon:'🏛️'},
    'الجغرافيا': {className:'geography', icon:'🌐'},
    'الإحصاء': {className:'statistics', icon:'📊'},
    'مواد أخرى': {className:'other', icon:'🎓'}
  };
  const DEFAULT_PLATFORMS = [
    {id:'teacher-platform-mohamed-salah',name:'بسطتهالك – محمد صلاح',subject:'اللغة العربية',url:'https://bassthalk.com/',description:'منصة محمد صلاح للغة العربية'},
    {id:'teacher-platform-reda-elfarouk',name:'مستر رضا الفاروق',subject:'اللغة العربية',url:'https://mrredaelfarouk.com/',description:'منصة مستر رضا الفاروق للغة العربية'},
    {id:'teacher-platform-khaled-sakr',name:'خالد صقر',subject:'الكيمياء',url:'https://www.khaled-sakr.com/',description:'منصة خالد صقر للكيمياء'},
    {id:'teacher-platform-mohamed-abdelgawad',name:'منصة محمد عبد الجواد – MAG Academy',subject:'الكيمياء',url:'https://magacademy.co/',description:'منصة محمد عبد الجواد للكيمياء'},
    {id:'teacher-platform-abdelmaaboud',name:'منصة عبد المعبود',subject:'الفيزياء',url:'https://abdelmaaboud.com/',description:'منصة عبد المعبود للفيزياء'},
    {id:'teacher-platform-kirillos',name:'منصة كيرليس – Doctor in Physics',subject:'الفيزياء',url:'https://doctorinphysics.com/',description:'منصة كيرليس للفيزياء'},
    {id:'teacher-platform-mrenglishawy',name:'إنجلشاوي – Mr Englishawy',subject:'اللغة الإنجليزية',url:'https://www.mrenglishawy.com/ar/dashboard',description:'منصة إنجلشاوي للغة الإنجليزية'},
    {id:'teacher-platform-may-magdy',name:'مس مي مجدي – More English',subject:'اللغة الإنجليزية',url:'https://more-english.net/',description:'منصة مس مي مجدي للغة الإنجليزية'},
    {id:'teacher-platform-ahmed-elgohary',name:'أحمد الجوهري',subject:'الأحياء',url:'https://ahmed-elgohary.com/',description:'منصة أحمد الجوهري للأحياء'}
  ];

  function init({state, save, escapeHtml, showAlert}) {
    if (!Array.isArray(state.teacherPlatforms)) state.teacherPlatforms = [];
    // Seed the curated directory once per browser profile. Personal links remain intact.
    if (state.teacherPlatformsSeedVersion !== '2026-11-v1') {
      const knownUrls = new Set(state.teacherPlatforms.map(item => item.url));
      const missingDefaults = DEFAULT_PLATFORMS.filter(item => !knownUrls.has(item.url));
      state.teacherPlatforms = [...missingDefaults, ...state.teacherPlatforms];
      state.teacherPlatformsSeedVersion = '2026-11-v1';
      save();
    }
    let editingId = null;
    let searchTerm = '';
    let subjectFilter = 'كل المواد';

    const esc = typeof escapeHtml === 'function' ? escapeHtml : value => String(value);
    const uid = () => 'teacher-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const safeUrl = value => {
      try {
        const url = new URL(String(value).trim());
        return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
      } catch { return ''; }
    };

    function render() {
      const root = $('#teacherPlatformsRoot');
      if (!root) return;
      const items = state.teacherPlatforms.filter(item => {
        const matchesSearch = [item.name, item.subject, item.description, item.url].join(' ').toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch && (subjectFilter === 'كل المواد' || item.subject === subjectFilter);
      });
      root.innerHTML = `
        <div class="teacher-platforms-hero">
          <span class="eyebrow">TEACHER PLATFORMS</span>
          <h2>منصات المدرسين</h2>
          <p>اجمع روابط المدرسين والمنصات التعليمية في مكان واحد، وارجع إليها وقت ما تحتاج.</p>
          <div class="teacher-platforms-stats"><span>إجمالي المنصات: <b>${state.teacherPlatforms.length}</b></span><span>المنصات الأساسية متاحة على كل الأجهزة</span><span>إضافاتك الشخصية محفوظة على هذا الجهاز</span></div>
        </div>
        <div class="teacher-platforms-layout">
          <form class="teacher-platforms-form" id="teacherPlatformForm">
            <h3 id="teacherPlatformFormTitle">أضف منصة جديدة</h3>
            <label for="teacherPlatformName">اسم المنصة أو المدرس</label>
            <input id="teacherPlatformName" maxlength="100" required placeholder="مثال: منصة أستاذ أحمد">
            <label for="teacherPlatformSubject">المادة</label>
            <select id="teacherPlatformSubject">${SUBJECTS.filter(s => s !== 'كل المواد').map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select>
            <label for="teacherPlatformUrl">رابط المنصة</label>
            <input id="teacherPlatformUrl" type="url" inputmode="url" maxlength="2048" required placeholder="https://example.com">
            <label for="teacherPlatformDescription">وصف مختصر (اختياري)</label>
            <textarea id="teacherPlatformDescription" rows="3" maxlength="300" placeholder="ملاحظات أو تفاصيل عن المنصة"></textarea>
            <div class="teacher-platforms-actions">
              <button class="p" type="submit" id="teacherPlatformSave">حفظ المنصة</button>
              <button class="s" type="button" id="teacherPlatformCancel" hidden>إلغاء</button>
            </div>
            <p class="hint" id="teacherPlatformStatus" aria-live="polite">يمكنك إضافة روابط المنصات المجانية أو المدفوعة.</p>
          </form>
          <div class="teacher-platforms-list">
            <h3>المنصات المحفوظة</h3>
            <div class="teacher-platforms-toolbar">
              <input id="teacherPlatformSearch" type="search" placeholder="ابحث باسم المدرس أو المنصة">
              <select id="teacherPlatformFilter">${SUBJECTS.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join('')}</select>
            </div>
            <div class="teacher-platforms-cards" id="teacherPlatformsList"></div>
          </div>
        </div>`;
      $('#teacherPlatformSearch').value = searchTerm;
      $('#teacherPlatformFilter').value = subjectFilter;
      bindForm();
      renderCards();
    }

    function renderCards() {
      const list = $('#teacherPlatformsList');
      if (!list) return;
      const items = state.teacherPlatforms.filter(item =>
        [item.name, item.subject, item.description, item.url].join(' ').toLowerCase().includes(searchTerm.toLowerCase()) &&
        (subjectFilter === 'كل المواد' || item.subject === subjectFilter)
      );
      if (!items.length) {
        list.innerHTML = `<div class="teacher-platforms-empty">${state.teacherPlatforms.length ? 'لا توجد منصات مطابقة لبحثك.' : 'لا توجد منصات مضافة بعد. أضف أول رابط من النموذج.'}</div>`;
        return;
      }
      list.innerHTML = items.map(item => `
        <article class="teacher-platform-card teacher-platform-card--${(SUBJECT_STYLES[item.subject] || SUBJECT_STYLES['مواد أخرى']).className}">
          <span class="teacher-platform-subject"><span aria-hidden="true">${(SUBJECT_STYLES[item.subject] || SUBJECT_STYLES['مواد أخرى']).icon}</span> ${esc(item.subject)}</span>
          <h4>${esc(item.name)}</h4>
          ${item.description ? `<p>${esc(item.description)}</p>` : ''}
          <a href="${esc(item.url)}" target="_blank" rel="noopener noreferrer">زيارة المنصة ↗</a>
          <div class="teacher-platform-card-actions">
            <button class="s" type="button" data-platform-edit="${esc(item.id)}">تعديل</button>
            <button class="s" type="button" data-platform-delete="${esc(item.id)}">حذف</button>
          </div>
        </article>`).join('');
      list.querySelectorAll('[data-platform-edit]').forEach(button => button.addEventListener('click', () => edit(button.dataset.platformEdit)));
      list.querySelectorAll('[data-platform-delete]').forEach(button => button.addEventListener('click', () => remove(button.dataset.platformDelete)));
    }

    function resetForm() {
      editingId = null;
      $('#teacherPlatformForm').reset();
      $('#teacherPlatformFormTitle').textContent = 'أضف منصة جديدة';
      $('#teacherPlatformSave').textContent = 'حفظ المنصة';
      $('#teacherPlatformCancel').hidden = true;
    }

    function bindForm() {
      $('#teacherPlatformForm').addEventListener('submit', event => {
        event.preventDefault();
        const name = $('#teacherPlatformName').value.trim();
        const subject = $('#teacherPlatformSubject').value;
        const url = safeUrl($('#teacherPlatformUrl').value);
        const description = $('#teacherPlatformDescription').value.trim();
        const status = $('#teacherPlatformStatus');
        if (!name || !url) {
          status.textContent = 'اكتب اسم المنصة ورابطًا صحيحًا يبدأ بـ https:// أو http://.';
          return;
        }
        const duplicate = state.teacherPlatforms.find(item => item.url === url && item.id !== editingId);
        if (duplicate) {
          status.textContent = 'هذا الرابط مضاف بالفعل.';
          return;
        }
        if (editingId) {
          const item = state.teacherPlatforms.find(entry => entry.id === editingId);
          if (item) Object.assign(item, {name, subject, url, description});
          status.textContent = 'تم تحديث بيانات المنصة.';
        } else {
          state.teacherPlatforms.unshift({id: uid(), name, subject, url, description, createdAt: new Date().toISOString()});
          status.textContent = 'تمت إضافة المنصة بنجاح.';
        }
        save();
        resetForm();
        renderCards();
        $('#teacherPlatformStatus').textContent = status.textContent;
        const count = $('.teacher-platforms-stats b');
        if (count) count.textContent = String(state.teacherPlatforms.length);
      });
      $('#teacherPlatformCancel').addEventListener('click', resetForm);
      $('#teacherPlatformSearch').addEventListener('input', event => {searchTerm = event.target.value; renderCards();});
      $('#teacherPlatformFilter').addEventListener('change', event => {subjectFilter = event.target.value; renderCards();});
    }

    function edit(id) {
      const item = state.teacherPlatforms.find(entry => entry.id === id);
      if (!item) return;
      editingId = id;
      $('#teacherPlatformName').value = item.name;
      $('#teacherPlatformSubject').value = item.subject;
      $('#teacherPlatformUrl').value = item.url;
      $('#teacherPlatformDescription').value = item.description || '';
      $('#teacherPlatformFormTitle').textContent = 'تعديل بيانات المنصة';
      $('#teacherPlatformSave').textContent = 'حفظ التعديلات';
      $('#teacherPlatformCancel').hidden = false;
      $('#teacherPlatformName').focus();
    }

    function remove(id) {
      const item = state.teacherPlatforms.find(entry => entry.id === id);
      if (!item || !global.confirm('هل تريد حذف هذه المنصة من القائمة؟')) return;
      state.teacherPlatforms = state.teacherPlatforms.filter(entry => entry.id !== id);
      save();
      if (editingId === id) resetForm();
      renderCards();
      const count = $('.teacher-platforms-stats b');
      if (count) count.textContent = String(state.teacherPlatforms.length);
      if (typeof showAlert === 'function') showAlert('تم حذف المنصة من قائمتك.');
    }

    return {render};
  }

  global.StudyTeacherPlatforms = Object.freeze({init});
})(window);
