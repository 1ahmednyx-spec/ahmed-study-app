import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));

try {
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
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

  // Theme selection must persist across reloads.
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
  await page.locator('#themeToggle').click();
  assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');

  // Existing local data key and arbitrary saved fields must survive startup.
  await page.evaluate(() => localStorage.setItem('study-v1', JSON.stringify({
    ev: [], notes: [], words: [], track: 'sci', prac: [], goal: 100, mist: [], focus: {}, smokeTestMarker: 'preserved'
  })));
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('study-v1')).smokeTestMarker), 'preserved');

  // Mobile layout must fit the viewport without page-level horizontal overflow.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('#home').waitFor({ state: 'visible' });
  const mobile = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    nav: getComputedStyle(document.querySelector('.tabs')).overflowX
  }));
  assert.ok(mobile.document <= mobile.viewport + 1, `Mobile page overflow: ${JSON.stringify(mobile)}`);
  assert.ok(['auto', 'scroll'].includes(mobile.nav), `Mobile navigation should scroll horizontally: ${mobile.nav}`);

  assert.deepEqual(pageErrors, [], `Uncaught browser errors: ${pageErrors.join('; ')}`);
  console.log('PASS: homepage, all navigation tabs, quick links, theme persistence, local data preservation, mobile overflow, and browser console.');
} finally {
  await browser.close();
}
