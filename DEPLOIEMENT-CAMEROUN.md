# 🇨🇲 MECA MASTER - Déploiement Cameroun

## Phase 1 : Mise en ligne (Guide complet)

---

## 🎯 Objectif de la Phase 1

**En 2-3 jours, avoir :**
- ✅ Backend déployé sur Railway (URL accessible)
- ✅ Frontend déployé sur Vercel (site web en ligne)
- ✅ Base de données Neon connectée
- ✅ App fonctionnelle sur téléphone
- ✅ Nom de domaine (optionnel mais recommandé)

---

## 📋 Prérequis (Gratuits)

### 1. Créer ces comptes (5 minutes chacun)

| Service | Lien | Utilisation |
|---------|------|-------------|
| **GitHub** | github.com | Stocker le code |
| **Railway** | railway.app | Héberger le backend Python |
| **Vercel** | vercel.com | Héberger le frontend |
| **Neon** | neon.tech | Base de données (déjà fait) |

### 2. Installer sur ton PC
- Git : https://git-scm.com/download/win
- Node.js : https://nodejs.org (version LTS)

---

## 🚀 ÉTAPE 1 : Préparer le code

### 1.1 Créer un dépôt GitHub

```bash
# Ouvrir terminal dans le dossier meca-master
cd "C:\Users\user\Desktop\MECA MASTER\meca-master"

# Initialiser Git
git init
git add .
git commit -m "Version initiale - Cameroun"

# Créer repo sur GitHub, puis :
git remote add origin https://github.com/TON-USERNAME/mecamaster.git
git branch -M main
git push -u origin main
```

### 1.2 Vérifier les fichiers backend

S'assurer que `backend/` contient :
```
backend/
├── main.py              ✅ Déjà créé
├── database.py          ✅ Déjà créé
├── config.py            ✅ Déjà créé
├── requirements.txt     ✅ Déjà créé
├── railway.json         ✅ Créé ci-dessus
├── Procfile            ✅ Créé ci-dessus
└── runtime.txt         ✅ Créé ci-dessus
```

---

## 🚀 ÉTAPE 2 : Déployer le Backend (Railway)

### 2.1 Connexion

1. Aller sur https://railway.app
2. Cliquer "Start for Free" (compte GitHub)
3. Autoriser l'accès à tes dépôts

### 2.2 Créer le projet

1. Dashboard → "New Project"
2. Choisir "Deploy from GitHub repo"
3. Sélectionner `mecamaster`
4. Cliquer sur le projet créé

### 2.3 Configurer les variables d'environnement

Dans l'interface Railway :
1. Aller dans l'onglet "Variables"
2. Ajouter ces variables :

```
DATABASE_URL=postgresql://neondb_owner:npg_RPcWpaz4Z5uo@ep-bitter-bird-al979aun-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require
SECRET_KEY=meca_master_secret_key_2024_cameroon_secure
OPENAI_API_KEY=sk-proj-votre-cle-openai (à obtenir sur openai.com)
ANTHROPIC_API_KEY=sk-ant-votre-cle-claude (à obtenir sur console.anthropic.com)
ENVIRONMENT=production
```

### 2.4 Déployer

1. Railway va déployer automatiquement
2. Attendre que le statut soit "Success" (2-3 minutes)
3. Aller dans "Settings" → "Domains"
4. Copier l'URL générée (ex: `https://mecamaster.up.railway.app`)
5. **C'est ton API !** 🎉

### 2.5 Tester l'API

Ouvrir dans navigateur :
```
https://mecamaster.up.railway.app/health
```

Devrait afficher :
```json
{"status": "healthy", "timestamp": "..."}
```

---

## 🚀 ÉTAPE 3 : Déployer le Frontend (Vercel)

### 3.1 Préparation

Créer `vercel.json` à la racine de `meca-master/` :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### 3.2 Mettre à jour l'URL de l'API

Dans `src/lib/api.ts`, modifier :

```typescript
// Ancien
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Nouveau - remplacer par ton URL Railway
const API_URL = 'https://mecamaster.up.railway.app'; // ← Ton URL
```

### 3.3 Déploiement Vercel

1. Aller sur https://vercel.com
2. Cliquer "Add New Project"
3. Importer depuis GitHub (mecamaster)
4. Configurer :
   - Framework Preset : Next.js
   - Root Directory : ./
5. Cliquer "Deploy"
6. Attendre 2-3 minutes
7. **Tu as un site web en ligne !** 🎉

