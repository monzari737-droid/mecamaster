@echo off
chcp 65001 >nul
title 🤖 Meca Master Android - Emulator
echo.
echo ═══════════════════════════════════════════════════════════
echo 🤖 MECA MASTER ANDROID - Test sur PC
echo ═══════════════════════════════════════════════════════════
echo.
echo ⚠️  NOTE IMPORTANTE :
echo.
echo Cette version est pour Android (telephone/tablette).
echo Sur PC, tu peux uniquement tester avec l'emulateur.
echo.
echo Pour compiler en APK (fichier Android) :
echo    1. Installer Buildozer sur Linux (WSL recommande)
echo    2. Executer : buildozer android debug
echo.
echo ═══════════════════════════════════════════════════════════
echo.

:: Verifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python requis
    pause
    exit /b 1
)

:: Installer dependances
echo 📦 Installation de Kivy...
pip install kivy kivymd pillow

echo.
echo ═══════════════════════════════════════════════════════════
echo 🚀 Lancement en mode fenêtre (test PC)...
echo ═══════════════════════════════════════════════════════════
echo.
echo L'application va s'ouvrir dans une fenetre.
echo Resolution : 360x720 (format telephone)
echo.

:: Lancer
python main.py

echo.
echo ✅ Application fermee.
pause
