# 📁 Structure de Meca Master

## ❓ Pourquoi pas de fichiers HTML ?

**Meca Master** utilise **Next.js**, un framework moderne qui :
- Génère automatiquement les pages HTML
- Utilise **TypeScript (.tsx)** au lieu de HTML
- Crée une Single Page Application (SPA)

### Explication simple :
```
Fichiers .tsx → Next.js → Pages HTML automatiques
```

Tu écris du **React/TypeScript**, Next.js génère le HTML pour toi !

---

## 🗂️ Arborescence des fichiers

```
meca-master/
│
├── 📄 start.html              ← FICHIER D'AIDE (pour toi)
├── 📄 START.bat               ← Double-clique pour lancer !
├── 📄 STRUCTURE.md            ← Ce fichier
│
├── 📁 src/                    ← CODE SOURCE
│   ├── 📄 index.ts            ← INDEX CENTRAL (exporte tout)
│   │
│   ├── 📁 app/                ← PAGES DU SITE
│   │   ├── 📄 page.tsx        ← Page d'accueil (/)
│   │   ├── 📁 auth/
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.tsx     ← /auth/login
│   │   │   └── 📁 register/
│   │   │       └── 📄 page.tsx     ← /auth/register
│   │   ├── 📁 dashboard/
│   │   │   └── 📄 page.tsx         ← /dashboard
│   │   ├── 📁 mechanic-dashboard/
│   │   │   └── 📄 page.tsx         ← /mechanic-dashboard
│   │   ├── 📁 enterprise-dashboard/
│   │   │   └── 📄 page.tsx         ← /enterprise-dashboard
│   │   ├── 📁 sos/
│   │   │   └── 📄 page.tsx         ← /sos
│   │   ├── 📁 mechanics/
│   │   │   └── 📄 page.tsx         ← /mechanics
│   │   ├── 📁 marketplace/
│   │   │   └── 📄 page.tsx         ← /marketplace
│   │   └── 📁 profile/
│   │       └── 📄 page.tsx         ← /profile
│   │
│   ├── 📁 components/           ← COMPOSANTS REUTILISABLES
│   │   ├── 📁 ui/               ← Boutons, Cards, Inputs...
│   │   │   ├── 📄 button.tsx
│   │   │   ├── 📄 card.tsx
│   │   │   ├── 📄 input.tsx
│   │   │   ├── 📄 badge.tsx     ← ⚠️ Corrige les erreurs ici
│   │   │   ├── 📄 avatar.tsx
│   │   │   ├── 📄 toast.tsx
│   │   │   └── 📄 label.tsx
│   │   ├── 📁 navigation/
│   │   │   └── 📄 bottom-nav.tsx   ← Barre navigation mobile
│   │   ├── 📁 ai/
│   │   │   └── 📄 ai-assistant.tsx ← 🤖 Chatbot IA
│   │   └── 📁 providers/
│   │       └── 📄 toast-provider.tsx
│   │
│   ├── 📁 lib/                  ← LOGIQUE & CONFIGURATION
│   │   ├── 📄 utils.ts          ← Fonctions utilitaires
│   │   ├── 📄 brain.ts          ← 🧠 CERVEAU CENTRAL
│   │   ├── 📄 supabase.ts       ← Connexion base de donnees
│   │   └── 📁 db/
│   │       ├── 📄 schema.ts     ← Structure base de donnees
│   │       └── 📄 index.ts      ← Connexion Drizzle
│   │
│   ├── 📁 hooks/                ← HOOKS REACT
│   │   └── 📄 use-toast.ts      ← Gestion notifications
│   │
│   └── 📁 types/                ← TYPES TYPESCRIPT
│       └── 📄 index.ts          ← Definitions de types
│
├── 📁 public/                   ← FICHIERS STATIQUES
│   ├── 📄 manifest.json         ← Config PWA
│   ├── 📄 favicon.ico
│   └── 📁 icons/                ← Icônes de l'app
│
├── 📄 package.json              ← Dependances npm
├── 📄 next.config.js            ← Configuration Next.js
├── 📄 tailwind.config.ts        ← Configuration Tailwind CSS
├── 📄 tsconfig.json             ← Configuration TypeScript
├── 📄 drizzle.config.ts         ← Configuration base de donnees
└── 📄 README.md                 ← Documentation complete
```

---

## 🎯 Les fichiers les plus importants

| Fichier | Rôle |
|---------|------|
| `src/lib/brain.ts` | 🧠 **CERVEAU** - Connecte tout l'application |
| `src/index.ts` | 📦 **INDEX** - Exporte tous les modules |
| `src/lib/db/schema.ts` | 🗃️ **DATABASE** - Structure des tables |
| `START.bat` | ⚡ **LANCER** - Double-clique pour demarrer |
| `start.html` | ❓ **AIDE** - Guide de demarrage |

---

## 🚀 Comment lancer ?

### Méthode 1 : Double-clic (Facile)
1. Double-clique sur **START.bat**
2. Attends l'installation
3. Ouvre http://localhost:3000

### Méthode 2 : Terminal
```powershell
cd "meca-master"
npm install
npm run dev
```

---

## 📝 Rappel : Technologies utilisées

- **Next.js 14** (Framework React)
- **TypeScript** (Langage)
- **Tailwind CSS** (Styling)
- **Supabase** (Base de données)
- **Framer Motion** (Animations)

**PAS DE :** Python, Java, C, HTML statique

---

## ❓ Problèmes courants

### "nnpm not found"
→ Tu as tapé `nnpm` au lieu de `npm`

### "Execution des scripts désactivée"
→ Ouvre PowerShell en admin et tape :
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Cannot find module"
→ Fais `npm install` dans le dossier meca-master

---

Tu as maintenant le **CERVEAU** 🧠 et toute la structure !
