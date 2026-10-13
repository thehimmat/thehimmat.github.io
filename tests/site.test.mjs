import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (file) => readFileSync(join(root, file), 'utf8');
// Drop HTML comments so hidden (commented-out) content doesn't count.
const visible = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

const PAGES = ['index.html', 'ai-sessions.html', 'work-with-me.html', 'support.html', '404.html'];
const NAV_ITEMS = ['Build', 'Teach', 'AI sessions', 'About', 'Work with me', 'Support'];

for (const page of PAGES) {
  test(`${page}: exists`, () => {
    assert.ok(existsSync(join(root, page)));
  });

  test(`${page}: uses the shared stylesheet and script`, () => {
    const html = read(page);
    assert.match(html, /<link[^>]+href="\/?site\.css"/);
    assert.match(html, /<script[^>]+src="\/?site\.js"/);
    assert.doesNotMatch(html, /output\.css/);
  });

  test(`${page}: has the shared nav, skip link, and main landmark`, () => {
    const html = visible(read(page));
    assert.match(html, /class="skip-link" href="#main-content"/);
    assert.match(html, /<main id="main-content"/);
    assert.match(html, /class="nav-toggle"/);
    const menu = html.match(/<ul class="nav-links"[\s\S]*?<\/ul>/);
    assert.ok(menu, 'nav-links list present');
    for (const item of NAV_ITEMS) assert.match(menu[0], new RegExp(`>${item}</a>`));
  });

  test(`${page}: footer links atthebunga, GitHub, and Support`, () => {
    const footer = read(page).match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';
    assert.match(footer, /atthebunga\.com/);
    assert.match(footer, /github\.com\/thehimmat/);
    assert.match(footer, /support\.html/);
  });

  test(`${page}: has a meta description`, () => {
    assert.match(read(page), /<meta name="description" content="[^"]{50,}"/);
  });

  test(`${page}: has Open Graph and Twitter Card tags`, () => {
    const html = read(page);
    for (const prop of ['og:title', 'og:description', 'og:url', 'og:type', 'og:image']) {
      assert.match(html, new RegExp(`<meta property="${prop}" content="[^"]+"`), prop);
    }
    assert.match(html, /<meta name="twitter:card" content="[^"]+"/);
  });

  test(`${page}: every target=_blank link has rel="noopener noreferrer"`, () => {
    const links = visible(read(page)).match(/<a\b[^>]*target="_blank"[^>]*>/g) ?? [];
    for (const link of links) assert.match(link, /rel="noopener noreferrer"/, link);
  });
}

test('404.html uses root-relative asset paths', () => {
  const html = read('404.html');
  assert.match(html, /href="\/site\.css"/);
  assert.match(html, /src="\/site\.js"/);
  assert.match(html, /href="\/"/);
});

test('Voice Search is hidden from the Build section', () => {
  assert.doesNotMatch(visible(read('index.html')), /Voice Search/);
});

test('Tailwind leftovers and the unused demo gif are gone', () => {
  for (const file of ['output.css', 'styles.css', 'src/input.css', 'tailwind.config.js', 'package-lock.json', 'gurmukhiTransliteratorDemo.gif']) {
    assert.ok(!existsSync(join(root, file)), `${file} should be removed`);
  }
});
