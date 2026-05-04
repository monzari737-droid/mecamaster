@echo off
chcp 65001 >nul
echo.
echo ╔═══════════════════════════════════════════════════════════════════════╗
echo ║                    🚀 MECA MASTER - LANCEMENT                          ║
echo ║              Votre mecanicien en un clic                              ║
echo ╚═══════════════════════════════════════════════════════════════════════╝
echo.

REM Vérifier si on est dans le bon dossier
IF NOT EXIST "package.json" (
    echo ❌ ERREUR: Vous devez etre dans le dossier meca-master!
    echo 📁 Chemin attendu: C:\Users\user\Desktop\MECA MASTER\meca-master
    echo.
    pause
    exit /b 1
)

echo 🔧 Verification de Node.js...
node --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo ❌ Node.js n'est pas installe!
    echo 📥 Telechargez-le sur: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js detecte
echo.

REM Vérifier si node_modules existe
IF NOT EXIST "node_modules" (
    echo 📦 Installation des dependances...
    echo ⏳ Cela peut prendre quelques minutes...
    echo.
    call npm install
    IF ERRORLEVEL 1 (
        echo ❌ Erreur lors de l'installation
        echo.
        pause
        exit /b 1
    )
    echo ✅ Dependances installees!
    echo.
) ELSE (
    echo ✅ Dependances deja installees
    echo.
)

echo 🚀 Demarrage du serveur de developpement...
echo 🌐 Le site sera accessible sur: http://localhost:3000
echo.
echo ========================================
echo.

npm run dev

IF ERRORLEVEL 1 (
    echo.
    echo ❌ Erreur lors du demarrage
    echo.
    pause
    exit /b 1
)

echo.
pause
