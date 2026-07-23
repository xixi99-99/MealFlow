import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { chromium } from 'file:///C:/Users/User/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.59.1/node_modules/playwright/index.mjs';

const outputDir = fileURLToPath(new URL('../.artifacts/', import.meta.url));
await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const runtimeErrors = [];
page.on('pageerror', (error) => runtimeErrors.push(error.message));
page.on('console', (message) => { if (message.type() === 'error') runtimeErrors.push(message.text()); });

await page.goto('http://127.0.0.1:5174/login', { waitUntil: 'domcontentloaded' });
await page.screenshot({ path: resolve(outputDir, 'login-desktop.png'), fullPage: true });
await page.getByRole('button', { name: '登入', exact: true }).click();
await page.waitForURL('http://127.0.0.1:5174/');
await page.screenshot({ path: resolve(outputDir, 'dashboard-desktop.png'), fullPage: true });

await page.goto('http://127.0.0.1:5174/menu', { waitUntil: 'domcontentloaded' });
await page.getByText('香煎雞腿便當', { exact: true }).first().waitFor();
await page.getByRole('button', { name: '加入香煎雞腿便當至購物車' }).click();
await page.screenshot({ path: resolve(outputDir, 'menu-desktop.png'), fullPage: true });
const desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://127.0.0.1:5174/menu', { waitUntil: 'domcontentloaded' });
await page.getByText('香煎雞腿便當', { exact: true }).first().waitFor();
await page.screenshot({ path: resolve(outputDir, 'menu-mobile.png'), fullPage: true });
const mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

await browser.close();
if (desktopOverflow || mobileOverflow || runtimeErrors.length > 0) {
  throw new Error(JSON.stringify({ desktopOverflow, mobileOverflow, runtimeErrors }, null, 2));
}
console.log(JSON.stringify({ desktopOverflow, mobileOverflow, runtimeErrors, screenshots: ['login-desktop.png', 'dashboard-desktop.png', 'menu-desktop.png', 'menu-mobile.png'] }, null, 2));
