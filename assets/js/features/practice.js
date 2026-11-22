/* Practice statistics, weekly goals, question generation, and study-plan suggestions */
(function () {
  const $ = selector => document.querySelector(selector);

  function init({ state, save, uid, escapeHtml, showAlert, getAI, getTrackLabel, getSubjects, getErrorMessage, setPlanText }) {
    function statsMap() {
      const bySubject = {};
      state.prac.forEach(record => {
        const item = bySubject[record.s] = bySubject[record.s] || { n: 0, c: 0 };
        item.n += record.n;
        item.c += record.c;
      });
      return bySubject;
    }

    function render() {
      $('#dl').textContent = 'موعد الامتحانات الرسمي سيُضاف بعد تأكيده من الوزارة.';
      const weekStart = new Date();
      weekStart.setHours(0, 0, 0, 0);
      weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 1) % 7));
      const weeklyQuestions = state.prac
        .filter(record => new Date(record.d + 'T00:00') >= weekStart)
        .reduce((total, record) => total + record.n, 0);
      $('#goalSt').textContent = `خلصت ${weeklyQuestions} من ${state.goal} سؤال الأسبوع ده`;
      $('#gbar').style.width = Math.min(100, weeklyQuestions / state.goal * 100) + '%';
      const rows = Object.entries(statsMap())
        .map(([subject, item]) => ({ subject, n: item.n, accuracy: Math.round(item.c / item.n * 100) }))
        .sort((a, b) => a.accuracy - b.accuracy);
      $('#stats').innerHTML = rows.length
        ? rows.map(item => `<div class="item"><div class="m"><div class="n">${escapeHtml(item.subject)}</div><div class="d">${item.n} سؤال، دقة ${item.accuracy}%</div><div class="bar"><i style="width:${item.accuracy}%"></i></div></div></div>`).join('')
        : '<div class="empty">سجّل أول جلسة تدريب عشان تشوف مستواك</div>';
    }

    $('#pForm').onsubmit = event => {
      event.preventDefault();
      const total = +$('#pN').value;
      const correct = +$('#pC').value;
      if (correct > total) {
        showAlert('عدد الإجابات الصح لازم يكون أقل من أو يساوي عدد الأسئلة');
        return;
      }
      const subject = $('#pS').value;
      state.prac.push({ id: uid(), s: subject, n: total, c: correct, d: new Date().toLocaleDateString('en-CA') });
      save();
      event.target.reset();
      $('#pS').value = subject;
      render();
    };

    $('#goal').value = state.goal;
    $('#goal').onchange = event => {
      state.goal = Math.max(1, +event.target.value || 100);
      save();
      render();
    };

    $('#qBtn').onclick = async () => {
      const lesson = $('#qT').value.trim();
      const status = $('#qSt');
      const ai = getAI();
      if (!ai) {
        status.textContent = 'ميزة الذكاء الاصطناعي مش متاحة هنا';
        return;
      }
      if (!lesson) {
        status.textContent = 'اكتب اسم الدرس أو الصق نصه';
        return;
      }
      status.textContent = 'جاري التوليد…';
      $('#qOut').innerHTML = '';
      try {
        const result = await ai(`أنت مدرس خبير في مادة ${$('#pS').value} لطلاب الثانوية العامة المصرية (${getTrackLabel()}). اكتب 4 أسئلة اختيار من متعدد (أ، ب، ج، د) و3 أسئلة مقالية على الدرس التالي بمستوى امتحان الوزارة ومن غير معلومات خارج المنهج. اكتب الأسئلة كلها أولًا، ثم سطر فيه ===== فقط، ثم الإجابات النموذجية مرقمة بنفس الترتيب.\nالدرس:\n${lesson}`);
        const [questions, answers] = result.text.split('=====');
        $('#qOut').innerHTML = `<div class="sum">${escapeHtml(questions.trim())}</div>${answers ? `<details><summary>الإجابات (حاول تحل الأول)</summary><div class="sum">${escapeHtml(answers.trim())}</div></details>` : ''}`;
        status.textContent = '';
      } catch (error) {
        status.textContent = getErrorMessage(error.code);
      }
    };

    $('#plBtn').onclick = async () => {
      const status = $('#plSt');
      const ai = getAI();
      if (!ai) {
        status.textContent = 'ميزة الذكاء الاصطناعي مش متاحة هنا';
        return;
      }
      const levels = Object.entries(statsMap())
        .map(([subject, item]) => `${subject}: ${Math.round(item.c / item.n * 100)}%`)
        .join('، ') || 'لا توجد بيانات بعد';
      status.textContent = 'جاري التخطيط…';
      try {
        const result = await ai(`أنت مستشار مذاكرة لطالب ثانوية عامة مصرية (${getTrackLabel()}). باقي 0 يوم على الامتحانات، ويذاكر ${$('#hrs').value} ساعات يوميًا. مستواه حسب نسبة الصح في التدريب: ${levels}. المواد: ${getSubjects().join('، ')}. اعمل خطة أسبوعية واقعية بالعربي المبسط: وزّع المواد على الأيام وركّز أكتر على الأضعف، وخصص وقتًا للمراجعة وحل الأسئلة والراحة، واختم بـ3 نصائح عملية.`);
        $('#plOut').innerHTML = `<div class="sum">${escapeHtml(result.text)}</div>`;
        setPlanText(result.text);
        $('#plAdd').hidden = false;
        status.textContent = '';
      } catch (error) {
        status.textContent = getErrorMessage(error.code);
      }
    };

    return { render };
  }

  window.StudyPractice = { init };
})();
