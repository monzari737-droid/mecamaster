@echo off
chcp 65001 >nul
cls

echo.
echo    ╔═══════════════════════════════════════════════════════════════════════╗
echo    ║                                                                       ║
echo    ║                    🚀 MECA MASTER - LANCEMENT                          ║
echo    ║                                                                       ║
echo    ║              NOUVEAU DESIGN ULTRA-MODERNE ! 🎨✨                        ║
echo    ║                                                                       ║
echo    ╚═══════════════════════════════════════════════════════════════════════╝
echo.

IF NOT EXIST "package.json" (
    echo    ❌ ERREUR: Vous n'etes pas dans le bon dossier !
    echo.
    echo    📁 Allez dans: C:\Users\user\Desktop\MECA MASTER\meca-master
    echo.
    pause
    exit /b 1
)

echo    🔧 Verification de Node.js...
node --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo    ❌ Node.js n'est pas installe !
    echo    📥 Telechargez sur: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo    ✅ Node.js detecte
echo.

IF NOT EXIST "node_modules" (
    echo    📦 Installation des dependances en cours...
    echo    ⏳ Cela peut prendre 2-3 minutes...
    echo.
    call npm install
    IF ERRORLEVEL 1 (
        echo    ❌ Erreur lors de l'installation
        pause
        exit /b 1
    )
    echo    ✅ Dependances installees !
    echo.
)

echo    🚀 Lancement du serveur de developpement...
echo    🌐 Le site sera accessible sur: http://localhost:3000
echo.
echo    ============================================
echo    ✨ NOUVEAUTES DU DESIGN MODERNE :
echo    ============================================
echo    🎨 Fond noir avec effets lumineux
echo    ✨ Animations fluides et parallax
echo    📱 Mockup 3D du telephone qui bouge
echo    🎴 Cartes en glassmorphism
echo    🌟 Texte degrade anime
echo    💫 Particules et blobs flottants
echo    ============================================
echo.

npm run dev

IF ERRORLEVEL 1 (
    echo.
    echo    ❌ Erreur lors du demarrage
    pause
    exit /b 1
)

pause
