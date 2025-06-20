# Mon Micro-site

## Structure
- `pages/`: Pages HTML (`analytics.html`, `classement.html`, `generateur-bouton.html`, `menu-outils.html`, `question-admin.html`)
- `css/main.css`: Styles globalisés
- `js/`: Code JavaScript (`app.js` + modules)
- `includes/sidebar.html`: Template de la sidebar
- `dist/`: Assets générés (après `npm run build`)

## Installation
```bash
npm install
```

## Développement
```bash
npm run dev
```

## Production
```bash
npm run build
```

Déployer manuellement les fichiers sur S3 en respectant l’arborescence, puis invalider CloudFront pour voir les mises à jour.