# 🤖 Meca Master - Version Android

## 🎯 Objectif
Application mobile Android native avec Kivy/Python.

---

## 📁 Fichiers

```
version_android/
├── main.py              ← Application Kivy
├── buildozer.spec       ← Configuration compilation APK
├── LANCER.bat          ← Test sur PC (fenêtre mobile)
├── requirements.txt    ← Dépendances Python
└── README.md           ← Ce fichier
```

---

## 🚀 Démarrage

### Option 1 : Test sur PC (Simulation)
```bash
Double-clique sur : LANCER.bat
```
Ouvre l'app dans une fenêtre 360x720 (format téléphone).

### Option 2 : Compiler APK (Vrai Android)
**Nécessite Linux/WSL** (Buildozer ne fonctionne que sur Linux)

```bash
# Sur Linux ou WSL (Windows Subsystem for Linux)
cd version_android
buildozer android debug

# Le fichier APK sera dans bin/
```

---

## 📱 Interface Mobile

### Design
- ✅ Interface mobile native
- ✅ Sidebar menu hamburger
- ✅ Couleurs vibrantes orange/cyan
- ✅ Touch-friendly
- ✅ Responsive (téléphone + tablette)

### Écrans
1. **Splash** : Animation de chargement
2. **Accueil** : Dashboard avec véhicule, actions rapides
3. **Chat IA** : Conversation avec MecaAI
4. **SOS Urgence** : Formulaire d'alerte

---

## 🤖 IA Mobile

Même intelligence que la version PC/Web :
- Réponses instantanées
- Connaissances mécaniques
- Tarifs Côte d'Ivoire
- Diagnostic automobile

---

## 📦 Compilation APK

### Prérequis
- Linux Ubuntu 20.04+ ou WSL2
- Python 3.8+
- Buildozer

### Installation Buildozer
```bash
# Sur Ubuntu/WSL
sudo apt update
sudo apt install -y python3-pip git zip unzip
pip3 install buildozer cython

# Dépendances Android
sudo apt install -y autoconf automake libtool pkg-config
```

### Compiler
```bash
cd version_android
buildozer android debug

# Ou avec plus de logs
buildozer android debug -v
```

### Signer (Release)
```bash
# Créer un keystore (une fois)
keytool -genkey -v -keystore mecamaster.keystore -alias mecamaster -keyalg RSA -validity 10000

# Compiler release signé
buildozer android release
```

---

## 🔧 Architecture

```
┌─────────────────────────────────────────┐
│           APK Android                    │
│  ┌────────────────────────────────────┐ │
│  │   Python for Android (Kivy)        │ │
│  │   ┌─────────────────────────────┐  │ │
│  │   │   main.py (logique)         │  │ │
│  │   │   Kivy UI (mobile native)   │  │ │
│  │   │   Mock AI (embarquée)       │  │ │
│  │   └─────────────────────────────┘  │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 📲 Installation APK

### Sur téléphone Android
1. Transfère le fichier APK sur le téléphone
2. Autorise "Sources inconnues" dans Paramètres > Sécurité
3. Ouvre le fichier APK
4. Installe l'application

### Distribution
- Play Store : Nécessite compte développeur ($25)
- APK direct : Partage par WhatsApp, email, etc.

---

## 🎮 Navigation Mobile

| Gesture | Action |
|---------|--------|
| Swipe ← | Ouvrir menu |
| Swipe → | Fermer menu |
| Tap | Sélectionner |
| Long press | Options |

---

## 🆘 Dépannage

| Problème | Solution |
|----------|----------|
| "Command not found" | Installe buildozer : `pip3 install buildozer` |
| Compilation lente | Normal (première fois ~30 min) |
| APK ne s'installe pas | Active "Sources inconnues" dans Android |
| Crash au démarrage | Vérifie les logs avec `buildozer android logcat` |
| WSL ne fonctionne pas | Utilise une VM Ubuntu ou un vrai Linux |

---

## 🎉 Résumé

- ✅ Application Android native
- ✅ Interface mobile moderne
- ✅ IA embarquée
- ✅ Compilation en APK
- ✅ Distribution facile

**Double-clique sur `LANCER.bat` pour tester sur PC** 📱
