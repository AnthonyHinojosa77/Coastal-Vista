import { webkit, devices, expect } from '@playwright/test';
import fs from 'node:fs';
const url = process.env.QA_URL || 'http://127.0.0.1:5174';
const out = process.env.QA_OUTPUT || '/tmp/cv-mvp-qa';
fs.mkdirSync(out, { recursive: true });
const browser = await webkit.launch();
const report = { url, engine: 'WebKit', device: 'iPhone 13 emulation', checks: [] };
try {
 const page = await browser.newPage({ ...devices['iPhone 13'] });
 const errors = [];
 page.on('pageerror', e => errors.push(e.message));
 await page.goto(url, { waitUntil: 'networkidle' });
 await page.getByRole('link', { name: 'Work', exact: true }).click();
 await page.waitForTimeout(1600);
 await expect(page.locator('.portfolio-card')).toHaveCount(20);
 await page.screenshot({ path: `${out}/webkit-phone-gallery.png` });
 if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Phone horizontal overflow');
 await page.getByRole('button', { name: 'Photos', exact: true }).click();
 await expect(page.locator('.portfolio-card')).toHaveCount(14);
 await page.locator('.portfolio-card').first().click();
 await expect(page.locator('dialog')).toBeVisible();
 await page.waitForFunction(() => document.querySelector('.viewer-media img')?.naturalWidth > 0);
 await page.getByRole('button', { name: 'Next media' }).click();
 await expect(page.locator('#media-title')).toHaveText('Neighborhoods & the bay');
 await page.getByRole('button', { name: 'Close media' }).click();
 report.checks.push('Phone layout, photo filter and dialog navigation');
 await page.getByRole('button', { name: 'Videos', exact: true }).click();
 for(let i=0;i<6;i++) {
  await page.locator('.portfolio-card').nth(i).click();
  await page.locator('video').evaluate(async v => { v.muted = true; await v.play(); });
  await page.waitForFunction(() => document.querySelector('video')?.currentTime > .5);
  report.checks.push(`Video playback: ${await page.locator('#media-title').textContent()}`);
  if(i===0) await page.screenshot({ path: `${out}/webkit-phone-video.png` });
  await page.getByRole('button', { name: 'Close media' }).click();
 }
 await page.locator('.contact-emblem').scrollIntoViewIfNeeded();
 await page.waitForFunction(() => document.querySelector('.contact-emblem img')?.naturalWidth > 0);
 await page.screenshot({ path: `${out}/webkit-phone-footer.png` });
 if(errors.length) throw new Error(errors.join('\n'));
 report.status = 'pass'; console.log('PASS WebKit iPhone layout, photo viewer, all six video formats, emblem, no JS errors');
} catch(error) { report.status = 'fail';report.error = error.stack;console.error(error);process.exitCode=1; }
finally { fs.writeFileSync(`${out}/webkit-verification.json`,JSON.stringify(report,null,2)); await browser.close(); }
