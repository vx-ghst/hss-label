import { Routes } from '@angular/router';
import { findPublishedArtistBySlug } from './core/artists';
import { site } from './core/content';

export const routes: Routes = [
  {
    path: '',
    title: site.name,
    loadComponent: () => import('./home/home').then((module) => module.Home),
  },
  {
    path: 'artistes/:slug',
    title: (route) =>
      findPublishedArtistBySlug(route.paramMap.get('slug') ?? '')?.name ?? 'Artiste introuvable',
    loadComponent: () => import('./pages/artist').then((module) => module.ArtistPage),
  },
  {
    path: 'asbl',
    title: 'ASBL · HSS',
    loadComponent: () => import('./pages/asbl').then((module) => module.AsblPage),
  },
  {
    path: 'beats',
    title: 'Beats · HSS',
    loadComponent: () => import('./pages/beats').then((module) => module.BeatsPage),
  },
  {
    path: 'mentions-legales',
    title: 'Mentions légales · HSS',
    data: { heading: 'Mentions légales' },
    loadComponent: () => import('./pages/info').then((module) => module.InfoPage),
  },
  {
    path: 'confidentialite',
    title: 'Confidentialité · HSS',
    data: { heading: 'Confidentialité' },
    loadComponent: () => import('./pages/info').then((module) => module.InfoPage),
  },
  {
    path: '**',
    title: 'Page introuvable · HSS',
    data: { heading: 'Page introuvable', missing: true },
    loadComponent: () => import('./pages/info').then((module) => module.InfoPage),
  },
];
