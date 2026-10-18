import themesData from './research-themes.json';

export type SystemLink = { name: string; url: string };
export type TalkLink = { title: string; url: string };

export type ResearchTheme = {
  slug: string;
  title: string;
  summary: string;
  status: 'active' | 'historical';
  citekeys: string[];
  systems: SystemLink[];
  talks: TalkLink[];
};

export const researchThemes: ResearchTheme[] = themesData.themes;

export function getThemeBySlug(slug: string): ResearchTheme | undefined {
  return researchThemes.find((t) => t.slug === slug);
}

export function getAllThemeSlugs(): string[] {
  return researchThemes.map((t) => t.slug);
}
