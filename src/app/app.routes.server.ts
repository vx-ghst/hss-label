import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';
import { publishedArtists } from './core/artists';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'artistes/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.None,
    async getPrerenderParams() {
      return publishedArtists.map(({ slug }) => ({ slug }));
    },
  },
  { path: '**', renderMode: RenderMode.Prerender },
];
