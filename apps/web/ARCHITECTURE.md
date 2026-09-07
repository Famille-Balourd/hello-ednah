# Architecture — Feature-Sliced Design (plat)

Ce template `apps/web` suit une variante **plate** de Feature-Sliced Design (FSD).
Ce document est la **référence structurelle** : à respecter pour tout nouveau code.
Les explications sont en français ; le **code reste en anglais**, les **fichiers/dossiers en kebab-case**.

## Stack technique

- **React 19** + **Vite** (standard : `vite` + `@vitejs/plugin-react`) + **TypeScript 5.6**
- **Tailwind CSS v4** via `@tailwindcss/vite`
- **pnpm** (template universel, fiable en CI/Docker — ni `vite-plus`, ni `bun`)
- Data layer : **@tanstack/react-query 5**, **zustand 5**, **react-hook-form 7** + `@hookform/resolvers` + **zod 4**
- Routing : **react-router 7** — HTTP : **axios** — classes : **classnames** + **tailwind-merge**
- Lint : **eslint** (flat config) — Format : **prettier** (4 espaces, pas de point-virgule, single quotes)

Le build sort dans **`dist/`** (le backend Fastify sert `apps/web/dist` en production).
Proxy dev : `/api` → `http://localhost:3000`.

## Couches (`src/`)

```
src/
├─ app/        Shell applicatif. Seule couche autorisée à connaître toutes les features :
│              main.tsx · app.tsx ·
│              providers/  (providers globaux : query-provider…) ·
│              routes/     (router + route-renderer = ErrorBoundary par route)
├─ shared/     Code réutilisable transverse, ZÉRO dépendance métier :
│              components/ui/ (primitives : button, error-boundary, error-fallback…) ·
│              lib/ (utils génériques : cn) ·
│              api/ (axios, query-client, validate-response) ·
│              config/ (constantes)
├─ entities/   Modèles métier RÉELS réutilisés par >= 2 features :
│              <entity>/{model.ts, api.ts, ui/, index.ts}. Ex : user, customer, product.
│              ⚠️ Un service API de domaine (sans modèle) N'EST PAS un entity → shared/api/.
└─ features/   Les features (plat — voir plus bas).
```

### Règle de dépendance (direction STRICTEMENT descendante)

`app → features → entities → shared`. Jamais l'inverse.

- Une feature **n'importe jamais** une autre feature d'un domaine différent. Le partage passe
  par `entities/` ou `shared/`.
- `shared/` et `entities/` **n'importent jamais** `@app` ni `@features`.
- Accès via l'`index.ts` (API publique) : pas de deep-import cross-feature.

Aliases : `@app` `@features` `@entities` `@shared` (+ `@/`), déclarés dans `vite.config.ts` **et** `tsconfig.json`.

## Structure d'une feature

Chaque feature suit cette structure interne. **On ne crée pas de fichiers/dossiers vides** :
pas de config → pas de `config.ts` ; pas de hooks → pas de `hooks/`.

```
features/<feature>/
├─ ui/                Toute l'UI, en deux dossiers :
│  ├─ pages/          Les pages / écrans (points d'entrée routés)
│  └─ components/     Les composants liés à ces pages
├─ hooks/             Les HOOKS de logique uniquement (use-* : forms, colonnes, logique d'écran)
├─ state/             Les STORES (zustand) et CONTEXTS de la feature
├─ utils/             Utilitaires purs de la feature (ou utils.ts si un seul fichier)
├─ types.ts           Les types de la feature
├─ config.ts          Constantes / config propres à la feature
└─ index.ts           API publique (ce que la feature expose)
```

Principes :

- **La logique vit dans `hooks/`** (pas dans les composants). L'`ui/` consomme les hooks.
- **`hooks/` ≠ `state/`** : un hook (`use-*`) n'est pas un store. Les stores zustand et les
  contexts vont dans `state/`, jamais dans `hooks/`.
