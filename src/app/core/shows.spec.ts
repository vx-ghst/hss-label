import { PLATFORM_ID, TransferState } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { getUpcomingShows, SHOWS_REFERENCE_TIME, ShowsService } from './shows';
import { Show } from './content';

const show = (title: string, startsAt: string): Show => ({
  title,
  startsAt,
  city: 'Liège',
  venue: 'Studio Nord',
  artistSlug: 'atlas-gris',
  status: 'Annoncé',
});

describe('getUpcomingShows', () => {
  it('exclut les concerts passés et ceux qui commencent exactement à la date de référence', () => {
    const referenceTime = Date.parse('2027-01-16T21:00:00+01:00');
    const source = [
      show('Passé', '2027-01-16T20:59:59+01:00'),
      show('À la limite', '2027-01-16T21:00:00+01:00'),
      show('À venir', '2027-01-16T21:00:01+01:00'),
    ];

    expect(getUpcomingShows(source, referenceTime).map(({ title }) => title)).toEqual(['À venir']);
  });

  it('classe les concerts à venir dans l’ordre chronologique sans modifier la source', () => {
    const source = [
      show('Troisième', '2027-04-01T20:00:00+02:00'),
      show('Premier', '2027-02-01T20:00:00+01:00'),
      show('Deuxième', '2027-03-01T20:00:00+01:00'),
    ];
    const originalOrder = source.map(({ title }) => title);

    const result = getUpcomingShows(source, Date.parse('2027-01-01T00:00:00+01:00'));

    expect(result.map(({ title }) => title)).toEqual(['Premier', 'Deuxième', 'Troisième']);
    expect(source.map(({ title }) => title)).toEqual(originalOrder);
  });

  it('compare correctement des dates qui utilisent des fuseaux horaires différents', () => {
    const referenceTime = Date.parse('2027-01-16T20:00:00Z');
    const source = [
      show('Même instant', '2027-01-16T21:00:00+01:00'),
      show('Une minute après', '2027-01-16T15:01:00-05:00'),
      show('Une minute avant', '2027-01-16T20:59:00+01:00'),
    ];

    expect(getUpcomingShows(source, referenceTime).map(({ title }) => title)).toEqual([
      'Une minute après',
    ]);
  });
});

describe('ShowsService', () => {
  afterEach(() => vi.restoreAllMocks());

  it('réutilise dans le navigateur la date de référence transmise par le prérendu', () => {
    const prerenderTime = Date.parse('2026-12-01T00:00:00+01:00');
    const browserTime = Date.parse('2027-02-01T00:00:00+01:00');
    vi.spyOn(Date, 'now').mockReturnValue(browserTime);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    const transferState = TestBed.inject(TransferState);
    transferState.set(SHOWS_REFERENCE_TIME, prerenderTime);

    const service = TestBed.inject(ShowsService);

    expect(service.upcomingShows().map(({ title }) => title)).toEqual([
      'HSS Sessions',
      'Nuit des indépendants',
    ]);
  });

  it('enregistre côté serveur la date utilisée pour filtrer les concerts', () => {
    const prerenderTime = Date.parse('2026-12-20T00:00:00+01:00');
    vi.spyOn(Date, 'now').mockReturnValue(prerenderTime);
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
    });
    const transferState = TestBed.inject(TransferState);

    const service = TestBed.inject(ShowsService);

    expect(transferState.get(SHOWS_REFERENCE_TIME, 0)).toBe(prerenderTime);
    expect(service.upcomingShows().map(({ title }) => title)).toEqual(['Nuit des indépendants']);
  });
});
