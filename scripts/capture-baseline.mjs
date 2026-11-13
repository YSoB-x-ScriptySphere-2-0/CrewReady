import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve('screenshots', 'before');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '320x568', width: 320, height: 568 },
  { name: '360x800', width: 360, height: 800 },
  { name: '375x812', width: 375, height: 812 },
  { name: '390x844', width: 390, height: 844 },
  { name: '430x932', width: 430, height: 932 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1366x768', width: 1366, height: 768 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1600x900', width: 1600, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
];

const SCREENS = [
  'welcome',
  'home',
  'map',
  'level',
  'play',
  'replay',
  'success',
  'sources',
  'fly',
  'resources',
  'profile',
  'training',
  'tour',
  'kit',
];

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Starting baseline capture across representative viewports and screens...');
  const auditReport = [];

  for (const vp of [
    { name: '360x800', width: 360, height: 800 },
    { name: '768x1024', width: 768, height: 1024 },
    { name: '1280x800', width: 1280, height: 800 },
    { name: '1920x1080', width: 1920, height: 1080 },
  ]) {
    await page.setViewportSize({ width: vp.width, height: vp.height });

    for (const screen of ['welcome', 'home', 'play', 'map', 'profile', 'resources']) {
      await page.goto('http://127.0.0.1:5173');
      await page.waitForLoadState('networkidle');

      // Navigate to screen
      await page.evaluate((s) => {
        if (s === 'welcome') return;
        if (window.__dismissWelcome) window.__dismissWelcome();
        if (s === 'tour') {
          if (window.__showTour) window.__showTour(true);
          return;
        }
        if (s === 'kit') {
          window.location.hash = '#kit';
          return;
        }
        if (window.__game) {
          if (s === 'replay') {
            window.__game.setState({
              screen: 'replay',
              lost: {
                meter: 'L',
                reasons: ['Air pressure lost'],
                blame: { label: 'Air tank breached', delta: { L: -30 }, living: false },
              },
            });
          } else {
            window.__game.getState().go(s);
          }
        }
      }, screen);

      await page.waitForTimeout(300);

      // Audit measurements
      const metrics = await page.evaluate(() => {
        const rootFs = window.getComputedStyle(document.documentElement).fontSize;
        const scrollW = document.documentElement.scrollWidth;
        const clientW = document.documentElement.clientWidth;
        return { rootFs, scrollW, clientW, overflow: scrollW > clientW + 2 };
      });

      const shotPath = path.join(SCREENSHOT_DIR, `${screen}_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`[${vp.name}] ${screen}: root font = ${metrics.rootFs}, overflow = ${metrics.overflow}`);
      auditReport.push({ viewport: vp.name, screen, ...metrics });
    }
  }

  // Also capture zoom comparison: 50% vs 100% vs 150% on 1280x800
  console.log('\nCapturing zoom variations for Home screen on 1280x800...');
  for (const zoom of [0.5, 1.0, 1.5, 2.0]) {
    const effectiveW = Math.round(1280 / zoom);
    const effectiveH = Math.round(800 / zoom);
    await page.setViewportSize({ width: effectiveW, height: effectiveH });
    await page.goto('http://127.0.0.1:5173');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => {
      if (window.__dismissWelcome) window.__dismissWelcome();
      if (window.__game) window.__game.getState().go('home');
    });
    await page.waitForTimeout(300);

    const metrics = await page.evaluate(() => {
      const rootFs = window.getComputedStyle(document.documentElement).fontSize;
      const scrollW = document.documentElement.scrollWidth;
      const clientW = document.documentElement.clientWidth;
      return { rootFs, scrollW, clientW, overflow: scrollW > clientW + 2 };
    });

    const shotPath = path.join(SCREENSHOT_DIR, `home_zoom_${Math.round(zoom * 100)}pct.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Zoom ${Math.round(zoom * 100)}% (effective ${effectiveW}x${effectiveH}): root font = ${metrics.rootFs}, overflow = ${metrics.overflow}`);
  }

  fs.writeFileSync(path.join(SCREENSHOT_DIR, 'audit-summary.json'), JSON.stringify(auditReport, null, 2));
  console.log('Saved baseline audit summary and screenshots.');
  await browser.close();
}

capture().catch(console.error);
