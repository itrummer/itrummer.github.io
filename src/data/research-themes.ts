import themesData from './research-themes.json';

export type SystemLink = { name: string; url: string };
export type TalkLink = { title: string; url: string };
export type FeaturedVideo = {
  youtubeId: string;
  title?: string;
  /** YouTube embed start offset in seconds. */
  startSeconds?: number;
  /** YouTube embed end time in seconds (optional). */
  endSeconds?: number;
};

export type ResearchTheme = {
  slug: string;
  title: string;
  summary: string;
  status: 'active' | 'historical';
  citekeys: string[];
  systems: SystemLink[];
  talks: TalkLink[];
  featuredVideo?: FeaturedVideo;
};

export const researchThemes: ResearchTheme[] = themesData.themes;

export function getThemeBySlug(slug: string): ResearchTheme | undefined {
  return researchThemes.find((t) => t.slug === slug);
}

export function getAllThemeSlugs(): string[] {
  return researchThemes.map((t) => t.slug);
}
