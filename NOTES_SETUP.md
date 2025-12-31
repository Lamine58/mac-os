# Configuration du système de notes en ligne

Le système de notes permet aux visiteurs de laisser des messages qui sont sauvegardés en ligne.

## Configuration avec JSONBin.io (Recommandé)

### Étape 1 : Créer un compte JSONBin.io
1. Allez sur [https://jsonbin.io/](https://jsonbin.io/)
2. Créez un compte gratuit
3. Créez un nouveau "Bin" (conteneur JSON)

### Étape 2 : Obtenir les clés API
1. Dans votre dashboard JSONBin.io, allez dans "API Keys"
2. Créez une nouvelle clé API (Master Key)
3. Copiez la clé API (elle commence par `$2b$10$...`)

### Étape 3 : Obtenir l'ID du Bin
1. Après avoir créé un bin, l'ID se trouve dans l'URL
2. L'URL ressemble à : `https://jsonbin.io/app/bins/XXXXXXXXXXXXX`
3. L'ID est la partie après `/bins/`

### Étape 4 : Configurer le composable
Ouvrez le fichier `composables/useNotesStorage.ts` et remplacez :

```typescript
const JSONBIN_BIN_ID = 'YOUR_BIN_ID_HERE'
const JSONBIN_API_KEY = '$2b$10$YOUR_API_KEY_HERE'
```

Par vos vraies valeurs :

```typescript
const JSONBIN_BIN_ID = 'votre-id-bin-ici'
const JSONBIN_API_KEY = '$2b$10$votre-cle-api-ici'
```

## Fonctionnement sans configuration

Si vous ne configurez pas JSONBin.io, le système utilisera automatiquement le **localStorage** du navigateur comme solution de secours. Les notes seront sauvegardées localement sur chaque appareil, mais ne seront pas partagées entre les visiteurs.

## Fonctionnalités

- ✅ Sauvegarde automatique après chaque modification
- ✅ Indication visuelle de la sauvegarde
- ✅ Champ pour le nom du visiteur (optionnel)
- ✅ Affichage de la date et de l'auteur de chaque note
- ✅ Message d'information pour les visiteurs
- ✅ Fallback sur localStorage si JSONBin.io n'est pas configuré

## Alternative : Utiliser une autre solution

Si vous préférez utiliser un autre service (Firebase, Supabase, etc.), vous pouvez modifier le composable `useNotesStorage.ts` pour utiliser l'API de votre choix.

