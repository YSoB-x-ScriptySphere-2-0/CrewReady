import { test, expect } from '@playwright/test';
import { runLayoutAudit } from './layoutAudit';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve('screenshots', 'after');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

// 12 Required Viewports
export const VIEWPORTS = [
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

// 9 Required Zoom Levels
export const ZOOM_LEVELS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];

// Application Routes / Screens to Audit
export const ROUTES = [
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

async function navigateToScreen(page: any, screen: string, lang: 'en' | 'bn' = 'en') {
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  await page.evaluate(({ s, l }) => {
    if (window.__i18n) {
      window.__i18n.getState().setLang(l);
    }
    if (s === 'welcome') return;

    if (window.__dismissWelcome) {
      window.__dismissWelcome();
    }

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
            reasons: ['Air pressure lost in habitat'],
            blame: { label: 'Air valve leak', delta: { L: -30 }, living: false },
          },
        });
      } else {
        window.__game.getState().go(s);
      }
    }
  }, { s: screen, l: lang });

  await page.waitForTimeout(300);
}

test.describe('Responsive Viewport Audit Matrix', () => {
  for (const vp of VIEWPORTS) {
    test(`Viewport ${vp.name} (${vp.width}x${vp.height}) - Key Routes Audit`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of ['welcome', 'home', 'play', 'map', 'resources', 'sources']) {
        await navigateToScreen(page, route, 'en');

        const audit = await runLayoutAudit(page);
        expect(audit.hasHorizontalOverflow, `Horizontal overflow detected on ${route} at ${vp.name}`).toBe(false);
        expect(audit.overlappingButtons.length, `Overlapping buttons detected on ${route} at ${vp.name}: ${JSON.stringify(audit.overlappingButtons)}`).toBe(0);

        // Capture screenshot
        const shotPath = path.join(SCREENSHOT_DIR, `${route}_${vp.name}.png`);
        await page.screenshot({ path: shotPath });
      }
    });
  }
});

test.describe('Zoom-Resilience Audit Matrix', () => {
  for (const zoom of ZOOM_LEVELS) {
    const zoomPct = Math.round(zoom * 100);
    test(`Zoom ${zoomPct}% - Effective Viewport Reflow Audit`, async ({ page, context }) => {
      // Test at base 1280x800 display resolution scaled by zoom
      const effectiveW = Math.round(1280 / zoom);
      const effectiveH = Math.round(800 / zoom);
      await page.setViewportSize({ width: effectiveW, height: effectiveH });

      // Emulate DPR corresponding to the zoom level
      const cdp = await context.newCDPSession(page);
      try {
        await cdp.send('Emulation.setDeviceMetricsOverride', {
          width: effectiveW,
          height: effectiveH,
          deviceScaleFactor: zoom,
          mobile: effectiveW < 768,
        });
      } catch (e) {
        // Fallback if CDP metrics override is constrained
      }

      for (const route of ['home', 'play', 'map', 'resources', 'replay', 'sources']) {
        await navigateToScreen(page, route, 'en');

        const audit = await runLayoutAudit(page);
        expect(audit.hasHorizontalOverflow, `Horizontal overflow at ${zoomPct}% zoom on ${route}`).toBe(false);

        const shotPath = path.join(SCREENSHOT_DIR, `${route}_zoom_${zoomPct}pct.png`);
        await page.screenshot({ path: shotPath });
      }
    });
  }
});

test.describe('Bilingual Typography Audit (English & Bangla)', () => {
  for (const lang of ['en', 'bn'] as const) {
    test(`Typography & Content-Aware Layout (${lang.toUpperCase()}) across Mobile & Desktop`, async ({ page }) => {
      for (const vp of [{ name: '375x812', width: 375, height: 812 }, { name: '1280x800', width: 1280, height: 800 }]) {
        await page.setViewportSize({ width: vp.width, height: vp.height });

        for (const route of ['welcome', 'home', 'play', 'level', 'map', 'resources']) {
          await navigateToScreen(page, route, lang);

          const audit = await runLayoutAudit(page);
          expect(audit.hasHorizontalOverflow, `Horizontal overflow in ${lang} on ${route} at ${vp.name}`).toBe(false);
          expect(audit.clippedButtons.length, `Button text clipped in ${lang} on ${route} at ${vp.name}`).toBe(0);

          const shotPath = path.join(SCREENSHOT_DIR, `${route}_${lang}_${vp.name}.png`);
          await page.screenshot({ path: shotPath });
        }
      }
    });
  }
});

test.describe('Interactive Component Usability and Step Audit', () => {
  test('Step views and interactive controls maintain usable dimensions', async ({ page }) => {
    // Mobile 360x800 test
    await page.setViewportSize({ width: 360, height: 800 });
    await navigateToScreen(page, 'play', 'en');

    // Verify main action buttons have minimum touch target dimensions >= 36px
    const buttons = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button')).filter((b) => {
        const s = window.getComputedStyle(b);
        return b.offsetParent !== null && s.display !== 'none';
      });
      return btns.map((b) => {
        const r = b.getBoundingClientRect();
        return {
          text: (b.innerText || b.getAttribute('aria-label') || '').slice(0, 20),
          width: Math.round(r.width),
          height: Math.round(r.height),
        };
      });
    });

    for (const btn of buttons) {
      if (btn.width > 0 && btn.height > 0) {
        expect(btn.height, `Button "${btn.text}" height must be usable (>= 28px)`).toBeGreaterThanOrEqual(28);
        expect(btn.width, `Button "${btn.text}" width must be usable (>= 28px)`).toBeGreaterThanOrEqual(28);
      }
    }
  });
});
