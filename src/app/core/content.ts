export const site = {
  name: 'HighSchool Surgery',
  shortName: 'HSS LABEL',
  wordmark: { prefix: 'High', outline: 'School', secondLine: 'Surgery' },
  city: 'Liège, Belgique',
  merchUrl: '',
  beatStarsUrl: '',
};

export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'releases', label: 'Releases' },
  { id: 'videos', label: 'Videos' },
  { id: 'artists', label: 'Artists' },
  { id: 'shows', label: 'Shows' },
  { id: 'beats', label: 'BeatStars' },
] as const;

export type SectionId = (typeof sections)[number]['id'];

export const artists = [
  {
    slug: 'atlas-gris',
    name: 'Atlas Gris',
    image: '/media/atlas.webp',
    shortBio: 'Des couplets bruts sur des boucles découpées à la main.',
    biography:
      'Atlas Gris construit ses morceaux autour de samples courts, de silences et de récits de quartier. Sur scène, il retravaille ses textes au fil des instrumentales.',
  },
  {
    slug: 'ligne-basse',
    name: 'Ligne Basse',
    image: '/media/ligne.webp',
    shortBio: 'Des basses épaisses, du grain et une obsession pour les breaks.',
    biography:
      'Ligne Basse assemble des rythmes à partir de vinyles, de boîtes à rythmes et de prises de terrain. Ses productions font le lien entre le beatmaking et les musiques électroniques.',
  },
  {
    slug: 'nuit-civile',
    name: 'Nuit Civile',
    image: '/media/nuit.webp',
    shortBio: 'Un rap nocturne aux images précises et aux refrains discrets.',
    biography:
      'Nuit Civile écrit à partir de conversations et de scènes ordinaires. Les arrangements laissent de la place à la voix, avec des basses sourdes et des textures de bande.',
  },
];

export const releases = [
  {
    title: 'Coupe franche',
    date: '2026-10-09',
    image: '/media/coupe.webp',
    artistSlug: 'atlas-gris',
  },
  {
    title: 'Salle vide',
    date: '2026-09-18',
    image: '/media/salle.webp',
    artistSlug: 'ligne-basse',
  },
  {
    title: 'À contre-jour',
    date: '2026-08-28',
    image: '/media/contre.webp',
    artistSlug: 'nuit-civile',
  },
].sort((first, second) => second.date.localeCompare(first.date));

export const videos = [
  { title: 'Coupe franche — session live', image: '/media/atlas.webp', artistSlug: 'atlas-gris' },
  { title: 'Salle vide — en studio', image: '/media/ligne.webp', artistSlug: 'ligne-basse' },
];

export const shows = [
  {
    title: 'HSS Sessions',
    startsAt: '2026-12-19T20:00:00+01:00',
    city: 'Liège',
    venue: 'Studio Nord',
    artistSlug: 'atlas-gris',
    status: 'Annoncé',
  },
  {
    title: 'Nuit des indépendants',
    startsAt: '2027-01-16T21:00:00+01:00',
    city: 'Bruxelles',
    venue: 'Salle Traverse',
    artistSlug: 'nuit-civile',
    status: 'Complet',
  },
];

export type Show = (typeof shows)[number];

export const beats = [
  { title: 'Terrain vague', bpm: 87, style: 'Boom bap' },
  { title: 'Plein cadre', bpm: 92, style: 'Boom bap' },
  { title: 'Bande noire', bpm: 80, style: 'Hip-hop instrumental' },
];

export function artistName(slug: string): string {
  return artists.find((artist) => artist.slug === slug)?.name ?? slug;
}