### 3.4 Tester

Ouvrir l'URL Vercel sur ton téléphone :
```
https://mecamaster.vercel.app
```

---

## 🚀 ÉTAPE 4 : Nom de domaine (Optionnel mais pro)

### Option A : Domaine gratuit (Freenom)

1. Aller sur https://freenom.com
2. Chercher `mecamaster.tk` ou `mecamaster.ml`
3. Commander gratuitement (12 mois renouvelables)
4. Dans Vercel : Settings → Domains → Add Domain
5. Suivre les instructions DNS

### Option B : Domaine payant (Recommandé)

**Pour le Cameroun :**
- `.cm` : https://nic.cm (15 000 - 30 000 FCFA/an)
- `.com` : Namecheap.com (~12 000 FCFA/an)

**Configuration :**
1. Acheter le domaine
2. Dans Vercel : Settings → Domains
3. Ajouter `mecamaster.cm`
4. Configurer les DNS chez ton registrar

---

## 🚀 ÉTAPE 5 : Adaptation Cameroun

### 5.1 Modifier les tarifs (Prix Cameroun)

Dans `backend/main.py`, section `knowledge` :

```python
# Tarifs Cameroun (adaptés)
tarifs_cameroun = {
    "vidange": "20 000 - 35 000 FCFA",
    "plaquettes_frein": "25 000 - 40 000 FCFA",
    "pneu": "30 000 - 70 000 FCFA",
    "diagnostic": "10 000 - 20 000 FCFA",
    "main_oeuvre": "5 000 - 15 000 FCFA/heure"
}

# Zones populaires Douala/Yaoundé
zones = [
    "Bonapriso", "Akwa", "Deido",  # Douala
    "Bastos", "Mvogbi", "Ekounou"   # Yaoundé
]
```

### 5.2 Intégrer MTN Mobile Money (Phase 2)

Pour l'instant, préparer le terrain. MTN Cameroon API :
- Documentation : https://developer.mtn.com
- Ou utiliser **PayTech** (plus simple pour les devs)

---

## ✅ Vérification finale

### Tests à faire :

| Test | Comment | Résultat attendu |
|------|---------|------------------|
| API accessible | Ouvrir `/health` | `{"status": "healthy"}` |
| Site web | Ouvrir URL Vercel | Page d'accueil s'affiche |
| Sur téléphone | Ouvrir URL sur mobile | Responsive OK |
| Chat IA | Envoyer message | Réponse en < 3s |
| Connexion | Créer un compte | Utilisateur créé en BDD |

---

## 🎯 Prochaines étapes (Phase 2)

Une fois déployé :

1. **Créer une landing page** "Coming Soon"
   - Collecter emails des intéressés
   - Compte à rebours lancement

2. **Inscrire 10 beta testeurs**
   - Garages de Douala/Yaoundé
   - Particuliers avec plusieurs véhicules

3. **Intégrer paiement**
   - Orange Money CM
   - MTN Mobile Money

4. **Marketing**
   - Page Facebook Meca Master Cameroon
   - Instagram avec photos avant/après réparations
   - WhatsApp Business pour support

---

## 📞 Support Cameroun

Si tu bloques :

| Problème | Solution |
|----------|----------|
| Railway ne déploie pas | Vérifier `requirements.txt` complet |
| Erreur base de données | Vérifier `DATABASE_URL` dans variables |
| Vercel 404 | Vérifier `vercel.json` et structure Next.js |
| Chat IA ne répond pas | Vérifier clé API OpenAI |

---

## 💰 Budget Phase 1 (Cameroun)

| Dépense | Coût | Statut |
|---------|------|--------|
| Hébergement Railway | Gratuit (500h/mois) | ✅ |
| Hébergement Vercel | Gratuit | ✅ |
| Base de données Neon | Gratuit (déjà fait) | ✅ |
| API OpenAI | ~$5 (3 000 FCFA) | 🔄 Phase 2 |
| Nom de domaine .cm | 20 000 FCFA | 🔄 Optionnel |
| **TOTAL** | **0 FCFA** | 🎉 |

---

## 🚀 C'est parti !

**Commence par créer les comptes Railway + Vercel + GitHub maintenant !**

Tu veux que je t'aide sur quelle étape spécifiquement ?
1. Configuration GitHub
2. Déploiement Railway
3. Déploiement Vercel
4. Configuration nom de domaine
