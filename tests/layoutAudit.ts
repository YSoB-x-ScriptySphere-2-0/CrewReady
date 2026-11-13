import { Page, expect } from '@playwright/test';

export interface AuditResult {
  hasHorizontalOverflow: boolean;
  scrollWidth: number;
  clientWidth: number;
  overflowElements: Array<{ tag: string; className: string; text: string; right: number; innerWidth: number }>;
  textClippingElements: Array<{ tag: string; text: string; scrollWidth: number; clientWidth: number }>;
  clippedButtons: Array<{ text: string; scrollWidth: number; clientWidth: number }>;
  brokenImages: Array<{ src: string; alt: string }>;
  overlappingButtons: Array<{ buttonA: string; buttonB: string }>;
}

export async function runLayoutAudit(page: Page): Promise<AuditResult> {
  return await page.evaluate(() => {
    const docEl = document.documentElement;
    const body = document.body;
    const innerWidth = window.innerWidth;
    const innerHeight = window.innerHeight;

    // 1. Horizontal overflow check
    const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
    const clientWidth = Math.max(docEl.clientWidth, body.clientWidth);
    const hasHorizontalOverflow = scrollWidth > clientWidth + 2; // 2px tolerance for rounding

    // 2. Elements extending beyond viewport
    const overflowElements: Array<{ tag: string; className: string; text: string; right: number; innerWidth: number }> = [];
    const allElements = document.querySelectorAll('*');

    for (const el of allElements) {
      // Ignore scripts, styles, svgs internals, hidden elements
      if (['SCRIPT', 'STYLE', 'SVG', 'PATH', 'G', 'DEFS', 'HEAD', 'META', 'TITLE'].includes(el.tagName)) continue;
      const htmlEl = el as HTMLElement;
      if (htmlEl.offsetParent === null && htmlEl.tagName !== 'BODY') continue;

      const style = window.getComputedStyle(htmlEl);
      if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

      const rect = htmlEl.getBoundingClientRect();
      // Only check visible elements that are part of the normal document layout
      if (rect.width > 0 && rect.height > 0) {
        // If element is not an intentionally wide backdrop/star field
        const isBackdrop = htmlEl.classList.contains('pointer-events-none') || 
                           style.position === 'fixed' || 
                           htmlEl.getAttribute('aria-hidden') === 'true' ||
                           htmlEl.hasAttribute('data-scene');
        if (!isBackdrop && rect.right > innerWidth + 5) {
          overflowElements.push({
            tag: el.tagName,
            className: htmlEl.className?.toString().slice(0, 50) || '',
            text: (htmlEl.innerText || '').slice(0, 30),
            right: Math.round(rect.right),
            innerWidth,
          });
        }
      }
    }

    // 3. Buttons containing clipped text
    const clippedButtons: Array<{ text: string; scrollWidth: number; clientWidth: number }> = [];
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.offsetParent === null) continue;
      const style = window.getComputedStyle(btn);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      // Check if button text is horizontally clipped
      if (btn.scrollWidth > btn.clientWidth + 3) {
        clippedButtons.push({
          text: (btn.innerText || btn.getAttribute('aria-label') || '').slice(0, 40),
          scrollWidth: btn.scrollWidth,
          clientWidth: btn.clientWidth,
        });
      }
    }

    // 4. Broken images
    const brokenImages: Array<{ src: string; alt: string }> = [];
    const images = document.querySelectorAll('img');
    for (const img of images) {
      if (img.complete && img.naturalWidth === 0 && img.src && !img.src.startsWith('data:')) {
        brokenImages.push({
          src: img.src.slice(0, 60),
          alt: img.alt || '',
        });
      }
    }

    // 5. Overlapping visible interactive elements
    const overlappingButtons: Array<{ buttonA: string; buttonB: string }> = [];
    const visibleBtns = Array.from(buttons).filter((b) => {
      const s = window.getComputedStyle(b);
      return b.offsetParent !== null && s.display !== 'none' && s.visibility !== 'hidden';
    });

    for (let i = 0; i < visibleBtns.length; i++) {
      for (let j = i + 1; j < visibleBtns.length; j++) {
        const bA = visibleBtns[i];
        const bB = visibleBtns[j];
        if (bA.contains(bB) || bB.contains(bA)) continue;

        // Ignore buttons on different layer contexts (e.g. modal overlay vs background)
        const modalA = bA.closest('[role="dialog"], .fixed');
        const modalB = bB.closest('[role="dialog"], .fixed');
        if (modalA !== modalB) continue;

        const rA = bA.getBoundingClientRect();
        const rB = bB.getBoundingClientRect();
        // Check if both have positive size
        if (rA.width < 10 || rA.height < 10 || rB.width < 10 || rB.height < 10) continue;

        const overlapX = Math.max(0, Math.min(rA.right, rB.right) - Math.max(rA.left, rB.left));
        const overlapY = Math.max(0, Math.min(rA.bottom, rB.bottom) - Math.max(rA.top, rB.top));
        // If overlap area is significant (> 25% of smaller element)
        const overlapArea = overlapX * overlapY;
        const minArea = Math.min(rA.width * rA.height, rB.width * rB.height);
        if (overlapArea > 0.3 * minArea) {
          overlappingButtons.push({
            buttonA: (bA.innerText || bA.getAttribute('aria-label') || 'Button A').slice(0, 30),
            buttonB: (bB.innerText || bB.getAttribute('aria-label') || 'Button B').slice(0, 30),
          });
        }
      }
    }

    return {
      hasHorizontalOverflow,
      scrollWidth,
      clientWidth,
      overflowElements: overflowElements.slice(0, 10),
      textClippingElements: [],
      clippedButtons,
      brokenImages,
      overlappingButtons,
    };
  });
}
