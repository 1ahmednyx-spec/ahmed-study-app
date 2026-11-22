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
  assert.equal(cssResponse.status(), 200, 'External stylesheet must be served');
  assert.equal(jsResponse.status(), 200, 'External application script must be served');
  assert.equal(storageResponse.status(), 200, 'Storage module must be served');
  assert.equal(navigationResponse.status(), 200, 'Navigation module must be served');
  assert.equal(scheduleResponse.status(), 200, 'Schedule module must be served');
  assert.equal(notesResponse.status(), 200, 'Notes module must be served');
  const scriptOrder = await page.locator('script[src]').evaluateAll(nodes => nodes.map(node => node.getAttribute('src')));
  assert.ok(scriptOrder.indexOf('./assets/js/core/storage.js') < scriptOrder.indexOf('./assets/js/core/navigation.js'), 'Storage must load before navigation');
  assert.ok(scriptOrder.indexOf('./assets/js/core/navigation.js') < scriptOrder.indexOf('./assets/js/features/schedule.js'), 'Navigation must load before feature modules');
  assert.ok(scriptOrder.indexOf('./assets/js/features/schedule.js') < scriptOrder.indexOf('./assets/js/features/notes.js'), 'Schedule must load before notes feature');
  assert.ok(scriptOrder.indexOf('./assets/js/features/notes.js') < scriptOrder.indexOf('./assets/js/app.js'), 'Notes must load before app bootstrap');
  assert.equal(await page.evaluate(() => typeof window.StudyNotes?.init), 'function', 'Notes module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.StudySchedule?.init), 'function', 'Schedule module must expose its initializer');
  assert.equal(await page.evaluate(() => typeof window.activateTab), 'function', 'Navigation module must expose tab activation');
  assert.match(await page.title(), /Ahmed Study Platform/);
  await page.locator('#home').waitFor({ state: 'visible' });
  assert.equal(await page.locator('.tabs [role="tab"]').count(), 8);

  // Every navigation tab must activate its matching content section.
  for (const tab of await page.locator('.tabs [role="tab"]').all()) {
    const target = await tab.getAttribute('data-tab');
    await tab.click();
    await page.locator('#' + target).waitFor({ state: 'visible' });
    assert.equal(await page.locator('.tabs [aria-selected="true"]').getAttribute('data-tab'), target);
  }

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

  // A newly recorded mistake must remain visible even when its spaced-review date is in the future.
  await page.locator('[data-tab="tools"]').click();
  await page.locator('#mQ').fill('سؤال يحتاج مراجعة لاحقًا');
  await page.locator('#mForm button[type="submit"]').click();
  await page.locator('#mList').getByText('سؤال يحتاج مراجعة لاحقًا').waitFor({ state: 'visible' });

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
  assert.equal(await page.locator('#mList').getByText('سؤال يحتاج مراجعة لاحقًا').count(), 1);

  // Theme selection must persist across reloads.
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload({ waitUntil: 'domcontentloaded' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');

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
