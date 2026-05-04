@echo off
chcp 65001 >nul
title 🚀 Phase 1 - Deploiement Meca Master Cameroun

cls
echo ═══════════════════════════════════════════════════════════════════
echo   🇨🇲  PHASE 1 : DEPLOIEMENT MECA MASTER CAMEROUN
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Ce guide va t'aider a mettre ton application en ligne GRATUITEMENT
echo.
echo ETAPE 1 : Preparation (5 minutes)
echo ETAPE 2 : Deploiement Backend (10 minutes)  
echo ETAPE 3 : Deploiement Frontend (10 minutes)
echo ETAPE 4 : Test et verification (5 minutes)
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.

:: Verifier Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installe !
    echo 📥 Telecharge sur : https://git-scm.com/download/win
    echo.
    start https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git detecte
echo.

:: Verifier Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js n'est pas installe !
    echo 📥 Telecharge sur : https://nodejs.org
    echo.
    start https://nodejs.org
    pause
    exit /b 1
)

echo ✅ Node.js detecte
echo.

:: Menu
:menu
echo ═══════════════════════════════════════════════════════════════════
echo   QUE VEUX-TU FAIRE ?
echo ═══════════════════════════════════════════════════════════════════
echo.
echo   1. 📤 Publier le code sur GitHub (Obligatoire)
echo   2. 🔧 Configurer les fichiers de deploiement
echo   3. 📖 Voir le guide complet (DEPLOIEMENT-CAMEROUN.md)
echo   4. ✅ Verifier que tout est pret
echo   5. 🌐 Tester l'API en ligne (apres deploiement)
echo   6. 🚪 Quitter
echo.
echo ═══════════════════════════════════════════════════════════════════
echo.
set /p choix="Choisis une option (1-6) : "

if "%choix%"=="1" goto github
if "%choix%"=="2" goto config
if "%choix%"=="3" goto guide
if "%choix%"=="4" goto verify
if "%choix%"=="5" goto testapi
if "%choix%"=="6" exit

echo Option invalide
goto menu

:github
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   📤 ETAPE 1 : PUBLIER SUR GITHUB
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Avant de commencer :
echo 1. Cree un compte sur https://github.com (gratuit)
echo 2. Cree un nouveau repository "mecamaster" (public ou private)
echo 3. NE coche PAS "Initialize this repository with a README"
echo.
pause

echo.
echo Configuration de Git...
echo.

set /p username="Ton nom d'utilisateur GitHub : "
set /p email="Ton email GitHub : "

git config --global user.name "%username%"
git config --global user.email "%email%"

cd /d "%~dp0"

echo Initialisation du repository...
git init

echo Ajout des fichiers...
git add .

echo Commit...
git commit -m "Version initiale - Meca Master Cameroun"

echo.
echo Connexion au repository distant...
echo URL exemple : https://github.com/%username%/mecamaster.git
echo.
set /p repo="Colle l'URL de ton repository GitHub : "

git remote add origin %repo%
git branch -M main
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Erreur lors du push !
    echo Si c'est la premiere fois, essaie :
    echo git push -u origin main --force
    echo.
) else (
    echo.
    echo ✅ Code publie sur GitHub !
    echo Tu peux maintenant deployer sur Railway et Vercel.
    echo.
)

pause
goto menu

:config
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   🔧 CONFIGURATION DES FICHIERS
echo ═══════════════════════════════════════════════════════════════════
echo.
echo Verification des fichiers de deploiement...
echo.

if exist "backend\railway.json" (
    echo ✅ railway.json present
) else (
    echo ❌ railway.json MANQUANT
)

if exist "backend\Procfile" (
    echo ✅ Procfile present
) else (
    echo ❌ Procfile MANQUANT
)

if exist "backend\runtime.txt" (
    echo ✅ runtime.txt present
) else (
    echo ❌ runtime.txt MANQUANT
)

if exist "vercel.json" (
    echo ✅ vercel.json present
) else (
    echo ❌ vercel.json MANQUANT
)

if exist "backend\.env.example" (
    echo ✅ .env.example present
) else (
    echo ❌ .env.example MANQUANT
)

echo.
echo Si tous les fichiers sont presents, tu peux deployer !
echo.

pause
goto menu

:guide
echo.
start "" "DEPLOIEMENT-CAMEROUN.md"
goto menu

:verify
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   ✅ VERIFICATION
echo ═══════════════════════════════════════════════════════════════════
echo.

echo 1. Verification Git...
git status >nul 2>&1
if errorlevel 1 (
    echo    ❌ Git non initialise
) else (
    echo    ✅ Git initialise
)

echo.
echo 2. Verification Node.js...
node --version 2>nul
if errorlevel 1 (
    echo    ❌ Node.js non installe
) else (
    echo    ✅ Node.js installe
)

echo.
echo 3. Verification dependances...
if exist "node_modules" (
    echo    ✅ node_modules present
) else (
    echo    ⚠️  node_modules MANQUANT - executer : npm install
)

echo.
echo 4. Verification des cles API (Phase 2)...
if exist "backend\.env" (
    echo    ⚠️  Fichier .env trouve - verifier les cles API
) else (
    echo    ℹ️  Copier backend\.env.example vers backend\.env
    echo       (Phase 2 : ajouter les cles API)
)

echo.
echo Resume :
echo - Tu dois avoir un compte GitHub, Railway, Vercel
echo - Le code doit etre sur GitHub
echo - Les fichiers railway.json, Procfile, runtime.txt doivent exister
echo.

pause
goto menu

:testapi
echo.
echo ═══════════════════════════════════════════════════════════════════
echo   🌐 TESTER L'API EN LIGNE
echo ═══════════════════════════════════════════════════════════════════
echo.

set /p apiurl="Colle l'URL de ton API Railway (ex: https://mecamaster.up.railway.app) : "

echo.
echo Test de connexion...
echo.

curl -s "%apiurl%/health" > temp_response.json 2>nul

if exist "temp_response.json" (
    type temp_response.json
    echo.
    echo.
    echo ✅ L'API repond !
    del temp_response.json
) else (
    echo ❌ Impossible de contacter l'API
    echo Verifie que l'URL est correcte et que Railway est en ligne.
)

echo.

pause
goto menu
