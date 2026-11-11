import { computed, inject, Injectable } from '@angular/core';
import { featuredArtists } from './artists';
import { beats, releases, SectionDefinition, SectionId, sections, site, videos } from './content';
import { MerchSettings, SectionSettingsMap, siteSettings } from './site-settings';
import { ShowsService } from './shows';

export type SectionAvailability = Readonly<Record<SectionId, boolean>>;

export type VisibleSection = SectionDefinition & {
  readonly menuLabel: string;
  readonly navigationLabel: string;
};

export interface MerchMenuItem {
  readonly label: string;
  readonly url: string;
}

export function resolveVisibleSections(
  catalog: readonly SectionDefinition[],
  settings: SectionSettingsMap,
  availability: SectionAvailability,
): VisibleSection[] {
  return catalog.flatMap((section) => {
    const sectionSettings = settings[section.id];
    const visible =
      section.id === 'home' ||
      (sectionSettings.enabled && (!sectionSettings.hideWhenEmpty || availability[section.id]));

    return visible
      ? [
          {
            ...section,
            menuLabel: sectionSettings.menuLabel,
            navigationLabel: sectionSettings.navigationLabel ?? sectionSettings.menuLabel,
          },
        ]
      : [];
  });
}

export function resolveMenuSections(
  visibleSections: readonly VisibleSection[],
  settings: SectionSettingsMap,
): VisibleSection[] {
  return visibleSections.filter(
    (section) => section.id !== 'home' && settings[section.id].showInMenu,
  );
}

export function resolveMerchMenuItem(
  settings: MerchSettings = siteSettings.merch,
): MerchMenuItem | undefined {
  const { enabled, label, shopifyUrl } = settings;
  if (!enabled || !isValidShopifyUrl(shopifyUrl)) return undefined;
  return { label, url: shopifyUrl };
}

export function isValidShopifyUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    const shopifyHost =
      hostname === 'shopify.com' ||
      hostname.endsWith('.shopify.com') ||
      hostname === 'myshopify.com' ||
      hostname.endsWith('.myshopify.com');
    return url.protocol === 'https:' && shopifyHost;
  } catch {
    return false;
  }
}

function isValidHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

@Injectable({ providedIn: 'root' })
export class SectionVisibilityService {
  private readonly upcomingShows = inject(ShowsService).upcomingShows;

  readonly visibleSections = computed(() =>
    resolveVisibleSections(sections, siteSettings.sections, {
      home: true,
      releases: releases.length > 0,
      videos: videos.length > 0,
      artists: featuredArtists.length > 0,
      shows: this.upcomingShows().length > 0,
      beats: beats.length > 0 && isValidHttpsUrl(site.beatStarsUrl),
    }),
  );

  readonly menuSections = computed(() =>
    resolveMenuSections(this.visibleSections(), siteSettings.sections),
  );
}
