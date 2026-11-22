/* Local study notes and lesson summaries */
(function () {
  const $ = selector => document.querySelector(selector);

  function summarize(text) {
    const sentences = text.split(/(?<=[.!؟?])\s+|\n+/).map(value => value.trim()).filter(value => value.length > 20);
    if (sentences.length <= 3) return sentences.join(' ') || text.slice(0, 200);
    const frequency = {};
    const words = /[\p{L}]{3,}/gu;
    (text.toLowerCase().match(words) || []).forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    const scored = sentences.map((sentence, index) => ({
      sentence, index,
      score: (sentence.toLowerCase().match(words) || []).reduce((sum, word) => sum + frequency[word], 0) / Math.sqrt(sentence.length)
    }));
    return scored.sort((a, b) => b.score - a.score).slice(0, 3)
      .sort((a, b) => a.index - b.index).map(item => item.sentence).join(' ');
  }

  function init({ state, save, uid, escapeHtml, getAI, getTrackLabel, getErrorMessage }) {
    function render() {
      $('#noteList').innerHTML = state.notes.length
        ? state.notes.map(note => `<div class="panel"><div class="item" style="border:0;padding:0"><div class="m"><div class="n">${escapeHtml(note.title)}</div><div class="d">${escapeHtml(note.sub || '')}</div></div><button class="x" data-ndel="${note.id}" aria-label="احذف">×</button></div><div class="sum">${escapeHtml(note.sum)}</div></div>`).join('')
        : '<div class="empty">ملخصاتك هتظهر هنا</div>';
    }

    $('#noteForm').onsubmit = async event => {
      event.preventDefault();
      const body = $('#nB').value.trim();
      const title = $('#nT').value.trim();
      const subject = $('#nS').value;
      const status = $('#nSt');
      const button = $('#nBtn');
      let summary = '';
      button.disabled = true;
      const ai = getAI();
      if (ai) {
        status.textContent = 'جاري التلخيص…';
        try {
          summary = (await ai(`أنت مدرس خبير لطلاب الثانوية العامة المصرية (الصف الثالث الثانوي، ${getTrackLabel()}). المادة: ${subject}. لخّص الدرس التالي بالعربية المبسطة (والمصطلحات الأجنبية كما هي) بدون إضافة معلومات غير موجودة في النص، وبالترتيب ده:
الفكرة العامة: سطرين
أهم النقاط: من 5 إلى 8 نقاط مرقمة
تعريفات وقوانين ومصطلحات لازم تتحفظ
أسئلة متوقعة: سؤالين مقاليين و3 اختيار من متعدد مع إجاباتها
لو النص ناقص حاجة مهمة قول إيه هي.

النص:
${body}`)).text;
        } catch (error) {
          status.textContent = getErrorMessage(error.code) + '، استخدمت تلخيصًا بسيطًا بدله';
        }
      }
      if (!summary) summary = summarize(body);
      state.notes.unshift({ id: uid(), title, sub: subject, sum: summary });
      save();
      event.target.reset();
      $('#nS').value = subject;
      render();
      button.disabled = false;
      if (ai && summary) status.textContent = '';
    };

    document.addEventListener('click', event => {
      const target = event.target instanceof Element ? event.target : null;
      const id = target && target.dataset.ndel;
      if (id) {
        state.notes = state.notes.filter(note => note.id !== id);
        save();
        render();
      }
    });

    return { render };
  }

  window.StudyNotes = { init };
})();
