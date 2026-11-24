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
  const pastExamArchiveResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/past-exam-archive.js');
  const dashboardResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/dashboard.js');
  const smartRevisionResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/smart-revision.js');
  const ministryLibraryResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/ministry-library.js');
  const englishCoachResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/english-coach.js');
  const preferencesResponse = await page.request.get('http://127.0.0.1:4173/assets/js/features/preferences.js');
  const serviceWorkerResponse = await page.request.get('http://127.0.0.1:4173/sw.js');
  assert.equal(serviceWorkerResponse.status(), 200, 'Service worker must be served');
  const serviceWorkerSource = await serviceWorkerResponse.text();
  assert.match(serviceWorkerSource, /ahmed-study-platform-v\d+/, 'Service worker cache must be versioned');
  for (const modulePath of ['./assets/js/features/preferences.js', './assets/js/features/english-course.js', './assets/js/features/english-learning-path.js', './assets/js/features/subject-courses.js', './assets/js/features/exam-center.js', './assets/js/features/past-exam-archive.js', './assets/js/features/dashboard.js', './assets/js/features/smart-revision.js', './assets/js/features/ministry-library.js', './assets/js/features/english-coach.js']) {
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
  assert.equal(pastExamArchiveResponse.status(), 200, 'Past exam archive module must be served');
  const pastExamArchiveSource = await pastExamArchiveResponse.text();
  assert.match(pastExamArchiveSource, /مراجع الكتب الخارجية/, 'Past exam archive must include the external-book references section');
  assert.match(pastExamArchiveSource, /arabic-emtehan-2026/, 'Archive must include the Arabic previous-exam book reference');
  assert.match(pastExamArchiveSource, /biology-emtehan-2026/, 'Archive must include the Biology previous-exam book reference');
  assert.match(pastExamArchiveSource, /french-bravo-2026/, 'Archive must include the French second-language book reference');
  assert.match(pastExamArchiveSource, /نماذج تدريبية — ليست امتحانات سابقة مؤكدة/, 'Practice models must not be mislabeled as previous official exams');
  assert.match(pastExamArchiveSource, /النماذج 1–11 تبدأ من صفحة 102/, 'Chemistry previous-year model page range must be visible');
  assert.match(pastExamArchiveSource, /2021–2024/, 'Biology previous-year coverage must be visible');
  assert.match(pastExamArchiveSource, /الصفحات 129–209/, 'French booklet index page range must be visible');
  assert.match(pastExamArchiveSource, /تفاصيل الفهرس/, 'External-book records must expose index details');
  assert.match(pastExamArchiveSource, /2023-science-french-second-answer/, 'Archive must include official 2023 second-language French answer key');
  assert.match(pastExamArchiveSource, /2023-science-biology-fr-answer/, 'Archive must include official 2023 Biology French answer key');
  assert.match(pastExamArchiveSource, /2023-math-algebra-answer/, 'Archive must include official 2023 mathematics answer key');
  assert.match(pastExamArchiveSource, /2023-arts-history-answer/, 'Archive must include official 2023 literary-division history answer key');
  assert.match(pastExamArchiveSource, /2023-arts-history-paper-portal/, 'Archive must include official 2023 literary-division History question-paper portal');
  assert.match(pastExamArchiveSource, /2023-arts-geography-paper-portal/, 'Archive must include official 2023 literary-division Geography question-paper portal');
  assert.match(pastExamArchiveSource, /2021-june-trial-portal/, 'Archive must include the official 2021 trial-exam portal as a portal, not a final paper');
  assert.match(pastExamArchiveSource, /2019-biology-first-answer/, 'Archive must include the verified 2019 Biology Ministry answer key as an answer, not a question paper');
  assert.match(pastExamArchiveSource, /2021-math-arabic-trial-paper/, 'Archive must include the verified 2021 trial resource 2021-math-arabic-trial-paper');
  assert.match(pastExamArchiveSource, /2021-biology-arabic-trial-paper/, 'Archive must include the verified 2021 trial resource 2021-biology-arabic-trial-paper');
  assert.match(pastExamArchiveSource, /2021-physics-arabic-trial-paper/, 'Archive must include the verified 2021 trial resource 2021-physics-arabic-trial-paper');
  assert.match(pastExamArchiveSource, /2021-chemistry-arabic-trial-paper/, 'Archive must include the verified 2021 trial resource 2021-chemistry-arabic-trial-paper');
  assert.match(pastExamArchiveSource, /2021-history-trial-paper/, 'Archive must include the verified 2021 trial resource 2021-history-trial-paper');
  assert.match(pastExamArchiveSource, /2021-geography-trial-paper/, 'Archive must include the verified 2021 trial resource 2021-geography-trial-paper');
  assert.match(pastExamArchiveSource, /2021-math-arabic-trial-answer/, 'Archive must include the verified 2021 trial resource 2021-math-arabic-trial-answer');
  assert.match(pastExamArchiveSource, /2021-geography-trial-answer/, 'Archive must include the verified 2021 trial resource 2021-geography-trial-answer');
  assert.match(pastExamArchiveSource, /2023-arts-geography-answer/, 'Archive must include official 2023 literary-division Geography answer key');
  assert.match(pastExamArchiveSource, /const ARTS_2023_KEYS/, 'Archive must include interactive 2023 History and Geography answer keys');
  assert.match(pastExamArchiveSource, /function renderArts2023InteractiveExam/, 'History and Geography must expose interactive grading');
  assert.match(pastExamArchiveSource, /pastExamArtsQuiz/, 'History and Geography interactive answer sheet must render');
  assert.match(pastExamArchiveSource, /32 سؤالًا بدرجة واحدة و12 سؤالًا بدرجتين/, 'Arts quiz must disclose official weighted question distribution');


  for (const examId of [
    '2020-chemistry-hearing-paper',
    '2020-physics-blind-paper',
    '2020-biology-mobility-paper',
    '2020-pure-math-mobility-paper'
  ]) {
    assert.match(pastExamArchiveSource, new RegExp('"id": "' + examId + '"'), 'Archive must include the verified 2020 Ministry paper ' + examId);
  }
  assert.match(pastExamArchiveSource, /ورقة امتحان وزارة رسمية — نسخة دمج/, 'Inclusive exam papers must be clearly labeled as special-accommodation versions');

  assert.match(pastExamArchiveSource, /2023-official-question-paper-portal/, 'Archive must link to the official Ministry question-paper portal');
  assert.match(pastExamArchiveSource, /2024-official-question-and-answer-portal/, 'Archive must link to the official 2024 questions and answer resource');
  assert.match(pastExamArchiveSource, /2026-official-models-portal/, 'Archive must link to the official 2026 model-exam portal');
  const examCatalogStart = pastExamArchiveSource.indexOf('const EXAMS = [');
  const examCatalogEnd = pastExamArchiveSource.indexOf('];', examCatalogStart);
  const examCatalogSource = pastExamArchiveSource.slice(examCatalogStart, examCatalogEnd);
  const examRecordCount = (examCatalogSource.match(/"id":/g) || []).length;
  const classifiedRecordCount = (examCatalogSource.match(/"fileKind":/g) || []).length;
  assert.equal(classifiedRecordCount, examRecordCount, 'Every archive resource must declare whether it is a paper, answer key, model, or portal');
  for (const portalId of [
    '2023-ministry-exam-portal',
    '2023-official-question-paper-portal',
    '2023-arts-history-paper-portal',
    '2023-arts-geography-paper-portal',
    '2024-madrasetna-plus',
    '2024-official-question-and-answer-portal',
    '2025-ministry-models',
    '2026-official-models-portal'
  ]) {
    const portalRecord = examCatalogSource.slice(examCatalogSource.indexOf('"id": "' + portalId + '"'));
    assert.match(portalRecord, /"fileKind": "portal"/, 'Portal links must not be presented as direct exam-paper files: ' + portalId);
  }

  assert.match(pastExamArchiveSource, /ARABIC_2023_MODEL_A_KEY/, 'Archive must include the 2023 Arabic model A answer key');
  for (const model of ['A', 'B', 'C', 'D']) {
    assert.match(pastExamArchiveSource, new RegExp('ARABIC_2023_MODEL_' + model + '_KEY'), 'Archive must include the 2023 Arabic model ' + model + ' answer key');
  }
  assert.match(pastExamArchiveSource, /pastExamArabicModel/, 'Arabic interactive exam must allow selecting all four official models');
  assert.match(pastExamArchiveSource, /pastExamArabicQuiz/, 'Archive must render an interactive answer sheet');
  for (const model of ['A', 'B', 'C', 'D']) {
    assert.match(pastExamArchiveSource, new RegExp('CHEMISTRY_2023_MODEL_' + model + '_KEY'), 'Archive must include the 2023 Chemistry model ' + model + ' answer key');
  }
  assert.match(pastExamArchiveSource, /pastExamChemistryModel/, 'Chemistry quiz must allow selecting all four official models');
  assert.match(pastExamArchiveSource, /44 سؤالًا موضوعيًا/, 'Chemistry quiz must grade 44 objective questions');
  assert.match(pastExamArchiveSource, /CHEMISTRY_2023_WEIGHTS/, 'Chemistry quiz must apply the Ministry mark distribution');
  assert.match(pastExamArchiveSource, /scinece-exammodels\.pdf#page=53/, 'Chemistry quiz must link to the official Ministry answer-key PDF');
  assert.match(pastExamArchiveSource, /mediafire\.com\/file\//, 'Chemistry quiz must provide the external question-paper archive link');
  assert.match(pastExamArchiveSource, /PHYSICS_2023_MODEL_[ABCD]_KEY/, 'Archive must include official Arabic Physics 2023 answer keys');
  for (const model of ['A', 'B', 'C', 'D']) {
    assert.match(pastExamArchiveSource, new RegExp('PHYSICS_2023_MODEL_' + model + '_KEY'), 'Archive must include the 2023 Physics model ' + model + ' answer key');
  }
  assert.match(pastExamArchiveSource, /pastExamPhysicsModel/, 'Physics quiz must allow selecting all four official models');
  for (const model of ['A', 'B', 'C', 'D']) {
    assert.match(pastExamArchiveSource, new RegExp('BIOLOGY_2023_MODEL_' + model + '_KEY'), 'Archive must include the 2023 Biology model ' + model + ' answer key');
  }
  assert.match(pastExamArchiveSource, /pastExamBiologyModel/, 'Biology quiz must allow selecting all four official models');
  assert.ok(pastExamArchiveSource.includes('scinece-exammodels.pdf#page=98'), 'Biology quiz must link to the official Ministry answer-key page');
  assert.ok(pastExamArchiveSource.includes('ta3lemkonline.com/2023/08/2023_33.html'), 'Biology quiz must link to a separate exam-paper archive page');
  for (const branch of ['statics', 'dynamics', 'calculus', 'algebra']) {
    assert.match(pastExamArchiveSource, new RegExp(branch + ': \\{'), 'Math archive must include the ' + branch + ' branch');
    for (const model of ['أ', 'ب', 'ج', 'د']) {
      const branchStart = pastExamArchiveSource.indexOf(branch + ': {', pastExamArchiveSource.indexOf('const MATH_2023_KEYS'));
      const branchSource = pastExamArchiveSource.slice(branchStart, branchStart + 1800);
      const keyStart = branchSource.indexOf(model + ': [');
      const keyEnd = branchSource.indexOf(']', keyStart);
      const keyLine = keyStart >= 0 && keyEnd >= 0 ? branchSource.slice(keyStart, keyEnd + 1) : '';
      assert.ok(keyLine, 'Math archive must include ' + branch + ' model ' + model);
      assert.equal((keyLine.match(/'[^']+'/g) || []).length, 18, branch + ' model ' + model + ' must contain 18 objective answers');
    }
  }
  assert.ok(pastExamArchiveSource.includes('${MATH_2023_ANSWER_URL}#page=82'), 'Math archive must link to the official Statics paper');
  assert.ok(pastExamArchiveSource.includes('${MATH_2023_ANSWER_URL}#page=97'), 'Math archive must link to the official Dynamics paper');
  assert.ok(pastExamArchiveSource.includes('${MATH_2023_ANSWER_URL}#page=112'), 'Math archive must link to the official Calculus paper');
  assert.ok(pastExamArchiveSource.includes('${MATH_2023_ANSWER_URL}#page=127'), 'Math archive must link to the official Algebra and Geometry paper');
  for (const subject of ['first', 'second']) {
    const subjectStart = pastExamArchiveSource.indexOf(subject + ': {', pastExamArchiveSource.indexOf('const ENGLISH_2023_KEYS'));
    assert.ok(subjectStart >= 0, 'English archive must include ' + subject + ' language');
    const subjectSource = pastExamArchiveSource.slice(subjectStart, subjectStart + 3000);
    for (const model of ['A', 'B', 'C', 'D']) {
      const modelStart = subjectSource.indexOf(model + ': [');
      const modelEnd = subjectSource.indexOf(']', modelStart);
      assert.ok(modelStart >= 0 && modelEnd > modelStart, 'English archive must include ' + subject + ' model ' + model);
      const keySource = subjectSource.slice(modelStart, modelEnd + 1);
      const expectedCount = subject === 'first' ? 34 : 29;
      assert.equal((keySource.match(/'[^']+'/g) || []).length, expectedCount, subject + ' model ' + model + ' must have ' + expectedCount + ' objective answers');
    }
  }
  assert.ok(pastExamArchiveSource.includes('bablsheet.blob.core.windows.net/examq2023/09.pdf'), 'Second English paper must have a question-paper PDF link');
  assert.ok(pastExamArchiveSource.includes('English-exam-3secondary.html'), 'First English paper must have an external archive reference');
  assert.ok(pastExamArchiveSource.includes('scinece-exammodels.pdf#page=8'), 'First English answer key must link to the Ministry PDF');
  assert.ok(pastExamArchiveSource.includes('scinece-exammodels.pdf#page=28'), 'Second English answer key must link to the Ministry PDF');
  assert.match(pastExamArchiveSource, /44 سؤالًا موضوعيًا/, 'Physics quiz must grade 44 objective questions');
  assert.match(pastExamArchiveSource, /PHYSICS_2023_WEIGHTS/, 'Physics quiz must apply the Ministry mark distribution');
  assert.match(pastExamArchiveSource, /scinece-exammodels\.pdf#page=68/, 'Physics quiz must link to the official Ministry answer-key PDF');
  assert.match(pastExamArchiveSource, /ta3lemkonline\.com\/2023\/08\/2023_32\.html/, 'Physics quiz must link to a separate exam-paper download page');
  assert.match(pastExamArchiveSource, /51 سؤالًا موضوعيًا/, 'Arabic answer sheet must clearly limit automatic grading to 51 objective questions');
  assert.match(pastExamArchiveSource, /arts-answermodels\.pdf#page=4/, 'Arabic quiz must link to the Ministry answer-key PDF');
  assert.match(pastExamArchiveSource, /drive\.google\.com\/file\/d\//, 'Arabic quiz must provide a separate question-paper link');
  assert.equal(dashboardResponse.status(), 200, 'Smart dashboard module must be served');
  assert.equal(smartRevisionResponse.status(), 200, 'Smart revision module must be served');
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
  assert.ok(scriptOrder.indexOf('./assets/js/features/english-learning-path.js') < scriptOrder.indexOf('./assets/js/features/dashboard.js'), 'English progress source must load before dashboard');
  assert.ok(scriptOrder.indexOf('./assets/js/features/dashboard.js') < scriptOrder.indexOf('./assets/js/features/smart-revision.js'), 'Dashboard must load before smart revision');
  assert.ok(scriptOrder.indexOf('./assets/js/features/smart-revision.js') < scriptOrder.indexOf('./assets/js/app.js'), 'Smart revision module must load before app initialization');
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
  assert.equal(await page.evaluate(() => typeof window.StudyPastExamArchive?.init), 'function', 'Past exam archive module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyMinistryLibrary?.init), 'function', 'Ministry library module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.ecRender), 'function', 'English course renderer must be available to tab navigation');
  assert.equal(await page.evaluate(() => typeof window.StudyEnglishCoach?.init), 'function', 'English coach module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudyPreferences?.init), 'function', 'Preferences module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudySchedule?.init), 'function', 'Schedule module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.activateTab), 'function', 'Navigation module must expose tab activation');
  assert.match(await page.title(), /Ahmed Study Platform/);
  await page.locator('#home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.tabs [role="tab"]').count(), 18, 'Smart revision, exam center, English learning path, and five subject tabs must preserve all existing tabs');
  assert.equal(await page.evaluate(() => typeof window.StudySmartRevision?.init), 'function', 'Smart revision module must expose its initializer');
  assert.equal(await page.locator('#reviewCenter #smartReviewRoot').count(), 1, 'Smart revision must have its own content section');
  assert.equal(await page.locator('#smartDashboard .smart-metric').count(), 4, 'Homepage dashboard must show four live learning metrics');
  assert.equal(await page.locator('#smartDashboard .smart-subject').count(), 6, 'Homepage dashboard must show five school subjects and the English learning path');
  assert.equal(await page.evaluate(() => typeof window.StudyDashboard?.init), 'function', 'Dashboard module must expose its initializer');
  const progressStats = await page.evaluate(() => ({biology:window.StudySubjectCourses.getProgressStats({subjectLessonDone:{biology2027:{'0-0':true}}}).find(item=>item.id==='biology2027'),english:window.StudyEnglishPath.getProgressStats({englishPathDone:{0:true}})}));
  assert.equal(progressStats.biology.completed, 1, 'Subject dashboard stats must count completed lessons from saved state');
  assert.equal(progressStats.english.completed, 1, 'English dashboard stats must count completed lessons from saved state');
  for (const subject of ['arabic2027', 'chemistry2027', 'physics2027', 'math2027', 'biology2027']) {
    assert.equal(await page.locator(`.tabs [role="tab"][data-tab="${subject}"]`).count(), 1, `${subject} must have one navigation tab`);
    assert.equal(await page.locator(`#${subject}`).count(), 1, `${subject} must have one content section`);
  }

  // Past exam archive renders verified Ministry resources and filters them accurately.
  await page.locator('[data-tab="pastExamArchive"]').click();
  assert.equal(await page.locator('#pastExamArchiveRoot #pastExamSystem option').count(), 4);
  assert.equal(await page.locator('#pastExamArchiveRoot #pastExamYear option').count(), 9);
  assert.equal(await page.locator('#pastExamArchiveRoot #pastExamFileKind option').count(), 5, 'Archive must provide separate filters for papers, answer keys, models, and portals');
  assert.ok((await page.locator('#pastExamArchiveRoot p.past-exam-note').innerText()).includes('2021 و2022'), 'Archive must disclose years whose official exam papers are not yet verified');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 59, 'Archive must render fifty-nine catalogued resources');
  await page.locator('#pastExamYear').selectOption('2019');
  assert.ok((await page.locator('#pastExamResults').innerText()).includes('نموذج اختبار الفيزياء — فئة الدمج'), '2019 Physics mobility model must be listed and clearly identified as a special-category resource');
  await page.locator('#pastExamYear').selectOption('2020');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 7, 'Year filter must isolate the seven in-scope 2020 resources');
  await page.locator('#pastExamYear').selectOption('2023');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 30, 'Year filter must isolate the thirty in-scope 2023 resources');
  await page.locator('#pastExamYear').selectOption('all');
  await page.locator('#pastExamFileKind').selectOption('paper');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 8, 'Direct exam papers must be separated from answers, models, and portals');
  await page.locator('#pastExamFileKind').selectOption('answer');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 31, 'Official answer keys must be independently filterable');
  await page.locator('#pastExamFileKind').selectOption('model');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 11, 'Official practice and indicative models must be independently filterable');
  await page.locator('#pastExamFileKind').selectOption('portal');
  assert.equal(await page.locator('#pastExamResults .past-exam-card').count(), 9, 'Portal links must be independently filterable');
  await page.locator('#pastExamFileKind').selectOption('all');
  const archiveSubjects = await page.locator('#pastExamSubject option').allTextContents();
  assert.ok(!archiveSubjects.some(subject => /علم النفس|الفلسفة|الاقتصاد|الإحصاء|التربية الوطنية/.test(subject)), 'Subject filter must be limited to the requested core subjects');
  for (const subject of ['التاريخ', 'الجغرافيا']) {
    await page.locator('#pastExamSubject').selectOption(subject);
    assert.ok(await page.locator('#pastExamResults .past-exam-card').count() >= 1, 'Literary core subject must have a verified resource: ' + subject);
  }
  await page.locator('#pastExamSubject').selectOption('all');
  for (const subject of ['اللغة العربية', 'اللغة الأجنبية الأولى', 'اللغة الأجنبية الثانية', 'الكيمياء', 'الفيزياء', 'الأحياء', 'الرياضيات']) {
    await page.locator('#pastExamYear').selectOption('2023');
    await page.locator('#pastExamSubject').selectOption(subject);
    assert.ok(await page.locator('#pastExamResults .past-exam-card').count() >= 1, '2023 core subject must have a catalogued Ministry resource: ' + subject);
  }
  await page.locator('#pastExamSubject').selectOption('all');
  await page.locator('#pastExamYear').selectOption('all');
  assert.equal(await page.locator('#pastExamArchiveRoot a[href="https://moe.gov.eg/"]').count(), 1);

  // Chemistry 2023 interactive answer sheet: all four Ministry keys and weighted objective grading.
  await page.locator('#pastExamChemistryStart').click();
  assert.equal(await page.locator('#pastExamChemistryQuiz [data-chem-answer]').count(), 44, 'Chemistry answer sheet must render 44 objective questions');
  assert.equal(await page.locator('#pastExamChemistryQuiz .past-exam-answer-cell').filter({ hasText: 'سؤال 33' }).count(), 1, 'Chemistry questions 33–44 must be marked as two-point questions');
  await page.locator('#pastExamChemistryQuiz [data-chem-answer="0"]').selectOption('أ');
  await page.locator('#pastExamChemistrySubmit').click();
  assert.ok((await page.locator('#pastExamChemistryQuiz .past-exam-quiz-result').innerText()).includes('من 56'), 'Chemistry result must use the official 56-point objective subtotal');
  assert.ok((await page.locator('#pastExamChemistryQuiz .past-exam-quiz-result').innerText()).includes('60 درجة'), 'Chemistry result must disclose that two essay questions are excluded from the automated score');


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

  // Physics 2023 interactive answer sheet: official Arabic keys, compound-answer options, and weighted grading.
  await page.locator('[data-tab="pastExamArchive"]').click();
  await page.locator('#pastExamPhysicsStart').click();
  assert.equal(await page.locator('#pastExamPhysicsQuiz [data-physics-answer]').count(), 44, 'Physics answer sheet must render 44 objective questions');
  assert.equal(await page.locator('#pastExamPhysicsQuiz .past-exam-answer-cell').filter({ hasText: 'سؤال 33' }).count(), 1, 'Physics questions 33–44 must be marked as two-point questions');
  await page.locator('#pastExamPhysicsQuiz [data-physics-answer="0"]').selectOption('د');
  await page.locator('#pastExamPhysicsQuiz [data-physics-answer="22"]').selectOption('جميع الإجابات صحيحة');
  await page.locator('#pastExamPhysicsQuiz [data-physics-answer="23"]').selectOption('ج');
  await page.locator('#pastExamPhysicsSubmit').click();
  assert.ok((await page.locator('#pastExamPhysicsQuiz .past-exam-quiz-result').innerText()).includes('إجابات صحيحة: 3'), 'Physics grading must accept either letter in a combined Ministry answer');
  assert.match(await page.locator('#pastExamPhysicsQuiz .past-exam-key-review .past-exam-key-grid span').nth(23).evaluate(node => node.textContent), /س24:.*ب.*ج/, 'Physics review must show both alternatives for the combined Ministry answer');
  assert.equal(await page.locator('#pastExamPhysicsQuiz .past-exam-key-review .is-correct').count(), 3, 'Accepted alternative answers must also be marked correct in the answer review');
  assert.ok((await page.locator('#pastExamPhysicsQuiz .past-exam-quiz-result').innerText()).includes('من 56'), 'Physics result must use the official 56-point objective subtotal');
  assert.ok((await page.locator('#pastExamPhysicsQuiz .past-exam-quiz-result').innerText()).includes('60 درجة'), 'Physics result must disclose that two essay questions are excluded from the automated score');
  // Biology 2023 interactive answer sheet: official Arabic keys and weighted grading.
  await page.locator('#pastExamBiologyStart').click();
  assert.equal(await page.locator('#pastExamBiologyQuiz [data-biology-answer]').count(), 44, 'Biology answer sheet must render 44 objective questions');
  assert.equal(await page.locator('#pastExamBiologyQuiz .past-exam-answer-cell').filter({ hasText: 'سؤال 33' }).count(), 1, 'Biology questions 33–44 must be marked as two-point questions');
  await page.locator('#pastExamBiologyQuiz [data-biology-answer="0"]').selectOption('أ');
  await page.locator('#pastExamBiologyQuiz [data-biology-answer="32"]').selectOption('ج');
  await page.locator('#pastExamBiologySubmit').click();
  assert.ok((await page.locator('#pastExamBiologyQuiz .past-exam-quiz-result').innerText()).includes('درجتك: 3 من 56'), 'Biology quiz must apply the official one-point and two-point weights');
  assert.ok((await page.locator('#pastExamBiologyQuiz .past-exam-quiz-result').innerText()).includes('60 درجة'), 'Biology result must disclose the official 60-point total and excluded essay questions');
  assert.equal(await page.locator('#pastExamBiologyQuiz .past-exam-key-review .is-correct').count(), 2, 'Biology answer review must mark correct answers');
  // 2023 Mathematics: all four Arabic branches, four models, and weighted objective grading.
  await page.locator('#pastExamMathStart').click();
  assert.equal(await page.locator('#pastExamMathQuiz [data-math-answer]').count(), 18, 'Math answer sheet must render 18 objective questions');
  assert.equal(await page.locator('#pastExamMathQuiz .past-exam-answer-cell').filter({ hasText: 'سؤال 11' }).count(), 1, 'Math questions 11–18 must be marked as two-point questions');
  await page.locator('#pastExamMathQuiz [data-math-answer="0"]').selectOption('ب');
  await page.locator('#pastExamMathQuiz [data-math-answer="10"]').selectOption('أ');
  await page.locator('#pastExamMathSubmit').click();
  assert.ok((await page.locator('#pastExamMathQuiz .past-exam-quiz-result').innerText()).includes('درجتك: 3 من 26'), 'Math quiz must apply the official one-point and two-point weights');
  assert.ok((await page.locator('#pastExamMathQuiz .past-exam-quiz-result').innerText()).includes('السؤالين المقاليين (19 و20)'), 'Math result must disclose excluded essay questions');
  assert.equal(await page.locator('#pastExamMathQuiz .past-exam-key-review .is-correct').count(), 2, 'Math answer review must mark correct answers');
  await page.locator('#pastExamMathRetry').click();
  await page.locator('#pastExamMathBranch').selectOption('dynamics');
  await page.locator('#pastExamMathModel').selectOption('د');
  await page.locator('#pastExamMathStart').click();
  assert.equal(await page.locator('#pastExamMathQuiz [data-math-answer]').count(), 18, 'Math selector must switch branches and models');
  await page.locator('[data-tab="notes"]').click();
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

  // English conversation helper should show the expected AI fallback when the Worker reports a missing secret.
  await page.route('**/api/chat', route => route.fulfill({
    status: 503,
    contentType: 'application/json',
    body: JSON.stringify({ error: { code: 'missing_server_secret' } })
  }));
  await page.locator('[data-tab="chat"]').click();
  await page.locator('#cIn').fill('Hello, how are you?');
  await page.locator('#cSend').click();
  await page.locator('#cSt').getByText('لم تتم إضافة مفتاح Gemini إلى أسرار Cloudflare بعد.').waitFor({ state: 'visible' });

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
  await page.locator('#qSt').getByText('لم تتم إضافة مفتاح Gemini إلى أسرار Cloudflare بعد.').waitFor({ state: 'visible' });
  await page.locator('#plBtn').click();
  await page.locator('#plSt').getByText('لم تتم إضافة مفتاح Gemini إلى أسرار Cloudflare بعد.').waitFor({ state: 'visible' });

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

  // AI-dependent tools should display the Worker's missing-secret error clearly.
  await page.locator('#aT').fill('A short lesson about photosynthesis.');
  await page.locator('#aQ').fill('Explain photosynthesis.');
  await page.locator('#aGo').click();
  await page.locator('#aSt').getByText('لم تتم إضافة مفتاح Gemini إلى أسرار Cloudflare بعد.').waitFor({ state: 'visible' });

  // Invalid backup files must be rejected without replacing the current study data.
  await page.locator('#bkIn').setInputFiles({
    name: 'invalid-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ notes: 'not-an-array', injectedField: true }))
  });
  await page.locator('#bkSt').getByText('مش نسخة صالحة').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#mList').getByText('خطأ ثانٍ لاختبار استعادة النسخة الاحتياطية').count(), 1);

  // Versioned backup export must include all current data groups and metadata.
  const [backupDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.locator('#bkGo').click()
  ]);
  assert.equal(backupDownload.suggestedFilename(), 'ahmed-study-backup.json');
  const backupStream = await backupDownload.createReadStream();
  const backupChunks = [];
  for await (const chunk of backupStream) backupChunks.push(chunk);
  const exportedBackup = JSON.parse(Buffer.concat(backupChunks).toString('utf8'));
  assert.equal(exportedBackup.format, 'ahmed-study-platform-backup');
  assert.equal(exportedBackup.version, 2);
  assert.ok(Array.isArray(exportedBackup.data.ev));
  assert.ok(exportedBackup.data.mist.some(item => item.q === 'خطأ ثانٍ لاختبار استعادة النسخة الاحتياطية'));
  assert.ok('subjectLessonDone' in exportedBackup.data && 'examHistory' in exportedBackup.data && 'smartReview' in exportedBackup.data);
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1-weekly-backups') || '[]').length), 1, 'A weekly local snapshot must be created on app startup');

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
  await page.locator('#bkSt').getByText('جاهزة للمعاينة').waitFor({ state: 'visible' });
  await page.locator('#bkRestore').click();
  await page.locator('#bkSt').getByText('اترجعت بياناتك بنجاح').waitFor({ state: 'visible' });
  assert.equal(await page.locator('#bkUndo').isVisible(), true, 'Undo must be available after a successful restore');
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
  await page.locator('[data-tab="pastExamArchive"]').click();

  // 2023 Literary History and Geography: four models each, 44 objective questions, weighted to 56 marks.
  assert.equal(await page.locator('#pastExamArtsModel option').count(), 4, 'History and Geography quiz must offer all four official models');
  await page.locator('#pastExamArtsStart').click();
  assert.equal(await page.locator('#pastExamArtsQuiz [data-arts-answer]').count(), 44, 'History answer sheet must render 44 objective questions');
  await page.locator('#pastExamArtsQuiz [data-arts-answer="0"]').selectOption('أ');
  await page.locator('#pastExamArtsQuiz [data-arts-answer="32"]').selectOption('ج');
  await page.locator('#pastExamArtsSubmit').click();
  assert.ok((await page.locator('#pastExamArtsQuiz .past-exam-quiz-result').innerText()).includes('درجتك: 3 من 56'), 'History model A must apply one-point and two-point scoring');
  assert.ok((await page.locator('#pastExamArtsQuiz .past-exam-quiz-result').innerText()).includes('السؤالين المقاليين (45 و46)'), 'Arts result must explicitly exclude essay questions 45 and 46');
  assert.equal(await page.locator('#pastExamArtsQuiz .past-exam-key-review .is-correct').count(), 2, 'History answer review must mark correct objective answers');
  await page.locator('#pastExamArtsRetry').click();
  await page.locator('#pastExamArtsSubject').selectOption('geography');
  await page.locator('#pastExamArtsModel').selectOption('د');
  await page.locator('#pastExamArtsStart').click();
  assert.equal(await page.locator('#pastExamArtsQuiz [data-arts-answer]').count(), 44, 'Geography answer sheet must render 44 objective questions');
  await page.locator('#pastExamArtsQuiz [data-arts-answer="0"]').selectOption('أ');
  await page.locator('#pastExamArtsQuiz [data-arts-answer="32"]').selectOption('أ');
  await page.locator('#pastExamArtsSubmit').click();
  assert.ok((await page.locator('#pastExamArtsQuiz .past-exam-quiz-result').innerText()).includes('درجتك: 3 من 56'), 'Geography model D must apply weighted objective scoring');
  assert.ok((await page.locator('#pastExamArtsQuiz .past-exam-key-review summary').innerText()).includes('الجغرافيا، النموذج د'), 'Geography answer review must identify the selected subject and model');
  await page.locator('#pastExamArtsRetry').click();

  // 2023 English first and second foreign languages, all four models.
  await page.locator('#pastExamEnglishStart').click();
  assert.equal(await page.locator('#pastExamEnglishQuiz .past-exam-answer-cell').count(), 34, 'First English language must display 34 objective-key rows');
  assert.equal(await page.locator('#pastExamEnglishQuiz [data-english-answer]').count(), 33, 'First English multi-answer item must be excluded from automatic grading');
  await page.locator('#pastExamEnglishQuiz [data-english-answer="0"]').selectOption('B');
  await page.locator('#pastExamEnglishQuiz [data-english-answer="26"]').selectOption('A');
  await page.locator('#pastExamEnglishSubmit').click();
  assert.ok((await page.locator('#pastExamEnglishQuiz .past-exam-quiz-result').innerText()).includes('درجتك: 3 من 40'), 'First English language must use weighted objective scoring and exclude the multi-answer item');
  assert.ok((await page.locator('#pastExamEnglishQuiz .past-exam-quiz-result').innerText()).includes('الأسئلة المقالية من 35 إلى 37'), 'First English result must identify its essay range');
  assert.equal(await page.locator('#pastExamEnglishQuiz .past-exam-key-review .is-correct').count(), 2, 'First English review must mark correct answers');
  await page.locator('#pastExamEnglishRetry').click();
  await page.locator('#pastExamEnglishSubject').selectOption('second');
  await page.locator('#pastExamEnglishModel').selectOption('D');
  await page.locator('#pastExamEnglishStart').click();
  assert.equal(await page.locator('#pastExamEnglishQuiz [data-english-answer]').count(), 29, 'Second English language must render 29 objective questions');
  await page.locator('#pastExamEnglishQuiz [data-english-answer="0"]').selectOption('C');
  await page.locator('#pastExamEnglishQuiz [data-english-answer="24"]').selectOption('C');
  await page.locator('#pastExamEnglishSubmit').click();
  assert.ok((await page.locator('#pastExamEnglishQuiz .past-exam-quiz-result').innerText()).includes('درجتك: 3 من 34'), 'Second English language must apply 24 one-point and five two-point objective scoring');
  assert.ok((await page.locator('#pastExamEnglishQuiz .past-exam-quiz-result').innerText()).includes('الأسئلة المقالية من 30 إلى 31'), 'Second English result must identify its essay range');
  await page.locator('[data-tab="notes"]').click();
  await page.locator('#noteList').getByText('ملاحظة مستعادة').waitFor({ state: 'visible' });

  // Undo must restore the pre-import state, then re-apply the fixture for later checks.
  await page.locator('[data-tab="tools"]').click();
  await page.locator('#bkUndo').click();
  await page.locator('#bkSt').getByText('تم التراجع عن آخر استعادة').waitFor({ state: 'visible' });
  await page.locator('#bkIn').setInputFiles({
    name: 'valid-backup-again.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(validBackup))
  });
  await page.locator('#bkRestore').click();
  await page.locator('#bkSt').getByText('اترجعت بياناتك بنجاح').waitFor({ state: 'visible' });

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

  // Smart revision collects vocabulary, active mistakes, and completed lessons, then schedules ratings.
  const revisionSeed = await page.evaluate(() => {
    const state = JSON.parse(localStorage.getItem('study-v1') || '{}');
    Object.assign(state, {
      ev: [], notes: [],
      words: [{id:'word-revision-smoke',e:'resilient',a:'مرن',box:0}],
      track: 'sci', prac: [], goal: 100,
      mist: [{id:'mistake-revision-smoke',s:'الأحياء',q:'ما وظيفة الميتوكوندريا؟',r:'معلومة ناسيها',box:0,due:new Date().toLocaleDateString('en-CA')}],
      subjectLessonDone: {biology2027:{'0-0':true}},
      englishPathDone: {0:true},
      smartReview: {}
    });
    localStorage.setItem('study-v1', JSON.stringify(state));
    return true;
  });
  assert.equal(revisionSeed, true);
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('[data-tab="reviewCenter"]').click();
  await page.locator('#smartReviewRoot .revision-stats').waitFor({state:'visible'});
  assert.equal(await page.locator('#smartReviewRoot .revision-preview-item').count(), 4, 'Revision queue must include a word, a mistake, a subject lesson, and an English lesson');
  await page.locator('#smartReviewRoot [data-review-start]').click();
  await page.locator('#smartReviewRoot [data-review-reveal]').click();
  await page.locator('#smartReviewRoot [data-review-rate="good"]').click();
  const savedReview = await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')).smartReview);
  assert.equal(Object.keys(savedReview).length, 1, 'A revision rating must be saved in study-v1');
  assert.equal(Object.values(savedReview)[0].lastRating, 'good', 'The selected review rating must persist');
  assert.ok(Object.values(savedReview)[0].due > new Date().toLocaleDateString('en-CA'), 'A successful recall must schedule the next review in the future');
  await page.locator('#smartReviewRoot [data-review-exit]').click();
  await page.locator('[data-tab="home"]').click();
  await page.locator('#home').waitFor({state:'visible'});

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

  // Exercise the service worker in an isolated browser context with seeded cache entries.
  console.log('CHECKPOINT: starting isolated service-worker tests');
  const swContext = await browser.newContext({ serviceWorkers: 'allow' });
  const swPage = await swContext.newPage();
  try {
    await swPage.addInitScript(() => {
      if (!('serviceWorker' in navigator)) return;
      const seedCaches = Promise.all([
        caches.open('ahmed-study-platform-v25'),
        caches.open('unrelated-cache-preserve')
      ]);
      const nativeRegister = navigator.serviceWorker.register.bind(navigator.serviceWorker);
      Object.defineProperty(navigator.serviceWorker, 'register', {
        configurable: true,
        value: async (...args) => {
          await seedCaches;
          return nativeRegister(...args);
        }
      });
    });
    await swPage.goto('http://localhost:4173/', { waitUntil: 'load' });
    console.log('CHECKPOINT: isolated page loaded; waiting for service-worker activation');
    const lifecycle = await swPage.evaluate(async () => {
      const withTimeout = (promise, label, milliseconds = 15000) => {
        let timer;
        return Promise.race([
          promise,
          new Promise((_, reject) => {
            timer = setTimeout(() => reject(new Error(`Timed out after ${milliseconds}ms: ${label}`)), milliseconds);
          })
        ]).finally(() => clearTimeout(timer));
      };
      const registration = await withTimeout(navigator.serviceWorker.ready, 'navigator.serviceWorker.ready');
      const cacheKeys = await caches.keys();
      return {
        activeState: registration.active?.state,
        currentCachePresent: cacheKeys.includes('ahmed-study-platform-v26'),
        oldAppCachePresent: cacheKeys.includes('ahmed-study-platform-v25'),
        unrelatedCachePresent: cacheKeys.includes('unrelated-cache-preserve')
      };
    });
    assert.equal(lifecycle.activeState, 'activated', 'Service worker must activate');
    assert.equal(lifecycle.currentCachePresent, true, 'Current app-shell cache must be created');
    assert.equal(lifecycle.oldAppCachePresent, false, 'Activation must delete the previous app cache');
    assert.equal(lifecycle.unrelatedCachePresent, true, 'Activation must preserve unrelated caches');
    console.log('CHECKPOINT: service worker activated and cache lifecycle assertions passed');

    await swPage.reload({ waitUntil: 'load' });
    await swPage.evaluate(async () => {
      if (navigator.serviceWorker.controller) return;
      await new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('Timed out after 15000ms waiting for service-worker controllerchange')), 15000);
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          clearTimeout(timer);
          resolve();
        }, { once: true });
      });
    });
    console.log('CHECKPOINT: page is controlled by the service worker');

    const apiCacheCheck = await swPage.evaluate(async () => {
      const response = await fetch('/api/sw-cache-probe');
      const cache = await caches.open('ahmed-study-platform-v26');
      const cachedResponse = await cache.match(new Request(new URL('/api/sw-cache-probe', location.origin)));
      return { status: response.status, cached: Boolean(cachedResponse) };
    });
    assert.equal(apiCacheCheck.status, 404, 'Unconfigured API probe should reach the local server');
    assert.equal(apiCacheCheck.cached, false, 'API responses must never enter the app-shell cache');
    console.log('CHECKPOINT: API cache exclusion assertions passed');

    await swContext.setOffline(true);
    const offlineChecks = await swPage.evaluate(async () => {
      let staticAsset;
      try {
        const response = await fetch('/assets/css/app.css');
        staticAsset = { ok: response.ok, status: response.status };
      } catch (error) {
        staticAsset = { ok: false, error: error.message };
      }
      let apiRequest;
      try {
        const response = await fetch('/api/sw-cache-probe');
        apiRequest = { resolved: true, status: response.status };
      } catch {
        apiRequest = { resolved: false };
      }
      return { staticAsset, apiRequest };
    });
    assert.equal(offlineChecks.staticAsset.ok, true, 'A precached static asset must remain available offline');
    assert.equal(offlineChecks.apiRequest.resolved, false, 'API requests must not be served from the app-shell cache offline');
    console.log('CHECKPOINT: offline static-asset and API assertions passed');
    await swContext.setOffline(false);
  } finally {
    await swContext.close();
  }

  assert.deepEqual(pageErrors, [], `Uncaught browser errors: ${pageErrors.join('; ')}`);
  console.log('PASS: homepage, navigation, smart revision queue and scheduling, schedule creation, local notes, theme persistence, local data preservation, mistake review, AI fallback, backup validation, mobile overflow at 390px and 320px, service-worker cache cleanup, API cache exclusion, offline static assets, and browser console.');
} finally {
  await browser.close();
}
