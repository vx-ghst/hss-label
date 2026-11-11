import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, test } from 'node:test';
import { loadCmsArtists } from './generate-cms-artists.mjs';

const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true })),
  );
});

test('utilise le fallback uniquement lorsqu’aucun fichier CMS n’existe', async () => {
  const missingDirectory = join(tmpdir(), `hss-artists-absent-${Date.now()}`);
  assert.deepEqual(await loadCmsArtists(missingDirectory), {
    cmsFilesExist: false,
    publishedArtists: [],
  });

  const directory = await createTemporaryDirectory();
  assert.deepEqual(await loadCmsArtists(directory), {
    cmsFilesExist: false,
    publishedArtists: [],
  });
});

test('charge la structure single_file et exclut les brouillons du module public', async () => {
  const directory = await createTemporaryDirectory();
  await writeArtist(
    directory,
    'published.json',
    artistFile({ id: 'published', slug: 'publie', status: 'published' }),
  );
  await writeArtist(
    directory,
    'draft.json',
    artistFile({ id: 'draft', slug: 'brouillon', status: 'draft' }),
  );

  const result = await loadCmsArtists(directory);

  assert.equal(result.cmsFilesExist, true);
  assert.deepEqual(
    result.publishedArtists.map(({ slug }) => slug),
    ['publie'],
  );
  assert.equal(result.publishedArtists[0].translations.fr.shortBio, 'Bio courte FR');
  assert.equal(result.publishedArtists[0].translations.en.shortBio, 'Short bio EN');
});

test('ne réactive pas le fallback lorsque tous les artistes CMS sont en brouillon', async () => {
  const directory = await createTemporaryDirectory();
  await writeArtist(directory, 'draft.json', artistFile({ status: 'draft' }));

  const result = await loadCmsArtists(directory);

  assert.equal(result.cmsFilesExist, true);
  assert.deepEqual(result.publishedArtists, []);
});

test('signale les slugs dupliqués avec les fichiers concernés', async () => {
  const directory = await createTemporaryDirectory();
  await writeArtist(directory, 'first.json', artistFile({ id: 'first', slug: 'duplicate' }));
  await writeArtist(directory, 'second.json', artistFile({ id: 'second', slug: 'duplicate' }));

  await assert.rejects(() => loadCmsArtists(directory), /slug dupliqué "duplicate".*first\.json/);
});

test('signale un JSON invalide et un champ requis manquant', async () => {
  const directory = await createTemporaryDirectory();
  await writeFile(join(directory, 'invalid.json'), '{ invalid', 'utf8');
  await assert.rejects(() => loadCmsArtists(directory), /invalid\.json : JSON invalide/);

  await rm(join(directory, 'invalid.json'));
  const entry = artistFile();
  delete entry.fr.biography;
  delete entry.en.biography;
  await writeArtist(directory, 'missing.json', entry);
  await assert.rejects(() => loadCmsArtists(directory), /fr\.biography est requis/);
});

async function createTemporaryDirectory() {
  const directory = await mkdtemp(join(tmpdir(), 'hss-artists-'));
  temporaryDirectories.push(directory);
  await mkdir(directory, { recursive: true });
  return directory;
}

async function writeArtist(directory, filename, value) {
  await writeFile(join(directory, filename), JSON.stringify(value), 'utf8');
}

function artistFile(overrides = {}) {
  const shared = {
    id: overrides.id ?? 'artist-id',
    slug: overrides.slug ?? 'artiste-test',
    status: overrides.status ?? 'published',
    name: 'Artiste Test',
    image: '/media/test.webp',
    featured: overrides.featured ?? true,
    sortOrder: overrides.sortOrder ?? 10,
    links: [{ label: 'Site', url: 'https://example.com' }],
  };

  return {
    fr: { ...shared, shortBio: 'Bio courte FR', biography: 'Biographie FR' },
    en: { ...shared, shortBio: 'Short bio EN', biography: 'Biography EN' },
  };
}
