/* Schedule and in-app reminders */
(function () {
  const $ = selector => document.querySelector(selector);

  function init({ state, save, uid, escapeHtml, showAlert }) {
    const at = event => new Date(event.d + 'T' + event.t);
    const fmt = event => at(event).toLocaleString('ar-EG', {
      weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit'
    });

    function left(ms) {
      const minutes = Math.max(0, Math.round(ms / 60000));
      if (minutes < 1) return 'دلوقتي';
      const days = Math.floor(minutes / 1440);
      const hours = Math.floor(minutes % 1440 / 60);
      const remainder = minutes % 60;
      const parts = [];
      if (days) parts.push(days + ' يوم');
      if (hours) parts.push(hours + ' ساعة');
      if (remainder && !days) parts.push(remainder + ' دقيقة');
      return 'بعد ' + parts.join(' و ');
    }

    function render() {
      const now = Date.now();
      const sorted = [...state.ev].sort((a, b) => at(a) - at(b));
      const upcoming = sorted.filter(event => !event.done && at(event) >= now - 36e5);
      const completed = sorted.filter(event => !upcoming.includes(event)).reverse();
      const row = event => `<div class="item ${event.done ? 'done' : ''}"><input type="checkbox" data-done="${event.id}" ${event.done ? 'checked' : ''} aria-label="تم"><div class="m"><div class="n">${escapeHtml(event.title)}</div><div class="d">${fmt(event)}</div></div><button class="x" data-del="${event.id}" aria-label="احذف">×</button></div>`;
      $('#upList').innerHTML = upcoming.length ? upcoming.map(row).join('') : '<div class="empty">ضيف أول موعد مذاكرة من الأعلى</div>';
      $('#doneList').innerHTML = completed.length ? completed.map(row).join('') : '<div class="empty">لا شيء هنا بعد</div>';
      tickHero();
    }

    function tickHero() {
      const next = state.ev.filter(event => !event.done && at(event) >= Date.now())
        .sort((a, b) => at(a) - at(b))[0];
      $('#nextT').textContent = next ? next.title : 'لا توجد مواعيد قادمة';
      $('#nextC').textContent = next ? left(at(next) - Date.now()) : '';
    }

    $('#evForm').onsubmit = event => {
      event.preventDefault();
      state.ev.push({
        id: uid(), title: $('#evT').value.trim(), d: $('#evD').value,
        t: $('#evH').value, lead: +$('#lead').value, fired: false, done: false
      });
      save();
      event.target.reset();
      render();
    };

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const del = target && target.dataset.del;
      if (del) {
        state.ev = state.ev.filter(item => item.id !== del);
        save();
        render();
      }
    });

    document.addEventListener('change', event => {
      const target = event.target instanceof Element ? event.target : null;
      const id = target && target.dataset.done;
      if (id) {
        const item = state.ev.find(value => value.id === id);
        if (item) {
          item.done = target.checked;
          save();
          render();
        }
      }
    });

    function checkReminders() {
      const now = Date.now();
      let changed = false;
      state.ev.forEach(event => {
        if (event.done || event.fired) return;
        const timestamp = at(event).getTime();
        if (now >= timestamp - event.lead * 60000 && now < timestamp + 36e5) {
          event.fired = true;
          changed = true;
          const message = (event.lead ? left(timestamp - now) + ': ' : 'حان الآن: ') + event.title;
          showAlert(message);
        }
      });
      if (changed) {
        save();
        render();
      }
    }

    window.setInterval(() => {
      tickHero();
      checkReminders();
    }, 15000);

    return { render, checkReminders };
  }

  window.StudySchedule = { init };
})();
