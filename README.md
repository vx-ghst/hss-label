# HighSchool Surgery · Prototype J1

Accueil du label en six sections, trois fiches artistes fictives, pages ASBL et Beats, et deux pages légales de démonstration. L’identité typographique de l’accueil est provisoire.

## Installer et lancer dans VS Code

Installer Node.js 24 avec npm, puis ouvrir le dossier qui contient `angular.json` dans VS Code. L’extension Angular Language Service est proposée dans le workspace.

```sh
npm ci
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200). Le serveur de développement recharge les fichiers modifiés. Dans un second terminal du même dossier :

```sh
npm test -- --watch=false
npm run build
```

Le build écrit les pages statiques dans `dist/hss-label/browser/`. Pour prévisualiser exactement ce dossier avec Python 3 (facultatif) :

```sh
python -m http.server 8080 --directory dist/hss-label/browser
```

Ouvrir [http://localhost:8080](http://localhost:8080) puis essayer directement [une fiche artiste](http://localhost:8080/artistes/atlas-gris/). Le serveur de prévisualisation sert des fichiers statiques. Aucun processus Angular SSR n’est requis pour les servir.

## Suivre le code

| Fichier                        | Rôle                                                                               |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `src/app/app.html` et `app.ts` | En-tête fixe, menu mobile, outlet Angular et pied de page communs.                 |
| `src/app/home/home.html`       | Structure et ancres des six sections.                                              |
| `src/app/home/home.ts`         | Signal de section active, IntersectionObserver et commandes du carrousel artistes. |
| `src/app/home/home.scss`       | Grilles, défilement horizontal natif et snap vertical de proximité sur bureau.     |
| `src/app/core/content.ts`      | Données fictives et réglages des liens externes. Relations par slug.               |
| `src/app/pages/`               | Composants standalone pour les pages secondaires.                                  |
| `src/app/app.routes.ts`        | Routes chargées à la demande et titres des pages.                                  |
| `src/app/app.routes.server.ts` | Slugs artistes transmis à Angular au build pour générer les fichiers HTML.         |
| `src/styles.scss`              | Palette, typographie, focus et styles partagés.                                    |

Angular pré-rend le HTML avec `outputMode: "static"`. Dans le navigateur, l’hydratation active les interactions et les appels liés au DOM démarrent après le rendu. Le carrousel s’appuie sur le défilement natif pour le swipe et sur des boutons et les flèches clavier pour changer d’artiste. Sur mobile, la page défile librement à la verticale. Les dates de concert sont comparées à la date du rendu et les concerts passés sont masqués. Une reconstruction actualise aussi les fichiers HTML statiques.

## Vérifier le prototype

- Naviguer avec les points, les flèches et le menu. Tester aussi `/#artists` et le retour à l’accueil depuis une fiche.
- Sur mobile, vérifier l’ouverture du menu, le scroll vertical et le balayage horizontal de la section Artists.
- Au clavier, parcourir les contrôles avec Tab, puis utiliser les flèches gauche/droite quand le carrousel a le focus.
- Ouvrir directement `/asbl/`, `/beats/` et chaque fiche artiste depuis le build statique.

## Périmètre

Les pochettes, les artistes, les concerts et le catalogue sont des exemples. Les vidéos sont représentées par des vignettes de démonstration. Les liens Shopify et BeatStars s’affichent si leurs URL sont renseignées dans `core/content.ts`. Les lecteurs et les liens officiels seront ajoutés au jalon d’intégration.

Sveltia servira à modifier des entrées structurées et à prévisualiser leur contenu. Les composants Angular et le SCSS continueront à définir la mise en page. Les aperçus de déploiement permettront de revoir les pages Angular complètes avant publication. Le raccordement du CMS, de GitLab et de Cloudflare est prévu après la validation visuelle.

## Crédits du prototype

Les photos de scène illustrent des profils fictifs.

- [Steven Erixon](https://unsplash.com/photos/a-silhouette-of-a-man-singing-into-a-microphone-IzwvpT7gGgU)
- [Ivaldo Hadi](https://unsplash.com/photos/a-black-and-white-photo-of-a-person-singing-into-a-microphone-9JfZAIwZYaY)
- [Porus Nagare](https://unsplash.com/photos/silhouette-of-a-singer-performing-on-stage-UG8ThdtTTRA)
- Police Barlow Condensed sous SIL Open Font License. Licence incluse dans `public/media/`.
