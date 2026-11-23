import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'domcontentloaded' });
  const cssResponse = await page.request.get('http://127.0.0.1:4173/assets/css/app.css');
  const jsResponse = await page.request.get('http://127.0.0.1:4173/assets/js/app.js');
  const storageResponse = await page.request.get('http://127.0.0.1:4173/assets/js/core/storage.js');
  const navigationResponse = await page.request.get('http://127.0.0.1:4173/assets/js/core/navigation.js');
  const scheduleResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/schedule.js');
  const notesResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/notes.js');
  const wordsResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/words.js');
  const practiceResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/practice.js');
  const mistakesResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/mistakes.js');
  const toolsResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/tools.js');
  const englishCourseResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/english-course.js');
  const englishLearningPathResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/english-learning-path.js');
  const subjectCoursesResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/subject-courses.js');
  const examCenterResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/exam-center.js');
  const ministryLibraryResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/ministry-library.js');
  const englishCoachResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/english-coach.js');
  const preferencesResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/preferences.js');
  const serviceWorkerResponse = await page.request.get('http://127.0.0.1:4173/sw.js');
  assert.equal(serviceWorkerResponse.status(), 200, 'Service worker must be served');
  const serviceWorkerSource = await serviceWorkerResponse.text();
  assert.match(serviceWorkerSource, /ahmed-study-platform-v\d+/, 'Service worker cache must be versioned');
  for (const modulePath of ['./assets/js/features/preferences.js', './assets/js/features/english-course.js', './assets/js/features/english-learning-path.js', './assets/js/features/subject-courses.js', './assets/js/features/exam-center.js', './assets/js/features/ministry-library.js', './assets/js/features/english-coach.js']) {
    assert.ok(serviceWorkerSource.includes(modulePath), `Service worker must precache ${modulePath}`);
  }

  assert.equal(cssResponse.status(), 200, 'External stylesheet must be served');
  assert.equal(jsResponse.status(), 200, 'External application script must be served');
  assert.equal(storageResponse.status(), 200, 'Storage module must be served');
  assert.equal(navigationResponse.status(), 200, 'Navigation module must be served');
  assert.equal(scheduleResponse.status(), 200, 'Schedule module must be served');
  assert.equal(notesResponse.status(), 200, 'Notes module must be served');
  assert.equal(wordsResponse.status(), 200, 'Words module must be served');
  assert.equal(practiceResponse.status(), 200, 'Practice module must be served');
  assert.equal(mistakesResponse.status(), 200, 'Mistakes module must be served');
  assert.equal(toolsResponse.status(), 200, 'Tools module must be served');
  const toolsSource = await toolsResponse.text();
  assert.match(toolsSource, /const ai=\(\)=>getAI\(\)/, 'Study tools must resolve the AI client when an action runs');
  assert.doesNotMatch(toolsSource, /const S=state,\s*AI=getAI\(\)/, 'Study tools must not capture an unavailable AI client during startup');
  assert.equal(englishCourseResponse.status(), 200, 'English course module must be served');
  assert.equal(englishLearningPathResponse.status(), 200, 'Separate English learning path module must be served');
  assert.equal(subjectCoursesResponse.status(), 200, '2027 subject courses module must be served');
  assert.equal(examCenterResponse.status(), 200, 'Exam center module must be served');
  assert.equal(ministryLibraryResponse.status(), 200, 'Ministry library module must be served');
  assert.equal(englishCoachResponse.status(), 200, 'English coach module must be served');
  assert.equal(preferencesResponse.status(), 200, 'Preferences module must be served');
  const scriptOrder = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
  assert.ok(scriptOrder.indexOf('./assets/js/core/storage.js') < scriptOrder.indexOf('./assets/js/core/navigation.js'), 'Storage must load before navigation');
  assert.ok(scriptOrder.indexOf('./assets/js/core/navigation.js') < scriptOrder.indexOf('./assets/js/features/schedule.js'), 'Navigation must load before feature modules');
  assert.ok(scriptOrder.indexOf('./assets/js/features/schedule.js') < scriptOrder.indexOf('./assets/js/features/notes.js'), 'Schedule must load before notes feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/notes.js') < scriptOrder.indexOf('./assets/js/features/words.js'), 'Notes must load before words feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/words.js') < scriptOrder.indexOf('./assets/js/features/practice.js'), 'Words must load before practice feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/practice.js') < scriptOrder.indexOf('./assets/js/features/mistakes.js'), 'Practice must load before mistakes feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/mistakes.js') < scriptOrder.indexOf('./assets/js/features/tools.js'), 'Mistakes must load before tools feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/tools.js') < scriptOrder.indexOf('./assets/js/features/english-course.js'), 'Tools must load before English course feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/english-course.js') < scriptOrder.indexOf('./assets/js/features/english-learning-path.js'), 'English summary course must load before separate learning path');
  assert.ok(scriptOrder.indexOf('./assets/js/features/english-learning-path.js') < scriptOrder.indexOf('./assets/js/features/subject-courses.js'), 'English learning path must load before subject courses');
  assert.ok(scriptOrder.indexOf('./assets/js/features/subject-courses.js') < scriptOrder.indexOf('./assets/js/features/exam-center.js'), 'Subject course bank must load before exam center');
  assert.ok(scriptOrder.indexOf('./assets/js/features/exam-center.js') < scriptOrder.indexOf('./assets/js/features/ministry-library.js'), 'Exam center must load before Ministry library feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/ministry-library.js') < scriptOrder.indexOf('./assets/js/features/english-coach.js'), 'Ministry library must load before English coach feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/english-coach.js') < scriptOrder.indexOf('./assets/js/features/preferences.js'), 'English coach must load before preferences feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/preferences.js') < scriptOrder.indexOf('./assets/js/app.js'), 'Preferences must load before app bootstrap');
  const appSource = await jsResponse.text();
  assert.ok(appSource.indexOf('StudyPreferences.init') < appSource.indexOf('StudyTools.init'), 'Preferences must initialize before tools receive its refresh callback');
  assert.equal(await page.evaluate(() => typeof window.StudyNotes?.init), 'function', 'Notes module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyWords?.init), 'function', 'Words module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyPractice?.init), 'function', 'Practice module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyMistakes?.init), 'function', 'Mistakes module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyTools?.init), 'function', 'Tools module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyEnglishCourse?.init), 'function', 'English course module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyEnglishPath?.init), 'function', 'Separate English learning path must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudySubjectCourses?.init), 'function', 'Subject courses module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyExamCenter?.init), 'function', 'Exam center module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyMinistryLibrary?.init), 'function', 'Ministry library module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.ecRender), 'function', 'English course renderer must be available to tab navigation');
  assert.equal(await page.evaluate(() => typeof window.StudyEnglishCoach?.init), 'function', 'English coach module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyPreferences?.init), 'function', 'Preferences module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudySchedule?.init), 'function', 'Schedule module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.activateTab), 'function', 'Navigation module must expose tab activation');
  assert.match(await page.title(), /Ahmed Study Platform/);
  await page.locator('#home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.tabs [role="tab"]').count(), 16, 'Exam center, English learning path, and five subject tabs must preserve all existing tabs');
  for (const subject of ['arabic2027', 'chemistry2027', 'physics2027', 'math2027', 'biology2027']) {
    assert.equal(await page.locator(`.tabs [role="tab"][data-tab="${subject}"]`).count(), 1, `${subject} must have one navigation tab`);
    assert.equal(await page.locator(`#${subject}`).count(), 1, `${subject} must have one content section`);
  }

  // Every navigation tab must activate its matching content section.
  for (const tab of await page.locator('.tabs [role="tab"]').all()) {
    const target = await tab.getAttribute('data-tab');
    await tab.click();
    await page.locator('#' + target).waitFor({ state: 'visible' });
    assert.equal(await page.locator('.tabs [aria-selected="true"]').getAttribute('data-tab'), target);
  }

  // Every added 2027 subject page must contain real lesson explanations and practice.
  for (const subject of ['arabic2027', 'chemistry2027', 'physics2027', 'math2027', 'biology2027']) {
    await page.locator('[data-tab="' + subject + '"]').click();
    assert.ok(await page.locator('#' + subject + ' .subject-lesson').count() >= 5, subject + ' must render its lesson list');
    assert.ok(await page.locator('#' + subject + ' [data-subject-progress]').textContent().then(value => value.includes('0%')), subject + ' must show initial progress');
  }
  await page.locator('[data-tab="biology2027"]').click();
  const firstSubjectLesson = page.locator('#biology2027 .subject-lesson').first();
  await firstSubjectLesson.locator('summary').click();
  await firstSubjectLesson.locator('input[type="radio"]').first().check();
  await firstSubjectLesson.locator('[data-subject-check]').click();
  await firstSubjectLesson.locator('[data-subject-feedback]').waitFor({ state: 'visible' });
  await page.locator('#biology2027 .subject-lesson').first().locator('[data-subject-done]').check();
  assert.ok((await page.locator('#biology2027 [data-subject-progress]').textContent()).includes('1 من'));

  // Separate English learning path must provide lessons, examples, quizzes, and saved progress without replacing the 2027 summary course.
  await page.locator('[data-tab="englishPath"]').click();
  assert.ok(await page.locator('#englishPath .english-path-lesson').count() >= 15, 'English learning path must render a substantial set of lessons');
  const firstPathLesson = page.locator('#englishPath .english-path-lesson').first();
  await firstPathLesson.locator(':scope > summary').click();
  assert.ok(await firstPathLesson.getByText('أمثلة مع الترجمة').count() === 1, 'English lessons must include explained examples');
  await firstPathLesson.locator('input[type="radio"]').nth(1).check();
  await firstPathLesson.locator('[data-path-check]').click();
  assert.ok((await firstPathLesson.locator('[data-path-feedback]').textContent()).includes('إجابة صحيحة'), 'English lesson quiz must provide feedback');
  await firstPathLesson.locator('[data-path-done]').check();
  assert.ok((await page.locator('#englishPathProgress').textContent()).includes('1 من'), 'English learning progress must update');

  // Exam center must build timed exams from the existing lesson question banks and save graded attempts.
  await page.locator('[data-tab="examCenter"]').click();
  await page.locator('#examSubject').selectOption('biology2027');
  assert.ok((await page.locator('#examBankInfo').textContent()).includes('سؤالًا'), 'Exam center must report the available lesson question bank');
  await page.locator('#examCount').selectOption('5');
  await page.locator('#examMinutes').selectOption('10');
  await page.locator('#examStart').click();
  assert.equal(await page.locator('#examCenterRoot .exam-question').count(), 5, 'Exam center must start with the requested number of questions');
  await page.locator('#examCenterRoot .exam-options input').first().check();
  assert.ok((await page.locator('#examAnswered').textContent()).includes('1 من 5'), 'Exam center must count answered questions');
  await page.locator('#examSubmit').click();
  await page.locator('#examCenterRoot .exam-result-hero').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#examCenterRoot .exam-review').count(), 5, 'Exam center must review every submitted answer');
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')).examHistory.length), 1, 'Exam result must persist in local study data');
  assert.equal(await page.locator('#examCenterRoot #examHistory .exam-history-item').count(), 1, 'Exam center must display the saved attempt in history');

  // Ministry library must show the 2026/2027 track subjects and shared pass/fail subjects.
  await page.locator('[data-tab="library"]').click();
  await page.locator('#ministrySubjectGrid [data-ministry-subject="الأحياء"]').waitFor({ state: 'visible' });
  await page.locator('#ministrySubjectGrid [data-ministry-subject="اللغة الأجنبية الأولى"]').waitFor({ state: 'visible' });
  await page.locator('#ministrySubjectGrid [data-ministry-subject="اللغة الأجنبية الثانية"]').waitFor({ state: 'visible' });
  await page.locator('#ministrySubjectGrid [data-ministry-subject="التربية الدينية"]').waitFor({ state: 'visible' });
  await page.locator('#ministrySubjectGrid [data-ministry-subject="التربية الوطنية"]').waitFor({ state: 'visible' });
  await page.locator('#ministrySubjectGrid [data-ministry-subject="التربية الوطنية"]').click();
  assert.equal(await page.getByRole('link', { name: 'عرض الكتاب PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/National_Education_Sec3_tr1.pdf');
  assert.equal(await page.getByRole('link', { name: 'تحميل PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/National_Education_Sec3_tr1.pdf');
  await page.locator('#ministrySubjectGrid [data-ministry-subject="التربية الدينية"]').click();
  assert.equal(await page.getByRole('link', { name: 'عرض التربية الدينية الإسلامية PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Islamic_religion_Sec3.pdf');
  assert.equal(await page.getByRole('link', { name: 'تحميل التربية الدينية الإسلامية PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Islamic_religion_Sec3.pdf');
  assert.equal(await page.getByRole('link', { name: 'عرض التربية الدينية المسيحية PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Christian_religion_Sec3.pdf');
  assert.equal(await page.getByRole('link', { name: 'تحميل التربية الدينية المسيحية PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Christian_religion_Sec3.pdf');
  assert.equal(await page.locator('#ministrySubjectGrid [data-ministry-subject="الجيولوجيا"]').count(), 0);
  await page.locator('#ministrySubjectGrid [data-ministry-subject="الفيزياء"]').click();
  await page.locator('#ministrySubjectDetail h2').getByText('الفيزياء').waitFor({ state: 'visible' });
  assert.equal(await page.getByRole('link', { name: 'عرض الكتاب PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Physics_Arabic_Sec3.pdf');
  assert.equal(await page.getByRole('link', { name: 'تحميل PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Physics_Arabic_Sec3.pdf');
  await page.locator('#ministrySubjectGrid [data-ministry-subject="اللغة العربية"]').click();
  assert.equal(await page.getByRole('link', { name: 'عرض القصة PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Arabic_language_Story_Sec3.pdf');
  assert.equal(await page.getByRole('link', { name: 'عرض القواعد PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Arabic_language_NAHO_Sec3.pdf');
  await page.locator('#ministrySubjectGrid [data-ministry-subject="اللغة الأجنبية الثانية"]').click();
  assert.equal(await page.getByRole('link', { name: 'عرض الكتاب PDF' }).getAttribute('href'), 'https://elearnningcontent.blob.core.windows.net/elearnningcontent/2026_2027/Secondry/Secondry3/Term1/StudentBook/Premiere_langue_francaise_SB_Sec3.pdf');
  await page.locator('#trk').selectOption('math');
  await page.locator('#ministrySubjectGrid [data-ministry-subject="الرياضيات"]').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#ministrySubjectGrid [data-ministry-subject="الأحياء"]').count(), 0);
  assert.equal(await page.locator('#ministrySubjectGrid [data-ministry-subject="الجيولوجيا"]').count(), 0);
  await page.locator('#trk').selectOption('sci');

  // Dashboard quick links must return to the home screen.
  await page.locator('[data-go-tab="home"]').first().click();
  await page.locator('#home').waitFor({ state: 'visible' });

  // Schedule entries should be created and rendered.
  await page.locator('[data-tab="sched"]').click();
  await page.locator('#evT').fill('اختبار واجهة المنصة');
  await page.locator('#evD').fill('2027-01-15');
  await page.locator('#evH').fill('18:30');
  await page.locator('#evForm button[type="submit"]').click();
  await page.locator('#upList').getByText('اختبار واجهة المنصة').waitFor({ state: 'visible' });

  // Schedule completion, undo, deletion, and persistence should all work.
  await page.evaluate(() => { const checkbox = document.querySelector('#upList [data-done]'); checkbox.checked = true; checkbox.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.locator('#doneList').getByText('اختبار واجهة المنصة').waitFor({ state: 'visible' });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-tab="sched"]').click();
  await page.locator('#doneList').getByText('اختبار واجهة المنصة').waitFor({ state: 'visible' });
  await page.evaluate(() => { const checkbox = document.querySelector('#doneList [data-done]'); checkbox.checked = false; checkbox.dispatchEvent(new Event('change', { bubbles: true })); });
  await page.locator('#upList').getByText('اختبار واجهة المنصة').waitFor({ state: 'visible' });
  await page.locator('#upList [data-del]').click();
  await page.locator('#upList').getByText('ضيف أول موعد مذاكرة من الأعلى').waitFor({ state: 'visible' });

  // Notes should be saved locally without requiring an AI provider.
  await page.locator('[data-tab="notes"]').click();
  await page.locator('#nT').fill('ملاحظة اختبارية');
  await page.locator('#nB').fill('هذه فقرة اختبارية تحتوي على معلومات كافية لحفظها في ملخص محلي داخل المنصة.');
  await page.locator('#noteForm button[type="submit"]').click();
  await page.locator('#noteList').getByText('ملاحظة اختبارية').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#noteList .panel').count(), 1, 'A saved note must render as one note card');
  await page.locator('#noteList [data-ndel]').click();
  await page.locator('#noteList').getByText('ملخصاتك هتظهر هنا').waitFor({ state: 'visible' });
  await page.locator('#nT').fill('ملاحظة اختبارية ثانية');
  await page.locator('#nB').fill('هذه فقرة ثانية لاختبار أن حفظ الملاحظات يعمل بعد حذف الملاحظة الأولى.');
  await page.locator('#noteForm button[type="submit"]').click();
  await page.locator('#noteList').getByText('ملاحظة اختبارية ثانية').waitFor({ state: 'visible' });

  // A saved note should survive a full page reload.
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-tab="notes"]').click();
  await page.locator('#noteList').getByText('ملاحظة اختبارية ثانية').waitFor({ state: 'visible' });

  // Vocabulary words should support manual entry, flashcard reveal, spaced review, deletion, and AI-chat import.
  await page.locator('[data-tab="eng"]').click();
  await page.locator('#wE').fill('resilient');
  await page.locator('#wA').fill('مرن وقادر على التعافي');
  await page.locator('#wForm button[type="submit"]').click();
  await page.locator('#wList').getByText('resilient').waitFor({ state: 'visible' });
  await page.locator('#card').click();
  await page.locator('#card').getByText('مرن وقادر على التعافي').waitFor({ state: 'visible' });
  await page.locator('#know').click();
  assert.equal(await page.locator('#rev').evaluate(element => element.hidden), true, 'Review buttons should be marked hidden after advancing');
  await page.locator('#wList [data-wdel]').click();
  await page.locator('#wList').getByText('ضيف كلمات جديدة من فوق').waitFor({ state: 'visible' });
  await page.evaluate(() => {
    const button = document.createElement('button');
    button.dataset.addw = 'break down = يتعطل أو ينهار';
    document.body.appendChild(button);
    button.click();
    button.remove();
  });
  await page.locator('#wList').getByText('break down').waitFor({ state: 'visible' });
  await page.locator('#wList').getByText('يتعطل أو ينهار').waitFor({ state: 'visible' });

  // English 2027 course tools should render, save vocabulary locally, and start a quiz.
  await page.locator('[data-tab="english2027"]').click();
  await page.locator('#ecProgressText').getByText('0 من 12 وحدة').waitFor({ state: 'visible' });
  const officialEnglishLibrary = page.locator('#english2027 a[href="https://studentbooks.moe.gov.eg/Books"]');
  assert.ok(await officialEnglishLibrary.count() >= 1, 'English course must link to the official Ministry book library');
  assert.ok(await page.locator('#ecUnitList').getByText('محاور للمذاكرة وليست قائمة رسمية بعناوين الدروس').count() > 0, 'Unit details must identify lesson prompts as unverified official titles');
  assert.ok(await page.locator('#english2027').getByText('فهرس مساعد غير رسمي').count() === 1, 'Supplementary curriculum index must be labeled unofficial');
  await page.locator('#ecWord').fill('caregiver');
  await page.locator('#ecMeaning').fill('مقدم رعاية');
  await page.locator('#ecWordForm button[type="submit"]').click();
  await page.locator('#ecWordList').getByText('caregiver').waitFor({ state: 'visible' });
  await page.locator('#ecFlashShow').click();
  await page.locator('#ecFlash').getByText('مقدم رعاية').waitFor({ state: 'visible' });
  await page.locator('#ecQuizStart').click();
  assert.equal(await page.locator('#ecQuizBox .course-question').count(), 5, 'English course quiz should generate five questions');

  // English conversation helper should show a clear static-host AI fallback.
  await page.locator('[data-tab="chat"]').click();
  await page.locator('#cIn').fill('Hello, how are you?');
  await page.locator('#cSend').click();
  await page.locator('#cSt').getByText('مش متاحة هنا').waitFor({ state: 'visible' });

  // Practice tracking should validate answers, persist a valid session, and update the weekly goal.
  await page.locator('[data-tab="prac"]').click();
  await page.locator('#pN').fill('5');
  await page.locator('#pC').fill('6');
  await page.locator('#pForm button[type="submit"]').click();
  assert.equal(await page.locator('#stats').getByText('5 سؤال').count(), 0, 'Invalid practice results must not be saved');
  await page.locator('#pN').fill('5');
  await page.locator('#pC').fill('4');
  await page.locator('#pForm button[type="submit"]').click();
  await page.locator('#stats').getByText('5 سؤال، دقة 80%').waitFor({ state: 'visible' });
  await page.locator('#goal').fill('30');
  await page.locator('#goal').dispatchEvent('change');
  await page.locator('#goalSt').getByText('من 30 سؤال').waitFor({ state: 'visible' });
  await page.locator('#qT').fill('درس تجريبي');
  await page.locator('#qBtn').click();
  await page.locator('#qSt').getByText('مش متاحة هنا').waitFor({ state: 'visible' });
  await page.locator('#plBtn').click();
  await page.locator('#plSt').getByText('مش متاحة هنا').waitFor({ state: 'visible' });

  // A newly recorded mistake must remain visible even when its spaced-review date is in the future.
  await page.locator('[data-tab="tools"]').click();
  await page.locator('#mQ').fill('سؤال يحتاج مراجعة لاحقًا');
  await page.locator('#mForm button[type="submit"]').click();
  await page.locator('#mList').getByText('سؤال يحتاج مراجعة لاحقًا').waitFor({ state: 'visible' });
  await page.locator('#mList [data-mno]').click();
  await page.locator('#mList').getByText('موعد المراجعة:').waitFor({ state: 'visible' });
  await page.locator('#mList [data-mok]').click();
  await page.locator('#mList [data-mok]').click();
  await page.locator('#mSt').getByText('1 اتراجعت بنجاح').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#mList').getByText('سؤال يحتاج مراجعة لاحقًا').count(), 0);
  await page.locator('#mQ').fill('خطأ ثانٍ لاختبار استعادة النسخة الاحتياطية');
  await page.locator('#mForm button[type="submit"]').click();
  await page.locator('#mList').getByText('خطأ ثانٍ لاختبار استعادة النسخة الاحتياطية').waitFor({ state: 'visible' });

  // AI-dependent tools must explain the Pages limitation instead of failing silently.
  await page.locator('#aT').fill('A short lesson about photosynthesis.');
  await page.locator('#aQ').fill('Explain photosynthesis.');
  await page.locator('#aGo').click();
  await page.locator('#aSt').getByText('غير مفعّل').waitFor({ state: 'visible' });

  // Invalid backup files must be rejected without replacing the current study data.
  await page.locator('#bkIn').setInputFiles({
    name: 'invalid-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ notes: 'not-an-array', injectedField: true }))
  });
  await page.locator('#bkSt').getByText('مش نسخة صالحة').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#mList').getByText('خطأ ثانٍ لاختبار استعادة النسخة الاحتياطية').count(), 1);

  // Backup export must produce a readable JSON snapshot of current study data.
  const [backupDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#bkGo').click()
  ]);
  assert.equal(backupDownload.suggestedFilename(), 'study-backup.json');
  const backupStream = await backupDownload.createReadStream();
  const backupChunks = [];
  for await (const chunk of backupStream) backupChunks.push(chunk);
  const exportedBackup = JSON.parse(Buffer.concat(backupChunks).toString('utf8'));
  assert.ok(Array.isArray(exportedBackup.ev));
  assert.ok(exportedBackup.mist.some(item => item.q === 'خطأ ثانٍ لاختبار استعادة النسخة الاحتياطية'));

  // A valid backup must restore schedule, notes, study track, and appearance immediately.
  const validBackup = {
    ev: [{ id: 'restored-event', title: 'موعد مستعاد من النسخة', d: '2027-01-16', t: '10:00', lead: 10, fired: false, done: false }],
    notes: [{ id: 'restored-note', title: 'ملاحظة مستعادة', sub: 'فيزياء', sum: 'ملخص تم استعادته بنجاح.' }],
    words: [], track: 'math', prac: [], goal: 40, mist: [], focus: {},
    courseDone: {}, courseWords: [], courseWriting: [], courseExamChecks: {},
    theme: 'dark', app: 'Backup Restored', me: 'Restored Student', color: '#4F46E5'
  };
  await page.locator('#bkIn').setInputFiles({
    name: 'valid-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(validBackup))
  });
  await page.locator('#bkSt').getByText('اترجعت بياناتك').waitFor({ state: 'visible' });
  await page.locator('[data-tab="sched"]').click();
  await page.locator('#upList').getByText('موعد مستعاد من النسخة').waitFor({ state: 'visible' });
  await page.locator('[data-tab="notes"]').click();
  await page.locator('#noteList').getByText('ملاحظة مستعادة').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#trk').inputValue(), 'math');
  assert.equal(await page.locator('#brandName').textContent(), 'Backup Restored');
  assert.equal(await page.locator('#hi').textContent(), 'أهلًا يا Restored Student');
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue('--brand')), '#4F46E5');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('[data-tab="tools"]').click();
  assert.equal(await page.locator('#brandName').textContent(), 'Backup Restored');
  await page.locator('[data-tab="sched"]').click();
  await page.locator('#upList').getByText('موعد مستعاد من النسخة').waitFor({ state: 'visible' });
  await page.locator('[data-tab="notes"]').click();
  await page.locator('#noteList').getByText('ملاحظة مستعادة').waitFor({ state: 'visible' });

  // Focus timer can start and cancel without corrupting the timer display.
  await page.locator('[data-tab="tools"]').click();
  await page.locator('#pmGo').click();
  await page.locator('#pmT').waitFor({ state: 'visible' });
  await page.locator('#pmX').click();
  assert.equal(await page.locator('#pmT').textContent(), '25:00');
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');

  // Theme selection must persist across reloads.
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');

  // Appearance preferences must update the live UI and persist locally.
  await page.locator('[data-tab="tools"]').click();
  await page.locator('#cuA').fill('My Study Space');
  await page.locator('#cuM').fill('Student');
  await page.locator('#cuCols [data-col="#4F46E5"]').click();
  assert.equal(await page.locator('#brandName').textContent(), 'My Study Space');
  assert.equal(await page.locator('#hi').textContent(), 'أهلًا يا Student');
  assert.equal(await page.evaluate(() => document.documentElement.style.getPropertyValue('--brand')), '#4F46E5');
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('#brandName').textContent(), 'My Study Space');
  assert.equal(await page.locator('#hi').textContent(), 'أهلًا يا Student');

  // Malformed legacy storage must fall back safely instead of crashing app startup.
  await page.evaluate(() => localStorage.setItem('study-v1', '{ malformed json'));
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#home').waitFor({ state: 'visible' });

  // Existing local data key and arbitrary saved fields must survive startup.
  await page.evaluate(() => localStorage.setItem('study-v1', JSON.stringify({
    ev: [], notes: [], words: [], track: 'sci', prac: [], goal: 100, mist: [], focus: {}, smokeTestMarker: 'preserved'
  })));
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')).smokeTestMarker), 'preserved');

  // Mobile layout must fit the viewport without page-level horizontal overflow.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#home').waitFor({ state: 'visible' });
  const mobile = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    nav: getComputedStyle(document.querySelector('.tabs')).overflowX,
    offenders: [...document.querySelectorAll('body *')].filter(el => {
      if (el.closest('[hidden]')) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && (r.right > document.documentElement.clientWidth + 2 || r.left < -2);
    }).slice(0, 12).map(el => ({tag:el.tagName,id:el.id,className:typeof el.className==='string'?el.className:'',left:Math.round(el.getBoundingClientRect().left),right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)}))
  }));
  assert.ok(mobile.document <= mobile.viewport + 1, `Mobile page overflow: ${JSON.stringify(mobile)}`);
  assert.ok(['auto', 'scroll'].includes(mobile.nav), `Mobile navigation should scroll horizontally: ${mobile.nav}`);

  // A narrow 320px viewport must also remain usable.
  await page.setViewportSize({ width: 320, height: 740 });
  const narrow = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth
  }));
  assert.ok(narrow.document <= narrow.viewport + 1, `Narrow mobile page overflow: ${JSON.stringify(narrow)}`);

  assert.deepEqual(pageErrors, [], `Uncaught browser errors: ${pageErrors.join('; ')}`);
  console.log('PASS: homepage, navigation, schedule creation, local notes, theme persistence, local data preservation, mistake review, AI fallback, backup validation, mobile overflow at 390px and 320px, and browser console.');
} finally {
  await browser.close();
}
