import { chromium } from 'playwright';

async function testZoom() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:5173');
  await page.waitForLoadState('networkidle');

  const before = await page.evaluate(() => ({
    dpr: window.devicePixelRatio,
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    fontSize: window.getComputedStyle(document.documentElement).fontSize,
  }));
  console.log('Baseline at 100%:', before);

  // Try CDP Page.setDocumentContent or Emulation.setPageScaleFactor
  const cdp = await context.newCDPSession(page);
  try {
    // In CDP, Page.enable and Emulation
    await cdp.send('Page.enable');
    // Emulation.setDeviceMetricsOverride can simulate device scale factor and viewport
  } catch (e) {
    console.log('CDP error:', e.message);
  }

  await browser.close();
}

testZoom().catch(console.error);
