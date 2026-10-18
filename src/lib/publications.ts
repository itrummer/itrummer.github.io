import { entries as parseBibEntries } from 'bibtex-parse';
import bibRaw from '../data/publications.bib?raw';
import allowlistKeys from '../data/cv-publication-keys.json';

export type Publication = {
  key: string;
  type: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  note?: string;
  url?: string;
};

const allowlist = new Set(allowlistKeys as string[]);

/** Expand common BibTeX accent escapes for HTML display (UTF-8 in .bib is unchanged). */
export function normalizeBibTeXText(text: string): string {
  if (!text) return text;
  let s = text;

  const diaeresis: Record<string, string> = {
    a: 'ä',
    A: 'Ä',
    o: 'ö',
    O: 'Ö',
    u: 'ü',
    U: 'Ü',
  };

  // Braced forms, e.g. {\"o} or {\\"o}
  s = s.replace(/\{\\?\\?"([aouAOU])\}/g, (_, c: string) => diaeresis[c] ?? c);
  // Unbraced after parse, e.g. Sch\"onberger
  s = s.replace(/\\"([aouAOU])/g, (_, c: string) => diaeresis[c] ?? c);

  s = s.replace(/\{\\?ss\}/gi, 'ß');
  s = s.replace(/\\ss\b/gi, 'ß');

  return s;
}

function parseYear(raw: string | undefined): number {
  if (!raw) return 0;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

function parseAll(): Publication[] {
  const parsed = parseBibEntries(bibRaw);
  const pubs: Publication[] = [];

  for (const e of parsed) {
    if (!e.key || !allowlist.has(e.key)) continue;
    const venue = (e.JOURNAL || e.BOOKTITLE || e.SCHOOL || e.PUBLISHER || '').trim();
    const url = (e.URL || e.DOI || '').trim();
    pubs.push({
      key: e.key,
      type: (e.type || '').toLowerCase(),
      title: normalizeBibTeXText((e.TITLE || '').trim()),
      authors: normalizeBibTeXText((e.AUTHOR || '').trim()),
      year: parseYear(e.YEAR),
      venue: normalizeBibTeXText(venue),
      note: e.NOTE ? normalizeBibTeXText(e.NOTE.trim()) : undefined,
      url: url.startsWith('http') ? url : url ? `https://doi.org/${url}` : undefined,
    });
  }

  return pubs;
}

let cached: Publication[] | null = null;

export function getPublications(filterKeys?: Set<string>): Publication[] {
  if (!cached) cached = parseAll();
  let list = cached;
  if (filterKeys) {
    list = list.filter((p) => filterKeys.has(p.key));
  }
  return [...list].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.venue.localeCompare(b.venue, undefined, { sensitivity: 'base' });
  });
}

export type YearGroup = { year: number; publications: Publication[] };

export function groupByYear(publications: Publication[]): YearGroup[] {
  const map = new Map<number, Publication[]>();
  for (const p of publications) {
    const y = p.year || 0;
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(p);
  }
  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, publications]) => ({
      year,
      publications: [...publications].sort((a, b) =>
        a.venue.localeCompare(b.venue, undefined, { sensitivity: 'base' }),
      ),
    }));
}

export function formatAuthors(authors: string): string {
  return authors.replace(/\s+and\s+/gi, ', ');
}
