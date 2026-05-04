@echo off
chcp 65001 >nul
title 🖥️ Meca Master PC

echo ═══════════════════════════════════════════════════════════
echo 🖥️  MECA MASTER PC - Mode Developpement
echo ═══════════════════════════════════════════════════════════
echo.
echo Lance l'application en mode developpement
echo (sans créer de fichier .exe)
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:: Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé !
    echo 📥 Télécharge Python sur https://python.org/downloads
    pause
    exit /b 1
)

:: Créer venv si nécessaire
if not exist "venv" (
    echo 🐍 Creation environnement virtuel...
    python -m venv venv
)

:: Activer
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
) else (
    echo ⚠️  Environnement virtuel non trouvé, utilisation de Python global
)

:: Installer dependances si nécessaire
echo 📦 Verification des dependances...
python -c "import PyQt5" >nul 2>&1
if errorlevel 1 (
    echo 📦 Installation de PyQt5...
    pip install PyQt5 pillow
)

echo.
echo ═══════════════════════════════════════════════════════════
echo 🚀 Lancement de Meca Master PC...
echo ═══════════════════════════════════════════════════════════
echo.

:: Lancer l'application
python meca_master.py

if errorlevel 1 (
    echo.
    echo ❌ L'application s'est fermee avec une erreur
    pause
)
