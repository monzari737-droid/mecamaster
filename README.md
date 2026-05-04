# 🚀 Meca Master

**Meca Master** est une application web progressive (PWA) complète de mise en relation entre propriétaires de véhicules, mécaniciens et entreprises du secteur automobile.

## ✨ Fonctionnalités

### Pour les Utilisateurs (Clients)
- 🆘 **SOS Panné** - Demandez de l'aide en cas de panne avec géolocalisation temps réel
- 🔧 **Trouver un mécanicien** - Recherche par spécialité, distance et disponibilité
- 🛒 **Marketplace** - Achetez des pièces détachées auprès de vendeurs vérifiés
- 📊 **Dashboard** - Suivi des dépenses, historique des interventions
- 🚗 **Carnet de santé** - Historique complet des réparations du véhicule

### Pour les Mécaniciens
- 📍 **Missions SOS** - Acceptez des demandes d'urgence à proximité
- 💰 **Gestion financière** - Suivi des revenus, dépôts et retraits
- 📈 **Statistiques** - Graphiques de revenus, classement
- 🏢 **Affiliations** - Postulez dans des garages partenaires
- ⭐ **Système de notation** - Évaluations par les clients

### Pour les Entreprises (Garages / Vendeurs)
- 📦 **Gestion de stock** - Suivi des pièces, alertes stock faible
- 📋 **Gestion des commandes** - Traitement des commandes clients
- 👥 **Recrutement** - Gérez vos mécaniciens affiliés
- 📊 **Analytics** - Revenus, tendances de vente
- 💳 **Abonnements** - Visibilité premium sur la plateforme

### Fonctionnalités Globales
- 🤖 **Assistant IA** - Diagnostic de pannes, conseils d'entretien, support
- 🗺️ **Géolocalisation** - Carte temps réel, matching intelligent
- 🔔 **Notifications push** - Alertes SOS, commandes, messages
- 📱 **PWA** - Installable sur Android et PC, fonctionne offline
- 🔐 **Sécurité** - Authentification JWT, chiffrement des données

## 🛠️ Stack Technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Animations** | Framer Motion |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Drizzle ORM |
| **Auth** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Maps** | Google Maps API |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **PWA** | next-pwa |

## 📁 Structure du Projet

```
meca-master/
├── src/
│   ├── app/                    # Routes Next.js (App Router)
│   │   ├── auth/              # Authentification (login, register)
│   │   ├── dashboard/           # Dashboard utilisateur
│   │   ├── mechanic-dashboard/  # Dashboard mécanicien
│   │   ├── enterprise-dashboard/# Dashboard entreprise
│   │   ├── sos/                 # Fonctionnalité SOS
│   │   ├── mechanics/           # Liste des mécaniciens
│   │   ├── marketplace/         # Marketplace pièces
│   │   └── profile/             # Profil utilisateur
│   ├── components/
│   │   ├── ui/                  # Composants UI (shadcn style)
│   │   ├── navigation/          # Navigation (bottom nav)
│   │   ├── ai/                  # Assistant IA
│   │   └── providers/           # Providers (toast, etc.)
│   ├── lib/
│   │   ├── db/                  # Schéma Drizzle + connexion
│   │   ├── utils.ts             # Utilitaires
│   │   └── supabase.ts          # Client Supabase
│   ├── types/                   # Types TypeScript
│   └── hooks/                   # Hooks React personnalisés
├── public/                      # Assets statiques
│   ├── manifest.json            # PWA manifest
│   └── icons/                   # Icônes PWA
├── package.json
├── tailwind.config.ts
├── next.config.js
└── drizzle.config.ts
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase (pour la base de données)

### Installation

1. **Cloner le projet**
```bash
cd meca-master
npm install
```

2. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

Remplir les variables dans `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
DATABASE_URL=your_database_url
OPENAI_API_KEY=your_openai_api_key
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

3. **Initialiser la base de données**
```bash
npm run db:push
```

4. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📱 Installation PWA

### Android
1. Ouvrez l'application dans Chrome
2. Tapez sur "Ajouter à l'écran d'accueil"
3. L'application s'installe comme une app native

### PC (Windows/Mac/Linux)
1. Ouvrez l'application dans Chrome/Edge
2. Cliquez sur l'icône d'installation dans la barre d'adresse
3. L'application s'installe et peut être lancée depuis le bureau

## 🔧 Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Dans l'éditeur SQL, exécutez les migrations générées par Drizzle
3. Activez l'authentification par email
4. Configurez le stockage pour les uploads de documents
5. Activez les politiques RLS (Row Level Security) appropriées

## 🎨 Design System

### Couleurs par Rôle
- **Global/Accueil** : Blanc + Orange (#FF8C42)
- **Utilisateur** : Blanc + Vert (#2ECC71)
- **Mécanicien** : Blanc + Bleu (#3498DB)
- **Entreprise** : Blanc + Orange (#E67E22)

### Composants Clés
- **Bottom Navigation** - Navigation mobile avec bouton SOS
- **Cards** - Cards avec ombres subtiles, hover effects
- **Buttons** - Variantes par rôle, états loading
- **Forms** - Validation en temps réel, uploads

## 🧪 Tests

```bash
# Lancer les tests unitaires
npm test

# Linter
npm run lint
```

## 📦 Build Production

```bash
npm run build
```

Les fichiers statiques seront générés dans le dossier `dist/` (ou `.next/` pour Vercel).

## 🚢 Déploiement

### Vercel (Recommandé)
```bash
npm i -g vercel
vercel
```

### Autres plateformes
Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 Fonctionnalités à Venir

- [ ] Intégration paiement mobile (Orange Money, Wave, etc.)
- [ ] Chat temps réel entre utilisateurs et mécaniciens
- [ ] Système de parrainage
- [ ] Programme de fidélité
- [ ] Application mobile native (React Native)
- [ ] Multi-langues (FR, EN, ES)
- [ ] Mode sombre

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer:

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/amazing-feature`)
3. Committez vos changements (`git commit -m 'Add amazing feature'`)
4. Poussez vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

- **Développement** - [Votre nom]
- **Design** - [Designer]
- **Product** - [Product Manager]

## 📞 Support

Pour toute question ou support:
- Email: support@meca-master.com
- Documentation: https://docs.meca-master.com
- Discord: [Lien Discord]

---

**Meca Master** - Votre mécanicien en un clic 🔧🚗
