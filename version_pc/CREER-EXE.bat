@echo off
chcp 65001 >nul
title 🖥️ Meca Master PC - Création du fichier .exe

echo ═══════════════════════════════════════════════════════════
echo 🖥️  CREATION DU FICHIER EXECUTABLE (.exe)
echo ═══════════════════════════════════════════════════════════
echo.
echo Ce script va créer un fichier .exe autonome
echo que tu peux distribuer sur n'importe quel PC Windows !
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:: Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé !
    echo 📥 Télécharge Python 3.8+ sur https://python.org/downloads
    echo.
    pause
    exit /b 1
)

echo ✅ Python détecté
echo.

:: Créer environnement virtuel si non existant
if not exist "venv" (
    echo 🐍 Création de l'environnement virtuel...
    python -m venv venv
)

:: Activer venv
call venv\Scripts\activate.bat

:: Installer dépendances
echo 📦 Installation des dépendances...
echo.

pip install PyQt5 pyinstaller pillow requests

if errorlevel 1 (
    echo ❌ Erreur lors de l'installation des dépendances
    pause
    exit /b 1
)

echo.
echo ✅ Dépendances installées
echo.

:: Créer le fichier spec pour PyInstaller
echo 📝 Configuration de PyInstaller...

(
echo # -*- mode: python ; coding: utf-8 -*-
echo.
echo block_cipher = None
echo.
echo a = Analysis^(
echo     ['meca_master.py'],
echo     pathex=['.'],
echo     binaries=[],
echo     datas=[],
echo     hiddenimports=['PyQt5.sip', 'PyQt5.QtCore', 'PyQt5.QtGui', 'PyQt5.QtWidgets'],
echo     hookspath=[],
echo     hooksconfig={},
echo     runtime_hooks=[],
echo     excludes=[],
echo     win_no_prefer_redirects=False,
echo     win_private_assemblies=False,
echo     cipher=block_cipher,
echo     noarchive=False
echo ^)
echo.
echo pyz = PYZ^(a.pure, a.zipped_data, cipher=block_cipher^)
exe = EXE^(
echo     pyz,
echo     a.scripts,
echo     a.binaries,
echo     a.zipfiles,
echo     a.datas,
echo     [],
echo     name='MecaMaster',
echo     debug=False,
echo     bootloader_ignore_signals=False,
echo     strip=False,
echo     upx=True,
echo     upx_exclude=[],
echo     runtime_tmpdir=None,
echo     console=False,
echo     disable_windowed_traceback=False,
echo     target_arch=None,
echo     codesign_identity=None,
echo     entitlements_file=None,
echo     icon='NONE'
echo ^)
) > meca_master.spec

echo ✅ Configuration créée
echo.

:: Compilation
echo 🔨 Compilation en cours...
echo     Cela peut prendre 2-5 minutes...
echo.

pyinstaller --onefile --windowed --name "MecaMaster" meca_master.py

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors de la compilation
    echo    Essaye avec : pyinstaller meca_master.spec
    pause
    exit /b 1
)

echo.
echo ═══════════════════════════════════════════════════════════
echo ✅ FICHIER .exe CREE AVEC SUCCES !
echo ═══════════════════════════════════════════════════════════
echo.
echo 📁 Emplacement : dist\MecaMaster.exe
echo 📦 Taille : environ 50-80 MB (inclut Python + PyQt5)
echo.
echo 🚀 Pour lancer :
echo    dist\MecaMaster.exe
echo.
echo 💾 Tu peux maintenant :
echo    • Copier dist\MecaMaster.exe sur n'importe quel PC
echo    • Pas besoin d'installer Python
echo    • Double-clic et ça marche !
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:: Copier dans le dossier racine pour faciliter
copy dist\MecaMaster.exe .\MecaMaster.exe >nul 2>&1

if exist MecaMaster.exe (
    echo 📋 Copie créée : MecaMaster.exe (dans ce dossier)
    echo.
)

echo 🎉 Appuie sur une touche pour ouvrir le dossier dist\
echo.
pause >nul

:: Ouvrir le dossier dist
start dist\
