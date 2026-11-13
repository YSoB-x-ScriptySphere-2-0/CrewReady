import { chromium } from 'playwright';

async function testCdp() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:5173');
  const cdp = await page.context().newCDPSession(page);

  // Test setDeviceMetricsOverride with deviceScaleFactor
  try {
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 2, // 200% DPR
      mobile: false,
    });
    const metrics = await page.evaluate(() => ({
      dpr: window.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    }));
    console.log('deviceScaleFactor 2:', metrics);
  } catch (e) {
    console.log('Error setDeviceMetricsOverride:', e.message);
  }

  // Also test keyboard shortcut Control++ / Control+-
  try {
    await page.keyboard.press('Control+=');
    const zoomMetrics = await page.evaluate(() => ({
      dpr: window.devicePixelRatio,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    }));
    console.log('After Control+=:', zoomMetrics);
  } catch (e) {
    console.log('Error zoom key:', e.message);
  }

  await browser.close();
}

testCdp().catch(console.error);
