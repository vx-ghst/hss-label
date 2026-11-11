import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { artists } from './core/content';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'artistes/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    async getPrerenderParams() {
      return artists.map(({ slug }) => ({ slug }));
    },
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
