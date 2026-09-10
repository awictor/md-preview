# MdPreview

**Live Markdown → HTML previewer** — type Markdown, watch the rendered HTML update live, and copy the HTML out. One offline HTML file, no signup, no tracking.

👉 **[Open MdPreview](https://awictor.github.io/md-preview/)**

## Features
- Headings, **bold**, _italic_, `inline code`, and fenced code blocks
- Links, images, ordered/unordered lists, blockquotes, horizontal rules
- Text is HTML-escaped, so raw HTML is shown literally (safer preview)
- Split editor + live preview; one-click "copy HTML"
- Dark mode, remembers your document
- 100% client-side; works offline

## Why
When you just need to see how a chunk of Markdown renders — or grab the HTML — without pasting it into some online editor, MdPreview does it locally and instantly. Part of the [Toolkit](https://awictor.github.io/toolkit/).

## Tests
```
node tests/selftest.mjs
```
Pure functions (`escapeHtml`, `inline`, `mdToHtml`) are covered by headless regression tests: every inline and block rule, HTML escaping, code-span protection, and a sentinel-safety check that plain digits are never corrupted. CI runs them on every push.

## License
MIT © Alex Wictor
