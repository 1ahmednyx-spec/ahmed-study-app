/* Main navigation */
(function () {
  const ids = ['home', 'sched', 'notes', 'chat', 'prac', 'tools', 'eng', 'library', 'english2027', 'arabic2027', 'chemistry2027', 'physics2027', 'math2027', 'biology2027'];
  const $ = selector => document.querySelector(selector);

  function activateTab(id) {
    if (!ids.includes(id)) return;
    document.querySelectorAll('.tabs button').forEach(button => {
      button.setAttribute('aria-selected', String(button.dataset.tab === id));
    });
    ids.forEach(sectionId => {
      const section = $('#' + sectionId);
      if (section) section.hidden = sectionId !== id;
    });
    if (id === 'library' && typeof window.ministryLibraryRender === 'function') window.ministryLibraryRender();
    if (id === 'english2027' && typeof window.ecRender === 'function') {
      window.ecRender();
    }
    const main = $('.main-content');
    if (main && window.matchMedia('(max-width: 900px)').matches) {
      main.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  window.activateTab = activateTab;
  document.querySelectorAll('.tabs button').forEach(button => {
    button.onclick = () => activateTab(button.dataset.tab);
  });
  document.addEventListener('click', event => {
    const target = event.target instanceof Element
      ? event.target.closest('[data-go-tab]')
      : null;
    if (target) {
      event.preventDefault();
      activateTab(target.dataset.goTab);
    }
  });
})();
