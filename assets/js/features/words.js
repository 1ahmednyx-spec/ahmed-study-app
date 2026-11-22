/* English vocabulary list and spaced-repetition flashcards */
(function () {
  const $ = selector => document.querySelector(selector);

  function init({ state, save, uid, escapeHtml, getAI, getErrorMessage, showAlert }) {
    let current = null;
    let revealed = false;

    function render() {
      $('#wList').innerHTML = state.words.length
        ? state.words.map(word => `<div class="item"><div class="m"><div class="n" dir="ltr" style="text-align:right">${escapeHtml(word.e)}</div><div class="d">${escapeHtml(word.a)}</div></div><button class="x" data-wdel="${word.id}" aria-label="احذف">×</button></div>`).join('')
        : '<div class="empty">ضيف كلمات جديدة من فوق</div>';
      nextCard();
    }

    function nextCard() {
      revealed = false;
      $('#rev').hidden = true;
      if (!state.words.length) {
        current = null;
        $('#card').innerHTML = '<span class="hint">ضيف كلمة عشان تبدأ المراجعة</span>';
        return;
      }
      const lowestBox = Math.min(...state.words.map(word => word.box || 0));
      const pool = state.words.filter(word => (word.box || 0) === lowestBox && word !== current);
      const candidates = pool.length ? pool : state.words;
      current = candidates[Math.floor(Math.random() * candidates.length)];
      $('#card').innerHTML = `<div class="w">${escapeHtml(current.e)}</div><div class="hint">اضغط لإظهار المعنى</div>`;
    }

    function reveal() {
      if (!current || revealed) return;
      revealed = true;
      $('#card').innerHTML = `<div class="w">${escapeHtml(current.e)}</div><div class="a">${escapeHtml(current.a)}</div>`;
      $('#rev').hidden = false;
    }

    function addWord(english, arabic) {
      state.words.push({ id: uid(), e: english, a: arabic, box: 0 });
      save();
      render();
    }

    $('#card').onclick = reveal;
    $('#card').onkeydown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        reveal();
      }
    };
    $('#know').onclick = () => {
      if (current) {
        current.box = (current.box || 0) + 1;
        save();
        nextCard();
      }
    };
    $('#again').onclick = () => {
      if (current) {
        current.box = 0;
        save();
        nextCard();
      }
    };

    $('#wForm').onsubmit = async event => {
      event.preventDefault();
      const english = $('#wE').value.trim();
      let arabic = $('#wA').value.trim();
      event.target.reset();
      if (!arabic) {
        const ai = getAI();
        if (!ai) {
          showAlert('اكتب المعنى بنفسك، الترجمة التلقائية مش متاحة');
          return;
        }
        try {
          arabic = (await ai('ترجم الكلمة أو التعبير ده من الإنجليزي للعربي بمعناه الأشهر في كلمتين أو تلات، وارجع الترجمة بس: ' + english)).text.trim();
        } catch (error) {
          showAlert(getErrorMessage(error.code));
          return;
        }
      }
      addWord(english, arabic);
    };

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target.closest('[data-wdel], [data-addw]') : null;
      if (!target) return;
      if (target.dataset.wdel) {
        const id = target.dataset.wdel;
        state.words = state.words.filter(word => word.id !== id);
        save();
        render();
      }
      if (target.dataset.addw) {
        const [english, ...meaningParts] = target.dataset.addw.split('=');
        const arabic = meaningParts.join('=').trim();
        if (english && arabic) {
          addWord(english.trim(), arabic);
          showAlert('اتضافت للكلمات: ' + english.trim());
        }
      }
    });

    return { render };
  }

  window.StudyWords = { init };
})();
