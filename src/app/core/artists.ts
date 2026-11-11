import type { Artist } from './artist.model';
import { fallbackArtists } from './content';
import { cmsArtistFilesExist, cmsPublishedArtists } from './generated/cms-artists.generated';

export interface ArtistCollections {
  readonly publishedArtists: readonly Artist[];
  readonly featuredArtists: readonly Artist[];
  readonly usesCmsContent: boolean;
}

export function resolveArtistCollections(
  cmsArtists: readonly Artist[],
  cmsFilesExist: boolean,
  fallback: readonly Artist[],
): ArtistCollections {
  const source = cmsFilesExist ? cmsArtists : fallback;
  const publishedArtists = source
    .filter((artist) => artist.status === 'published')
    .sort(
      (first, second) =>
        first.sortOrder - second.sortOrder || first.name.localeCompare(second.name, 'fr'),
    );

  return {
    publishedArtists,
    featuredArtists: publishedArtists.filter((artist) => artist.featured),
    usesCmsContent: cmsFilesExist,
  };
}

const artistCollections = resolveArtistCollections(
  cmsPublishedArtists,
  cmsArtistFilesExist,
  fallbackArtists,
);

export const publishedArtists = artistCollections.publishedArtists;
export const featuredArtists = artistCollections.featuredArtists;
export const usesCmsArtistContent = artistCollections.usesCmsContent;

export function findPublishedArtistBySlug(
  slug: string,
  source: readonly Artist[] = publishedArtists,
): Artist | undefined {
  return source.find((artist) => artist.slug === slug);
}

export function artistName(slug: string): string {
  return findPublishedArtistBySlug(slug)?.name ?? slug;
}
