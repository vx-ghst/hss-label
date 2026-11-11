export type ArtistPublicationStatus = 'draft' | 'published';
export type ArtistLocale = 'fr' | 'en';

export interface ArtistLink {
  readonly label: string;
  readonly url: string;
}

export interface ArtistTranslation {
  readonly shortBio: string;
  readonly biography: string;
}

export interface Artist {
  readonly id: string;
  readonly slug: string;
  readonly status: ArtistPublicationStatus;
  readonly name: string;
  readonly shortBio: string;
  readonly biography: string;
  readonly image: string;
  readonly links: readonly ArtistLink[];
  readonly featured: boolean;
  readonly sortOrder: number;
  readonly translations: Readonly<Partial<Record<ArtistLocale, ArtistTranslation>>>;
}