- **Pas de composant « à plat » directement dans `ui/`** : soit une **page** (`ui/pages/`),
  soit un composant lié (`ui/components/`).

Exemple de référence : la feature `home` (`hooks/use-home.ts` + `ui/pages/home-page.tsx`).

## Plat + feature principale

Les sous-domaines sont **aplatis** au niveau `features/` avec un préfixe :
`features/crypto-dashboard`, `features/crypto-assets`, … (pas `crypto/dashboard`).

Quand plusieurs sous-features d'un même domaine partagent du code, la partie commune vit dans la
**feature principale** (`features/crypto/`), qui la **redescend** aux sous-features via son `index.ts`.
Si le seul point commun est l'appel API du domaine, il vit dans `entities/<domaine>/api`.

## Data & validation (data layer)

Le data-fetching passe par **TanStack Query**, **mock-first** mais prêt pour une vraie API.

```
composant → useQuery (cache + revalidation)
              → service (shared/api ou entities/<entity>/api)
                 → axios (+ intercepteurs)
```

- **Le fetch vit dans `hooks/`** : `useQuery({ queryKey, queryFn })`. La `queryKey` est un
  **tableau** (ids dynamiques en éléments). Pour le chargement on expose **`isLoading`** (drapeau
  dérivé), **pas `isPending`** (qui ne se résout jamais sur une query `enabled:false`).
- **Validation Zod runtime** : un schéma Zod est la source de vérité ; les types sont **inférés**
  via `z.infer`, et la `queryFn` valide la réponse via **`shared/api/validate-response.ts`**
  (`validateResponse(schema, data, context)`). Une réponse non conforme → log + état d'erreur,
  **jamais un crash**.
- **Le service renvoie `unknown`** : c'est le schéma qui garantit le type (pas un cast).

## Résilience — gestion des erreurs

Un crash de rendu dans un seul composant ne doit jamais faire tomber toute l'app.

```
crash de rendu       → ErrorBoundary (racine + par-route) → UI de repli, l'app reste debout
query/fetch en échec → état isError + QueryCache.onError (log central)
mauvaise forme API   → Zod validateResponse (safeParse) → erreur gérée, jamais un crash
```

- **`ErrorBoundary`** (`shared/components/ui/error-boundary.tsx`) — composant classe
  (`getDerivedStateFromError` + `componentDidCatch`) ; rend `ErrorFallback`, se réinitialise
  quand sa `key` change.
- **Boundary racine** (`app/main.tsx`) — enveloppe toute l'app.
- **Boundary par-route** (`app/routes/route-renderer.tsx`) — **keyé par `routeKey`** : une page
  qui plante affiche un fallback contenu, le reste de l'app reste utilisable ; naviguer réinitialise.
- **`ErrorFallback`** (`shared/components/ui/error-fallback.tsx`) — UI « Une erreur est survenue »
  avec bouton _Réessayer_ (variante `compact` pour le cas par-route).
- **Erreurs de query globales** — `QueryCache.onError` dans `shared/api/query-client.ts`
  centralise le log ; brancher le monitoring ici.

## Taille des fichiers — règle des 200 lignes max

Un fichier de `src/features/**` fait **au plus 200 lignes de code** (eslint `max-lines: error`,
options `skipBlankLines` + `skipComments` → on compte le code réel, pas les blancs/commentaires).
Au-delà, on **découpe** :

- les **constantes / config** sortent dans `config.ts`,
- les **types** dans `types.ts`,
- la **logique** (schémas zod, handlers, useForm/useQuery/useState) dans un **hook** `hooks/use-<name>.ts`,
- l'**UI** est découpée en sous-composants `ui/components/`.

## Vérifications

`pnpm check` (lint + typecheck) doit être vert. `pnpm build` doit passer.
Aucun import remontant : `grep -rn "@features\|@app" src/shared src/entities` doit être vide.
