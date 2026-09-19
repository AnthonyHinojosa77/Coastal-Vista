import { chromium, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const base = process.env.QA_URL || 'http://127.0.0.1:5174';
const gallery = new URL('gallery.html', base.endsWith('/') ? base : `${base}/`).href;
const out = process.env.QA_OUTPUT || '/tmp/cv-gallery-qa';
fs.mkdirSync(out, { recursive: true });
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({ headless: true, ...(fs.existsSync(chrome) ? { executablePath: chrome } : {}) });
const report = { url: base, at: new Date().toISOString(), checks: [], errors: [] };
const check = (name, detail) => { report.checks.push({ name, status: 'pass', detail }); console.log(`PASS ${name}`); };
try {
 const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
 const errors = [], requests = [];
 page.on('pageerror', e => errors.push(e.message));
 page.on('response', r => { if (r.status() >= 400 && !r.url().startsWith('https://formspree.io/')) errors.push(`${r.status()} ${r.url()}`); });
 page.on('request', r => requests.push(r.url()));
 await page.addInitScript(() => {
  window.__emblemOpacity = [];
  const started = performance.now();
  function sample() {
   const el = document.querySelector('.hero-emblem img');
   if (el) window.__emblemOpacity.push(+getComputedStyle(el).opacity);
   if (performance.now()-started < 4000) requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);
 });
 await page.goto(base, { waitUntil: 'networkidle' });
 await expect(page.locator('h1')).toHaveText('COASTALVISTA');
 await expect(page.locator('.portfolio-section, .contact-emblem')).toHaveCount(0);
 await page.waitForTimeout(1300);
 await page.locator('.hero-emblem img').evaluate(im => im.decode());
 const samples = await page.evaluate(() => window.__emblemOpacity);
 if (!(Math.min(...samples)<.7 && samples.at(-1)>.99)) throw new Error(`Initial emblem fade failed: ${samples}`);
 await page.screenshot({ path: path.join(out,'home-desktop.png') });
 await page.evaluate(() => scrollTo({ top: innerHeight * .9, behavior: 'instant' }));
 await page.waitForTimeout(900);
 const away = await page.locator('.hero-emblem').evaluate(el => +getComputedStyle(el).opacity);
 await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
 await page.waitForTimeout(900);
 const returned = await page.locator('.hero-emblem').evaluate(el => +getComputedStyle(el).opacity);
 if (!(away<.05 && returned>.99)) throw new Error(`Emblem scroll fade ${away},${returned}`);
 if (requests.some(u => u.includes('/portfolio/'))) throw new Error('Homepage loaded gallery media');
 check('Emblem fades in on arrival and return; no footer emblem or gallery on homepage', { away, returned });
 for (const id of ['work','realestate','commercial','city','after-dark']) {
  const start = await page.locator(`#${id}`).evaluate(el => el.parentElement.getBoundingClientRect().top + scrollY - document.querySelector('nav').offsetHeight);
  const opacities = [];
  for (const progress of [.03,.45,.97,.45]) {
   await page.evaluate(({start,progress})=>scrollTo({top:start+innerHeight*progress,behavior:'instant'}),{start,progress});
   await page.waitForTimeout(800);
   opacities.push(await page.locator(`#${id} .photo-copy`).evaluate(el=>+getComputedStyle(el).opacity));
  }
  if (!(opacities[0]<.4 && opacities[1]>.95 && opacities[2]<.4 && opacities[3]>.95)) throw new Error(`${id} fades ${opacities}`);
  check(`${id}: original scroll fades retained`,opacities);
 }
 await page.getByRole('link',{name:'Work',exact:true}).click();
 await expect(page).toHaveURL(gallery);
 await expect(page.locator('h1')).toHaveText('Photo & filmgallery.');
 await expect(page.locator('.photo-panel, .contact-section')).toHaveCount(0);
 const response = await page.reload({waitUntil:'networkidle'});
 if(response.status()!==200) throw new Error('Gallery direct reload failed');
 await expect(page.locator('.portfolio-card')).toHaveCount(20);
 await page.screenshot({path:path.join(out,'gallery-desktop.png')});
 check('Standalone gallery navigation and direct page reload');
 await page.getByRole('button',{name:'Photos',exact:true}).click();
 await expect(page.locator('.portfolio-card')).toHaveCount(14);
 for(let i=0;i<14;i++) {
  await page.locator('.portfolio-card').nth(i).click();
  await page.locator('.viewer-media img').evaluate(im=>im.decode());
  await expect(page.locator('dialog')).toBeVisible();
  if(i===0) {
   await page.screenshot({path:path.join(out,'photo-viewer.png')});
   await page.keyboard.press('Tab');
   if(!await page.evaluate(()=>!!document.activeElement.closest('dialog'))) throw new Error('Focus escaped dialog');
  }
  await page.keyboard.press('Escape');
 }
 check('All 14 photographs open; keyboard focus and Escape work');
 await page.getByRole('button',{name:'Videos',exact:true}).click();
 await expect(page.locator('.portfolio-card')).toHaveCount(6);
 const first = page.locator('[data-preview-id="V063"]');
 await first.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('[data-preview-id="V063"]').currentTime>.5);
 if(requests.some(u=>u.includes('/portfolio/videos/'))) throw new Error('Full films downloaded before opening viewer');
 const muted = await first.evaluate(v=>v.muted && v.playsInline && !v.loop);
 if(!muted) throw new Error('Preview mute/inline/no-loop failed');
 await page.locator('.portfolio-card').first().click();
 await expect(page.locator('dialog')).toBeVisible();
 if(!await first.evaluate(v=>v.paused)) throw new Error('Background preview continued under viewer');
 await page.locator('.viewer-media video').evaluate(async v=>{v.muted=true;await v.play()});
 await page.waitForFunction(()=>document.querySelector('.viewer-media video').currentTime>.5);
 await page.getByRole('button',{name:'Close media'}).click();
 await page.getByRole('button',{name:'Pause previews'}).click();
 if(!await page.locator('.portfolio-preview').evaluateAll(vs=>vs.every(v=>v.paused))) throw new Error('Pause previews failed');
 await page.getByRole('button',{name:'Enable previews'}).click();
 await first.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('[data-preview-id="V063"]').currentTime>.5);
 const pool = page.locator('[data-preview-id="V048"]');
 await pool.scrollIntoViewIfNeeded();
 await page.waitForFunction(()=>document.querySelector('[data-preview-id="V048"]').currentTime>.5);
 if(!await first.evaluate(v=>v.paused)) throw new Error('Off-screen preview kept playing');
 await page.waitForFunction(()=>document.querySelector('[data-preview-id="V048"]').ended,null,{timeout:15000});
 const duration = await pool.evaluate(v=>v.duration);
 if(Math.abs(duration-10)>.1) throw new Error(`Pool preview duration ${duration}`);
 await page.waitForTimeout(600);
 if(!await pool.evaluate(v=>v.paused && v.ended)) throw new Error('Preview looped after ten seconds');
 check('Muted previews start in view, pause offscreen/in viewer, respect toggle, and stop at 10 seconds');
 for(let i=0;i<6;i++) {
  await page.locator('.portfolio-card').nth(i).click();
  await page.locator('.viewer-media video').evaluate(async v=>{v.muted=true;await v.play()});
  await page.waitForFunction(()=>document.querySelector('.viewer-media video').currentTime>.3);
  await page.getByRole('button',{name:'Close media'}).click();
 }
 check('All six full films still play in the inspection viewer');
 await page.getByRole('link',{name:'Let’s talk',exact:false}).first().click();
 await expect(page).toHaveURL(new URL('#contact',base).href);
 await page.waitForTimeout(800);
 const contactY=await page.locator('#contact').evaluate(el=>el.getBoundingClientRect().top);
 if(Math.abs(contactY-76)>100) throw new Error(`Cross-page contact link position ${contactY}`);
 check('Gallery contact link returns to the correct homepage section');
 // Intercept both outcomes so regression checks never send customer inquiries.
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
 for(const [width,height] of [[1440,900],[768,900],[375,900],[1440,600]]) {
  await page.setViewportSize({width,height});
  await page.emulateMedia({reducedMotion:'reduce'});
  for(const [name,url] of [['home',base],['gallery',gallery]]) {
   await page.goto(url,{waitUntil:'networkidle'});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)) throw new Error(`Overflow ${name} ${width}`);
   if(name==='home') {
    await page.locator('.hero-emblem img').evaluate(im=>im.decode());
    const boxes=await page.evaluate(()=>({logo:document.querySelector('.hero-emblem').getBoundingClientRect().toJSON(),copy:document.querySelector('.photo-copy').getBoundingClientRect().toJSON()}));
    if(boxes.logo.bottom>boxes.copy.top) throw new Error(`Emblem overlaps text ${width}`);
   } else {
    await page.getByRole('button',{name:'Videos',exact:true}).click();
    await page.locator('.portfolio-preview').first().scrollIntoViewIfNeeded();
    if(!await page.locator('.portfolio-preview').evaluateAll(vs=>vs.every(v=>v.paused && !v.getAttribute('src')))) throw new Error('Reduced motion autoplays');
    await page.getByRole('button',{name:'All work',exact:true}).click();
    await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
   }
   await page.screenshot({path:path.join(out,`${name}-${width}-${height}.png`)});
   await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
   const audit=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
   if(audit.violations.length) throw new Error(`Accessibility ${name} ${width}: ${JSON.stringify(audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})))}`);
   if(name==='gallery') {
    await page.locator('.portfolio-card').first().click();
    await page.getByRole('button',{name:'Next media'}).click();
    await expect(page.locator('#media-title')).toHaveText('Neighborhoods & the bay');
    await page.getByRole('button',{name:'Close media'}).click();
   }
  }
  check(`${width}x${height}: both pages, accessibility, emblem spacing, reduced-motion preview opt-out`);
 }
 if(errors.length) throw new Error(errors.join('\n'));
 check('No JavaScript errors or failed resources');
 report.status='pass';
} catch(error) {report.status='fail';report.errors.push(error.stack);console.error(error);process.exitCode=1;}
finally {fs.writeFileSync(path.join(out,'site-verification.json'),JSON.stringify(report,null,2));await browser.close();}
