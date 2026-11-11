import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  SectionVisibilityService,
  SectionAvailability,
  resolveMenuSections,
  resolveMerchMenuItem,
  resolveVisibleSections,
} from './section-visibility';
import { sections, shows } from './content';
import { SectionSettingsMap, siteSettings } from './site-settings';
import { ShowsService } from './shows';

const unavailable: SectionAvailability = {
  home: true,
  releases: false,
  videos: false,
  artists: false,
  shows: false,
  beats: false,
};

describe('visibilité des sections', () => {
  it('conserve toujours Home et masque les sections vides par défaut', () => {
    const settings: SectionSettingsMap = {
      ...siteSettings.sections,
      home: { ...siteSettings.sections.home, enabled: false },
    };

    const visible = resolveVisibleSections(sections, settings, unavailable);

    expect(visible.map(({ id }) => id)).toEqual(['home']);
  });

  it('respecte enabled, hideWhenEmpty et l’ordre stable du catalogue', () => {
    const availability: SectionAvailability = {
      home: true,
      releases: true,
      videos: false,
      artists: true,
      shows: true,
      beats: false,
    };
    const settings: SectionSettingsMap = {
      ...siteSettings.sections,
      artists: { ...siteSettings.sections.artists, enabled: false },
      videos: { ...siteSettings.sections.videos, hideWhenEmpty: false },
    };

    const visible = resolveVisibleSections(sections, settings, availability);

    expect(visible.map(({ id }) => id)).toEqual(['home', 'releases', 'videos', 'shows']);
  });

  it('ne place dans le menu que les sections visibles autorisées et utilise leur libellé', () => {
    const settings: SectionSettingsMap = {
      ...siteSettings.sections,
      releases: { ...siteSettings.sections.releases, menuLabel: 'Nouveautés' },
      artists: { ...siteSettings.sections.artists, showInMenu: false },
    };
    const availability: SectionAvailability = {
      home: true,
      releases: true,
      videos: false,
      artists: true,
      shows: false,
      beats: false,
    };

    const menu = resolveMenuSections(
      resolveVisibleSections(sections, settings, availability),
      settings,
    );

    expect(menu.map(({ id, menuLabel }) => [id, menuLabel])).toEqual([['releases', 'Nouveautés']]);
  });

  it('retire Shows de la navigation lorsque le dernier concert futur expire', () => {
    const upcomingShows = signal<readonly (typeof shows)[number][]>([shows[0]]);
    TestBed.configureTestingModule({
      providers: [
        SectionVisibilityService,
        { provide: ShowsService, useValue: { upcomingShows: upcomingShows.asReadonly() } },
      ],
    });
    const service = TestBed.inject(SectionVisibilityService);
    expect(service.visibleSections().some(({ id }) => id === 'shows')).toBe(true);

    upcomingShows.set([]);

    expect(service.visibleSections().some(({ id }) => id === 'shows')).toBe(false);
    expect(service.menuSections().some(({ id }) => id === 'shows')).toBe(false);
  });
});

describe('entrée Merch', () => {
  it('reste masquée si elle est désactivée ou si son URL Shopify est invalide', () => {
    expect(
      resolveMerchMenuItem({
        enabled: false,
        label: 'MERCH',
        shopifyUrl: 'https://hss.myshopify.com',
      }),
    ).toBeUndefined();
    expect(
      resolveMerchMenuItem({
        enabled: true,
        label: 'MERCH',
        shopifyUrl: 'http://hss.myshopify.com',
      }),
    ).toBeUndefined();
    expect(
      resolveMerchMenuItem({ enabled: true, label: 'MERCH', shopifyUrl: 'https://example.com' }),
    ).toBeUndefined();
  });

  it('accepte une boutique Shopify HTTPS activée', () => {
    expect(
      resolveMerchMenuItem({
        enabled: true,
        label: 'Boutique',
        shopifyUrl: 'https://hss-label.myshopify.com',
      }),
    ).toEqual({ label: 'Boutique', url: 'https://hss-label.myshopify.com' });
  });
});
