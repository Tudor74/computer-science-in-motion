// Playwright checks for Frontier In Motion.
//   node explorer/test/check.js [outdir]
// No console errors; no horizontal overflow at 320-1024px; map -> lane -> card
// by mouse and keyboard; filters; reduced motion; screenshots to look at.
const { chromium } = require("playwright");
const path = require("path");
const fs = require("fs");

const page_url = "file://" + path.resolve(__dirname, "..", "index.html");
const out = process.argv[2] || path.resolve(__dirname, "..", "shots");
fs.mkdirSync(out, { recursive: true });
let failures = 0;
const ok = (cond, msg) => { console.log((cond ? "PASS " : "FAIL ") + msg); if (!cond) failures++; };

(async () => {
  const browser = await chromium.launch();
  for (const width of [320, 375, 600, 768, 1024]) {
    const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: width === 1024 || width === 375 ? 2 : 1 });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", e => errors.push(String(e)));
    await page.goto(page_url);
    await page.waitForSelector("#map .region");
    const overflow = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    ok(await overflow() <= 0, `${width}px: no horizontal overflow on load`);
    const regions = await page.locator("#map .region").count();
    const landmarks = await page.locator("#map .lm").count();
    ok(regions === 7, `${width}px: 7 field regions (${regions})`);
    ok(landmarks >= 11, `${width}px: landmarks drawn (${landmarks})`);
    if (width === 1024 || width === 375) await page.locator(".map-wrap").screenshot({ path: `${out}/map-${width}.png` });

    // Map -> lane: click the busiest landmark.
    const busiest = await page.evaluate(() => {
      const c = {}; for (const p of DATA.snapshot.papers) for (const x of p.problems) c[x] = (c[x] || 0) + 1;
      return Object.entries(c).sort((a, b) => b[1] - a[1])[0][0];
    });
    await page.locator(`#map .lm[data-problem="${busiest}"] .core`).click({ force: true });
    await page.waitForSelector("#lane-panel:not([hidden])");
    const pts = await page.locator("#lane .pt").count();
    ok(pts > 0, `${width}px: lane '${busiest}' shows ${pts} preprints`);
    ok(await page.locator("#paper-list button").count() > 0, `${width}px: accessible paper list filled`);
    ok(await overflow() <= 0, `${width}px: no overflow with lane open`);
    if (width === 1024 || width === 375) await page.locator("#lane-panel").screenshot({ path: `${out}/lane-${width}.png` });

    // Lane -> card via a dot.
    await page.waitForTimeout(700);
    await page.locator("#lane .pt").last().click({ force: true });
    await page.waitForSelector("#card-panel:not([hidden])");
    const cardText = await page.locator("#card").innerText();
    ok(/posted/.test(cardText) && /(page)/.test(cardText), `${width}px: claim card has timeline and source link`);
    ok(await overflow() <= 0, `${width}px: no overflow with card open`);
    if (width === 1024 || width === 375) await page.locator("#card-panel").screenshot({ path: `${out}/card-${width}.png` });

    // A card with signals shows intervals and reasons.
    const withSig = await page.evaluate(() => (DATA.snapshot.papers.find(p => p.signals && p.problems.length) || DATA.snapshot.papers.find(p => p.signals) || {}).id);
    if (withSig) {
      await page.evaluate(id => { location.hash = ""; }, withSig);
      const L = await page.evaluate(id => { const p = DATA.snapshot.papers.find(q => q.id === id); return p.problems[0] ? { problem: p.problems[0] } : { field: p.field }; }, withSig);
      await page.evaluate(([L, id]) => { openLane(L); openCard(id); }, [L, withSig]);
      const t = await page.locator("#card").innerText();
      ok(/80%/.test(t) && /earlier preprints/.test(t), `${width}px: signal card shows 80% interval and reason`);
      if (width === 1024) await page.locator("#card-panel").screenshot({ path: `${out}/card-signals-${width}.png` });
    }

    // Filters.
    await page.locator("#f-bold").click();
    ok(await page.locator("#f-bold").getAttribute("aria-pressed") === "true", `${width}px: bold filter toggles`);
    await page.locator("#f-bold").click();
    await page.locator("#f-new").click();
    ok(await page.locator("#f-new").getAttribute("aria-pressed") === "false", `${width}px: newcomers lane toggles`);
    await page.locator("#f-new").click();
    await page.locator("#f-chg").click();
    ok((await page.locator("#paper-list").innerText()).length > 0, `${width}px: status-changed filter explains itself`);
    await page.locator("#f-chg").click();

    // Keyboard: Escape back, Enter on a landmark.
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    await page.locator("#problem-list button").first().focus();
    await page.keyboard.press("Enter");
    ok(await page.locator("#problem-list button").first().getAttribute("aria-pressed") === "true", `${width}px: keyboard opens a lane`);
    const small = await page.evaluate(() => [...document.querySelectorAll("button, .links-row a")].filter(b => b.offsetParent && b.getBoundingClientRect().height < 40).map(b => b.textContent.trim().slice(0, 30)));
    ok(small.length === 0, `${width}px: touch targets at least 40px tall ${small.length ? JSON.stringify(small.slice(0, 5)) : ""}`);
    ok(errors.length === 0, `${width}px: no console errors ${errors.slice(0, 3).join(" | ")}`);
    if (width === 1024) {
      await page.locator("#backtest").screenshot({ path: `${out}/backtest-${width}.png` });
      await page.locator("#cases-panel").screenshot({ path: `${out}/cases-${width}.png` });
      await page.locator("#ethics").screenshot({ path: `${out}/ethics-${width}.png` });
      await page.screenshot({ path: `${out}/full-${width}.png`, fullPage: true });
    }
    await ctx.close();
  }
  // Reduced motion: glow animation off.
  const ctx = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 800, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(page_url);
  const anim = await page.evaluate(() => { const g = document.querySelector(".glow"); return g ? getComputedStyle(g).animationName : "none"; });
  ok(anim === "none", "reduced motion: landmark glow is still");
  await ctx.close();
  await browser.close();
  console.log(failures ? `${failures} failure(s)` : "All checks passed");
  process.exit(failures ? 1 : 0);
})();
