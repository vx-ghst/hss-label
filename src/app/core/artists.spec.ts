import type { Artist } from './artist.model';
import { fallbackArtists } from './content';
import { findPublishedArtistBySlug, resolveArtistCollections } from './artists';

describe('resolveArtistCollections', () => {
  it('utilise les artistes fictifs uniquement sans fichier CMS', () => {
    const result = resolveArtistCollections([], false, fallbackArtists);

    expect(result.usesCmsContent).toBe(false);
    expect(result.publishedArtists.map(({ slug }) => slug)).toEqual([
      'atlas-gris',
      'ligne-basse',
      'nuit-civile',
    ]);
  });

  it('considère une collection CMS vide comme source de vérité', () => {
    const result = resolveArtistCollections([], true, fallbackArtists);

    expect(result.usesCmsContent).toBe(true);
    expect(result.publishedArtists).toEqual([]);
    expect(result.featuredArtists).toEqual([]);
  });

  it('filtre les brouillons et ordonne les artistes mis en avant', () => {
    const cmsArtists = [
      artist({ id: 'later', slug: 'later', sortOrder: 20, featured: true }),
      artist({ id: 'draft', slug: 'draft', status: 'draft', sortOrder: 1, featured: true }),
      artist({ id: 'hidden', slug: 'hidden', sortOrder: 5, featured: false }),
      artist({ id: 'first', slug: 'first', sortOrder: 10, featured: true }),
    ];

    const result = resolveArtistCollections(cmsArtists, true, fallbackArtists);

    expect(result.publishedArtists.map(({ slug }) => slug)).toEqual(['hidden', 'first', 'later']);
    expect(result.featuredArtists.map(({ slug }) => slug)).toEqual(['first', 'later']);
  });
});

describe('findPublishedArtistBySlug', () => {
  it('résout uniquement un slug présent dans la collection publique fournie', () => {
    const source = [artist({ id: 'public', slug: 'public' })];

    expect(findPublishedArtistBySlug('public', source)?.id).toBe('public');
    expect(findPublishedArtistBySlug('absent', source)).toBeUndefined();
  });
});

function artist(overrides: Partial<Artist>): Artist {
  return {
    id: 'artist',
    slug: 'artist',
    status: 'published',
    name: 'Artist',
    shortBio: 'Short biography',
    biography: 'Biography',
    image: '/media/artist.webp',
    links: [],
    featured: true,
    sortOrder: 0,
    translations: { fr: { shortBio: 'Short biography', biography: 'Biography' } },
    ...overrides,
  };
}
