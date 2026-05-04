# 🖥️ Meca Master - Version PC (Windows)

## 🎯 Objectif
Application desktop Windows moderne avec interface latérale et IA intégrée.

---

## 📁 Fichiers

```
version_pc/
├── meca_master.py      ← Application principale (PyQt5)
├── LANCER.bat          ← Lance en mode développement
├── CREE-EXE.bat        ← Crée le fichier .exe
├── venv/               ← Environnement virtuel (créé auto)
├── dist/               ← Fichier .exe généré
└── README.md           ← Ce fichier
```

---

## 🚀 Démarrage Rapide

### Option 1 : Mode Développement (Test rapide)
```bash
Double-clique sur : LANCER.bat
```
L'application s'ouvre directement avec Python.

### Option 2 : Créer un fichier .exe (Distribution)
```bash
Double-clique sur : CREE-EXE.bat
```
Crée un fichier `MecaMaster.exe` autonome que tu peux distribuer.

---

## 🎨 Interface

### Design Moderne
- ✅ Sidebar latéral gauche (280px)
- ✅ Couleurs vibrantes orange/cyan
- ✅ Glassmorphism / Effets néon
- ✅ Animations fluides
- ✅ Responsive (1200x800 minimum)

### Écrans
1. **Accueil** : Dashboard avec véhicule, dépenses, actions rapides
2. **Chat IA** : Interface conversation avec MecaAI
3. **SOS Urgence** : Alerte avec formulaire

---

## 🤖 IA Intégrée

### Fonctionnalités
- Réponses instantanées (< 1s)
- Connaissances mécaniques complètes
- Tarifs Côte d'Ivoire (FCFA)
- Diagnostic basé sur symptômes

### Exemples de questions
```
"Mon moteur fait un bruit bizarre"
"Combien coûte une vidange ?"
"Mon véhicule fume"
"Freins qui grincent"
"Bonjour !"
```

---

## 📦 Compilation en .exe

### Prérequis
- Python 3.8+
- Windows 10/11

### Processus
1. Double-clique `CREE-EXE.bat`
2. Attends 2-5 minutes
3. Le fichier `dist\MecaMaster.exe` est créé
4. Copie-le sur n'importe quel PC Windows

### Taille du fichier
- ~50-80 MB (inclut Python + PyQt5)
- Aucune installation requise
- Fonctionne sur Windows 7/8/10/11

---

## 🛠️ Architecture Technique

```
┌─────────────────────────────────────────┐
│         MecaMaster.exe (PyInstaller)     │
│  ┌────────────────────────────────────┐ │
│  │   Python 3.8+ embarqué             │ │
│  │   PyQt5 (GUI moderne)              │ │
│  │   meca_master.py (logique)         │ │
│  │   Mock AI (réponses intelligentes) │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎮 Raccourcis

| Touche | Action |
|--------|--------|
| Échap | Retour accueil |
| Entrée | Envoyer message (chat) |
| F11 | Plein écran |
| Ctrl+Q | Quitter |

---

## 🔄 Mise à jour

Pour modifier l'application :
1. Édite `meca_master.py`
2. Relance `LANCER.bat` pour tester
3. Relance `CREE-EXE.bat` pour créer l'exe

---

## 🆘 Dépannage

| Problème | Solution |
|----------|----------|
| "Python non trouvé" | Installe Python 3.8+ depuis python.org |
| "PyQt5 erreur" | Supprime le dossier `venv` et relance |
| L'exe ne démarre pas | Installe Visual C++ Redistributable |
| Taille trop grande | Normal (50-80MB), compresse avec UPX |

---

## 🎉 Résumé

- ✅ Interface moderne avec sidebar
- ✅ IA embarquée ultra-rapide
- ✅ Fichier .exe autonome
- ✅ Distribution facile
- ✅ Pas d'installation requise

**Double-clique sur `LANCER.bat` ou `CREE-EXE.bat` et c'est parti !** 🚀
