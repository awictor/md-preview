// Headless regression tests for MdPreview pure functions.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(__dirname, '..', 'index.html'), 'utf8');

const js = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)]
  .map(m => m[1]).sort((a, b) => b.length - a.length)[0];

function el(){ return {value:'',textContent:'',innerHTML:'',style:{},className:'',
  appendChild(){},getAttribute(){return null;},setAttribute(){},removeAttribute(){},
  addEventListener(){},querySelectorAll(){return[];}}; }
globalThis.document = {
  getElementById: () => el(), createElement: () => el(),
  querySelectorAll: () => [], documentElement: el()
};
globalThis.localStorage = { getItem:()=>null, setItem(){}, removeItem(){} };
globalThis.matchMedia = () => ({ matches:false });
globalThis.window = { matchMedia: globalThis.matchMedia };

eval(js.replace('if(typeof module !== \'undefined\') module.exports =',
  'globalThis.__t =') );
const { escapeHtml, inline, mdToHtml } = globalThis.__t;

let n = 0;
const check = (name, fn) => { fn(); n++; console.log('  ok -', name); };

check('escapeHtml escapes & < >', () => {
  assert.equal(escapeHtml('a < b & c > d'), 'a &lt; b &amp; c &gt; d');
});

check('inline: bold and italic', () => {
  assert.equal(inline('Hello **world**'), 'Hello <strong>world</strong>');
  assert.equal(inline('a __b__ c'), 'a <strong>b</strong> c');
  assert.equal(inline('an *emphasis*'), 'an <em>emphasis</em>');
  assert.equal(inline('an _emphasis_'), 'an <em>emphasis</em>');
});

check('inline: code span is escaped and not further formatted', () => {
  assert.equal(inline('use `x < y`'), 'use <code>x &lt; y</code>');
  assert.equal(inline('`**not bold**`'), '<code>**not bold**</code>');
});

check('inline: links and images', () => {
  assert.equal(inline('[Toolkit](https://awictor.github.io/toolkit/)'),
    '<a href="https://awictor.github.io/toolkit/">Toolkit</a>');
  assert.equal(inline('![alt text](/img.png)'), '<img src="/img.png" alt="alt text">');
});

check('inline: digits with spaces are NOT corrupted (sentinel safety)', () => {
  assert.equal(inline('I have 3 cats and 42 hopes'), 'I have 3 cats and 42 hopes');
  assert.equal(inline('step 1 of 5'), 'step 1 of 5');
});

check('mdToHtml: headings', () => {
  assert.equal(mdToHtml('# Title'), '<h1>Title</h1>');
  assert.equal(mdToHtml('### Sub'), '<h3>Sub</h3>');
});

check('mdToHtml: paragraph joins wrapped lines and escapes', () => {
  assert.equal(mdToHtml('Hello\nworld'), '<p>Hello world</p>');
  assert.equal(mdToHtml('a < b'), '<p>a &lt; b</p>');
});

check('mdToHtml: unordered and ordered lists', () => {
  assert.equal(mdToHtml('- a\n- b'), '<ul><li>a</li><li>b</li></ul>');
  assert.equal(mdToHtml('1. one\n2. two'), '<ol><li>one</li><li>two</li></ol>');
});

check('mdToHtml: blockquote wraps rendered content', () => {
  assert.equal(mdToHtml('> quote'), '<blockquote><p>quote</p></blockquote>');
});

check('mdToHtml: fenced code block with language, escaped', () => {
  assert.equal(mdToHtml('```js\nconst x = 1 < 2;\n```'),
    '<pre><code class="language-js">const x = 1 &lt; 2;</code></pre>');
  assert.equal(mdToHtml('```\nplain\n```'),
    '<pre><code>plain</code></pre>');
});

check('mdToHtml: horizontal rule', () => {
  assert.equal(mdToHtml('---'), '<hr>');
  assert.equal(mdToHtml('***'), '<hr>');
});

check('mdToHtml: multiple blocks in order', () => {
  const md = '# H\n\ntext **bold**\n\n- item';
  assert.equal(mdToHtml(md),
    '<h1>H</h1>\n<p>text <strong>bold</strong></p>\n<ul><li>item</li></ul>');
});

console.log(`\n${n} checks passed.`);
