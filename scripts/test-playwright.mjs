import { chromium } from 'playwright';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto('http://127.0.0.1:5173');
  await page.waitForLoadState('networkidle');
  const title = await page.title();
  const rootPx = await page.evaluate(() => {
    return {
      fontSize: window.getComputedStyle(document.documentElement).fontSize,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    };
  });
  console.log('Page title:', title);
  console.log('Root measurements at 1280x800:', rootPx);
  await browser.close();
}

run().catch(console.error);
