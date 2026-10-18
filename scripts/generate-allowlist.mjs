import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { entries as parseBibEntries } from 'bibtex-parse';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const bibRaw = fs.readFileSync(path.join(root, 'TrummerPublications.bib'), 'utf8');
const indexRaw = fs.readFileSync(
  path.join(root, 'archive/jekyll/index.md'),
  'utf8',
);

function normalize(s) {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[λ]/g, 'lambda')
    .replace(/[''""]/g, "'")
    .replace(/[^a-z0-9\s'-]/g, '')
    .trim();
}

const entries = parseBibEntries(bibRaw);
const byTitle = new Map();
for (const block of entries) {
  const key = block.key;
  const titleEntry = block.TITLE;
  if (!key || !titleEntry) continue;
  byTitle.set(normalize(titleEntry), key);
}

const pubLines = indexRaw
  .split('\n')
  .filter((l) => l.startsWith('- **'));

const keys = [];
const unmatched = [];

for (const line of pubLines) {
  const m = line.match(/^- \*\*[^*]+\*\* (.+?)\.\s*_/);
  if (!m) continue;
  let title = m[1].replace(/\*\*\*[^*]+\*\*\*\s*/g, '').trim();
  title = title.replace(/^Best of VLDB\s*/i, '').trim();
  const n = normalize(title);
  let key = byTitle.get(n);
  if (!key) {
    for (const [t, k] of byTitle) {
      if (t.includes(n) || n.includes(t)) {
        key = k;
        break;
      }
    }
  }
  if (key) keys.push(key);
  else unmatched.push(title);
}

const extra = [
  'Lao2026gendb',
  'Jayasekara2026',
  // Title / punctuation mismatches vs index.md
  'Trummer2023e',
  'Trummer2022',
  'Trummer2021d',
  'Lao2025',
  'Giannakouris2024a',
  'Trummer2023f',
  'Karagiannis2020',
  'skinnerDB',
  'Trummer2022c',
  'Trummer2022a',
  'JoT20',
  'Trummer2021nlp',
];
for (const k of extra) {
  if (!keys.includes(k)) keys.push(k);
}

const unique = [...new Set(keys)].sort();

if (unmatched.length) {
  console.warn('Unmatched index.md publications:', unmatched);
}

const out = path.join(root, 'src/data/cv-publication-keys.json');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, JSON.stringify(unique, null, 2) + '\n');
console.log(`Wrote ${unique.length} keys to ${out}`);
