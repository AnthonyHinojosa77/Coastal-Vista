import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = process.env.QA_URL || 'http://127.0.0.1:5174';
const out = process.env.QA_OUTPUT || '/tmp/cv-mvp-qa';
fs.mkdirSync(out, { recursive: true });
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, ...(fs.existsSync(chrome) ? { executablePath: chrome } : {}) });
const report = { url: base, at: new Date().toISOString(), checks: [], errors: [] };
const check = (name, detail) => { report.checks.push({ name, status: 'pass', detail }); console.log(`PASS ${name}`); };
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 const errors = [];
 const requests = [];
 page.on('pageerror', e => errors.push(e.message));
 page.on('response', r => { if (r.status() >= 400 && !r.url().startsWith('https://formspree.io/')) errors.push(`${r.status()} ${r.url()}`); });
 page.on('request', r => requests.push(r.url()));
 await page.goto(base, { waitUntil: 'networkidle' });
 await expect(page.locator('h1')).toHaveText('COASTALVISTA');
 await expect(page.locator('.photo-panel')).toHaveCount(6);
 await page.screenshot({ path: path.join(out, 'home-desktop.png') });
 if (requests.some(u => u.endsWith('.mp4'))) throw new Error('Video downloaded before being opened');
 check('Homepage and on-demand video loading');
 // Inspect actual text opacity at entrance, reading position, and departure.
 if (!process.env.QA_LAYOUT_ONLY) {
 for (const id of ['work','realestate','commercial','city','after-dark']) {
  const start = await page.locator(`#${id}`).evaluate(el => el.parentElement.getBoundingClientRect().top + scrollY - document.querySelector('nav').offsetHeight);
  const opacities = [];
  for (const progress of [.03, .45, .97, .45]) {
   await page.evaluate(({ start, progress }) => window.scrollTo({ top: start + innerHeight * progress, behavior: 'instant' }), { start, progress });
   await page.waitForTimeout(900);
   opacities.push(await page.locator(`#${id} .photo-copy`).evaluate(el => +getComputedStyle(el).opacity));
  }
  if (!(opacities[0] < .4 && opacities[1] > .95 && opacities[2] < .4 && opacities[3] > .95)) throw new Error(`${id} fade sequence ${opacities}`);
  check(`${id}: text fades in/out and returns on upward scroll`, opacities);
 }
 await page.getByRole('link', { name: 'Work', exact: true }).click();
 await page.waitForTimeout(1200);
 await expect(page.locator('.portfolio-card')).toHaveCount(20);
 await page.screenshot({ path: path.join(out, 'gallery-desktop.png') });
 await page.getByRole('button', { name: 'Photos', exact: true }).click();
 await expect(page.locator('.portfolio-card')).toHaveCount(14);
 for (let i = 0; i < 14; i++) {
  await page.locator('.portfolio-card').nth(i).click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.waitForFunction(() => { const im = document.querySelector('.viewer-media img'); return im?.complete && im.naturalWidth > 0; });
  if (i === 0) {
   await page.screenshot({ path: path.join(out, 'photo-viewer-desktop.png') });
   await page.keyboard.press('Tab');
   if (!await page.evaluate(() => document.activeElement.closest('dialog') !== null)) throw new Error('Dialog focus escaped');
  }
  await page.keyboard.press('Escape');
  await expect(page.locator('dialog')).toHaveCount(0);
 }
 check('All 14 photos load in full-size viewer; Escape and focus containment');
 await page.getByRole('button', { name: 'Videos', exact: true }).click();
 await expect(page.locator('.portfolio-card')).toHaveCount(6);
 const playback = [];
 for (let i = 0; i < 6; i++) {
  await page.locator('.portfolio-card').nth(i).click();
  const name = await page.locator('#media-title').textContent();
  await page.locator('video').evaluate(async v => { v.muted = true; await v.play(); });
  await page.waitForFunction(() => document.querySelector('video')?.currentTime > .4);
  if (i === 0) await page.screenshot({ path: path.join(out, 'video-viewer-desktop.png') });
  await page.waitForFunction(() => document.querySelector('video')?.ended, null, { timeout: 45000 });
  playback.push(await page.locator('video').evaluate(v => ({ duration: v.duration, ended: v.ended, frames: v.getVideoPlaybackQuality().totalVideoFrames, dropped: v.getVideoPlaybackQuality().droppedVideoFrames })));
  check(`Complete video playback: ${name}`, playback.at(-1));
  await page.getByRole('button', { name: 'Close media' }).click();
 }
 }
 await page.getByRole('button', { name: 'All work', exact: true }).click();
 await expect(page.locator('.portfolio-card')).toHaveCount(20);
 await page.locator('.contact-emblem').scrollIntoViewIfNeeded();
 await page.waitForTimeout(1000);
 await expect(page.locator('.contact-emblem img')).toBeVisible();
 await page.waitForFunction(() => document.querySelector('.contact-emblem img').naturalWidth > 0);
 await page.screenshot({ path: path.join(out, 'footer-desktop.png') });
 check('Emblem loads at bottom right');
 // Form validation and failure/recovery without sending fabricated customer inquiries.
 await page.locator('#contact-name').fill('Coastal Vista quality check');
 await page.locator('#contact-email').fill('qa@example.com');
 await page.locator('#contact-projectType').selectOption('other');
 await page.locator('#contact-timeline').selectOption('flexible');
 await page.locator('#contact-message').fill('Automated local form check.');
 await page.route('https://formspree.io/**', r => r.fulfill({ status: 503, contentType: 'application/json', body: '{}' }));
 await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click();
 await expect(page.getByRole('alert')).toContainText('Unable to send');
 await page.unroute('https://formspree.io/**');
 await page.route('https://formspree.io/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }));
 await page.getByRole('button', { name: 'Send Inquiry', exact: true }).click();
 await expect(page.getByRole('status').filter({ hasText: 'Message Sent!' })).toBeVisible();
 check('Contact form handles service errors and successful responses (simulated)');
 await page.unroute('https://formspree.io/**');
 // Accessibility and responsive behavior, with motion reduced to expose all content.
 for (const width of [1440, 768, 375]) {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('link', { name: 'Work', exact: true }).click();
  await page.waitForTimeout(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (overflow) throw new Error(`Horizontal overflow at ${width}px`);
  await page.screenshot({ path: path.join(out, `gallery-${width}.png`) });
  await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
  const audit = await page.evaluate(async () => window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21aa'] } }));
  if (audit.violations.length) throw new Error(`Accessibility ${width}: ${JSON.stringify(audit.violations.map(v => ({ id:v.id, nodes:v.nodes.map(n=>n.target) })))}`);
  await page.locator('.portfolio-card').first().click();
  await expect(page.locator('dialog')).toBeVisible();
  await page.screenshot({ path: path.join(out, `viewer-${width}.png`) });
  await page.getByRole('button', { name: 'Next media' }).click();
  await expect(page.locator('#media-title')).toHaveText('Neighborhoods & the bay');
  await page.getByRole('button', { name: 'Close media' }).click();
  await page.locator('.contact-emblem').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('.contact-emblem img')?.naturalWidth > 0);
  await page.screenshot({ path: path.join(out, `footer-${width}.png`) });
  const opacity = await page.locator('#work .photo-copy').evaluate(el => +getComputedStyle(el).opacity);
  if (opacity !== 1) throw new Error('Reduced motion hides text');
  check(`${width}px: layout, viewer navigation, reduced motion, WCAG automated audit`);
 }
 if (errors.length) throw new Error(`Browser errors: ${JSON.stringify(errors)}`);
 check('No uncaught JavaScript errors or failed HTTP resources');
 report.status = 'pass';
} catch (error) {
 report.status = 'fail'; report.errors.push(error.stack); console.error(error);
 process.exitCode = 1;
} finally {
 fs.writeFileSync(path.join(out,'site-verification.json'),JSON.stringify(report,null,2));
 await browser.close();
}
