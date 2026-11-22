/* Mistake notebook with spaced review */
(function () {
  const $ = selector => document.querySelector(selector);

  function init({ state, save, uid, today, addDays, escapeHtml }) {
    function render() {
      const active = state.mist.filter(item => item.box < 2);
      const due = active.filter(item => item.due <= today()).length;
      const completed = state.mist.filter(item => item.box >= 2).length;

      $('#mSt').textContent = `${state.mist.length} غلطة مسجلة، ${completed} اتراجعت بنجاح، و${due} مستحقة للمراجعة الآن`;
      $('#mList').innerHTML = active.length
        ? active.map(item => {
            const dueNow = item.due <= today();
            return `<div class="item"><div class="m"><div class="n">${escapeHtml(item.q)}</div><div class="d">${escapeHtml(item.s)} - ${escapeHtml(item.r)} · ${dueNow ? 'مستحقة للمراجعة' : `موعد المراجعة: ${escapeHtml(item.due)}`}</div></div><button class="s" data-mok="${escapeHtml(item.id)}">جاوبتها صح</button><button class="s" data-mno="${escapeHtml(item.id)}">غلطت تاني</button></div>`;
          }).join('')
        : '<div class="empty">لا توجد أخطاء للمراجعة حاليًا. سجّل أول نقطة تحتاج مراجعتها.</div>';
    }

    $('#mForm').onsubmit = event => {
      event.preventDefault();
      const subject = $('#mS').value;
      state.mist.push({
        id: uid(),
        s: subject,
        q: $('#mQ').value.trim(),
        r: $('#mR').value,
        box: 0,
        due: addDays(2)
      });
      save();
      event.target.reset();
      $('#mS').value = subject;
      render();
    };

    document.addEventListener('click', event => {
      const button = event.target.closest('[data-mok], [data-mno]');
      if (!button) return;
      const correctId = button.dataset.mok;
      const retryId = button.dataset.mno;
      const item = state.mist.find(record => record.id === (correctId || retryId));
      if (!item) return;
      if (correctId) {
        item.box++;
        item.due = addDays(7);
      } else {
        item.box = 0;
        item.due = addDays(2);
      }
      save();
      render();
    });

    return { render };
  }

  window.StudyMistakes = { init };
})();
