# Hello Ednah — Guide de développement (Projet Ednah)

> Ce fichier dit à Claude **comment travailler sur ce projet**. Il est généré par la plateforme Ednah à partir du template de référence. Respecte-le à la lettre : tous les projets Ednah suivent la même structure, c'est ce qui permet le déploiement automatique en un clic.

## 🎯 Ce projet en bref
- **Nom** : Hello Ednah
- **Sous-domaine de test** : `hello-ednah.dev.ednah-group.com` (déployé automatiquement)
- **Stack** : Front **React + Vite + TypeScript** · Backend **Node.js + Fastify + TypeScript**
- **Gestionnaire de paquets** : **pnpm** (monorepo)
- Toutes les métadonnées machine : voir `.ednah/project.json`

## ⚠️ CONVENTIONS CRITIQUES (identiques à tous les projets Ednah)

### 📝 Nommage — OBLIGATOIRE
**Tous** les fichiers et dossiers en **kebab-case** (minuscules-avec-tirets) :
- ✅ `src/features/quiz/hooks/use-quiz-state.ts`
- ❌ `src/features/quiz/hooks/useQuizState.ts`

### 🏗️ Séparation des responsabilités
1. **Composants UI** : présentation uniquement, aucun code métier. Ils appellent des hooks.
2. **Hooks custom** : toute la logique (état, calculs, transformations), retournent des valeurs/fonctions simples.
3. **Utils** : fonctions pures réutilisables, sans effet de bord.

### 📊 Taille des fichiers
- ESLint `max-lines` activé sur `src/features/**`, limite **200** lignes (hors blancs/commentaires). Découper si dépassé.

### 🌍 Langue
- Code/identifiants en anglais, **commentaires et docs en français**.

## 📁 Structure
```
apps/
  web/    → front React+Vite (SPA). Build statique dans apps/web/dist
  api/    → backend Fastify. Sert l'API sous /api ET les fichiers statiques du front en prod
.ednah/
  project.json → métadonnées (nom, sous-domaine, repo, stack) — NE PAS supprimer
Dockerfile           → image de prod (multi-stage) utilisée par Coolify
docker-compose.yml   → dev local
```

## 🚀 Commandes
```bash
pnpm install          # installer
pnpm dev              # web + api en parallèle (dev)
pnpm --filter @hello-ednah/web dev
pnpm --filter @hello-ednah/api dev
pnpm build            # build web + api
pnpm lint && pnpm typecheck
```

## 🔌 Backend (Fastify)
- Point d'entrée : `apps/api/src/server.ts`
- Route santé **obligatoire** : `GET /api/health` → `{status:"ok"}` (utilisée par Coolify pour le healthcheck). **Ne jamais la supprimer.**
- Ajoute tes routes dans `apps/api/src/routes/`.
- En production, l'API sert aussi le front buildé (`apps/web/dist`).

## 📦 Déploiement (géré par la plateforme Ednah — ne pas modifier à la main)
- Le déploiement se fait via l'app desktop : push GitHub → API Coolify → build du `Dockerfile` → HTTPS auto sur le domaine choisi.
- Le `Dockerfile` **doit** exposer le port défini par la variable `PORT` (défaut 3000) et l'API **doit** écouter sur `0.0.0.0`.
- Ne change pas la structure des `apps/` ni le `Dockerfile` sans raison : ça casserait le déploiement automatique.

## ✅ Checklist avant déploiement
- [ ] `pnpm build` passe sans erreur
- [ ] `GET /api/health` répond `{status:"ok"}`
- [ ] `pnpm lint` et `pnpm typecheck` OK
