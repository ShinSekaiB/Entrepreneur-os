# Entrepreneur OS

Votre architecte IA pour structurer, analyser et accélérer votre projet entrepreneurial.

## Stack

- **Frontend :** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- **Backend :** Next.js API Routes, Server Actions
- **IA :** DeepSeek V4 Flash Free (via SDK OpenAI compatible)
- **Base de données :** Supabase PostgreSQL + Prisma v7
- **Auth :** Auth.js v4 (email + password credentials, Google OAuth)
- **Déploiement :** Vercel

## Développement

```bash
npm install
npm run dev
```

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Build production (prisma generate + next build) |
| `npm run lint` | Vérifie le code avec ESLint |
| `npm run db:seed` | Peuple la base avec des données de démo |
