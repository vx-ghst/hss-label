import { SectionId } from './content';

export interface SectionSettings {
  readonly enabled: boolean;
  readonly hideWhenEmpty: boolean;
  readonly showInMenu: boolean;
  readonly menuLabel: string;
  readonly navigationLabel?: string;
}

export type SectionSettingsMap = {
  readonly [section in SectionId]: SectionSettings;
};

export interface MenuLinkSettings {
  readonly enabled: boolean;
  readonly label: string;
}

export interface MerchSettings extends MenuLinkSettings {
  readonly shopifyUrl: string;
}

export interface SiteSettings {
  readonly sections: SectionSettingsMap;
  readonly secondaryMenu: {
    readonly asbl: MenuLinkSettings;
    readonly beats: MenuLinkSettings;
  };
  readonly merch: MerchSettings;
}

export const siteSettings: SiteSettings = {
  sections: {
    home: {
      enabled: true,
      hideWhenEmpty: false,
      showInMenu: false,
      menuLabel: 'Home',
      navigationLabel: 'Accueil',
    },
    releases: {
      enabled: true,
      hideWhenEmpty: true,
      showInMenu: true,
      menuLabel: 'Releases',
      navigationLabel: 'Dernières sorties',
    },
    videos: {
      enabled: true,
      hideWhenEmpty: true,
      showInMenu: true,
      menuLabel: 'Videos',
      navigationLabel: 'Dernières vidéos',
    },
    artists: {
      enabled: true,
      hideWhenEmpty: true,
      showInMenu: true,
      menuLabel: 'Artists',
      navigationLabel: 'Artistes',
    },
    shows: {
      enabled: true,
      hideWhenEmpty: true,
      showInMenu: true,
      menuLabel: 'Shows',
      navigationLabel: 'Prochains concerts',
    },
    beats: {
      enabled: true,
      hideWhenEmpty: true,
      showInMenu: true,
      menuLabel: 'BeatStars',
      navigationLabel: 'Instrumentales BeatStars',
    },
  },
  secondaryMenu: {
    asbl: { enabled: true, label: 'ASBL' },
    beats: { enabled: true, label: 'Beats' },
  },
  merch: {
    enabled: false,
    label: 'MERCH',
    shopifyUrl: '',
  },
};
