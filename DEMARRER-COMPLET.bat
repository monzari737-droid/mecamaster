@echo off
chcp 65001 >nul
title 🚀 MECA MASTER - Démarrage Complet (Frontend + Backend + IA)

echo ════════════════════════════════════════════════════════════════
echo 🚀 MECA MASTER - SYSTÈME COMPLET
echo ════════════════════════════════════════════════════════════════
echo.
echo Démarrage de :
echo   🤖 Backend Python (IA Ultra-Rapide)
echo   🎨 Frontend Next.js (Interface Moderne)
echo   🗄️  Base de données Neon (PostgreSQL)
echo.
echo ════════════════════════════════════════════════════════════════
echo.

:: Vérifier Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python non trouvé !
    echo 📥 Téléchargez sur https://python.org/downloads
    pause
    exit /b 1
)

:: Vérifier Node
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js non trouvé !
    echo 📥 Téléchargez sur https://nodejs.org
    pause
    exit /b 1
)

:: ════════════════════════════════════════════════════════════════
:: 🤖 ÉTAPE 1: Démarrer Backend Python
echo [1/3] 🤖 Préparation du Backend Python...
echo.

start "🤖 Meca Master AI Backend" cmd /k "cd /d "%~dp0backend" && start.bat"

echo ⏳ Attente du backend (5 secondes)...
timeout /t 5 /nobreak >nul

:: ════════════════════════════════════════════════════════════════
:: 🎨 ÉTAPE 2: Démarrer Frontend
echo.
echo [2/3] 🎨 Démarrage du Frontend Next.js...
echo.

start "🎨 Meca Master Frontend" cmd /k "cd /d "%~dp0" && npm run dev"

echo ⏳ Attente du frontend (5 secondes)...
timeout /t 5 /nobreak >nul

:: ════════════════════════════════════════════════════════════════
:: ✅ ÉTAPE 3: Confirmation
echo.
echo [3/3] ✅ Vérification des services...
echo.

:: Test backend
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ Backend Python: http://localhost:8000
) else (
    echo    ⏳ Backend en cours de démarrage...
)

:: Test frontend
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% == 0 (
    echo    ✅ Frontend Next.js: http://localhost:3000
) else (
    echo    ⏳ Frontend en cours de démarrage...
)

:: ════════════════════════════════════════════════════════════════
:: 🎉 RÉSULTAT
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo ✅ MECA MASTER EST PRÊT !
echo ════════════════════════════════════════════════════════════════
echo.
echo 🌐 ACCÈS À L'APPLICATION:
echo ─────────────────────────────────────────────────────────────────
echo    🎨 Site Web:      http://localhost:3000
echo    🤖 API Backend:   http://localhost:8000
echo    📖 Documentation: http://localhost:8000/docs
echo    🧪 Test IA:        http://localhost:8000/
echo ─────────────────────────────────────────────────────────────────
echo.
echo 🖥️  FENÊTRES OUVERTES:
echo    • Terminal Backend (Python/IA)
echo    • Terminal Frontend (Next.js)
echo.
echo ⌨️  COMMANDES UTILES:
echo    • Arrêter: Ctrl+C dans chaque terminal
echo    • Logs: Voir les terminaux ouverts
echo.
echo 🤖 FONCTIONNALITÉS IA ACTIVES:
echo    • Chat généraliste ultra-rapide
echo    • Diagnostic automobile intelligent  
echo    • Recommandations personnalisées
echo    • SOS urgence avec mécaniciens
echo    • Réponses en moins de 2 secondes
echo.
echo ════════════════════════════════════════════════════════════════
echo Appuyez sur une touche pour ouvrir le navigateur...
echo ════════════════════════════════════════════════════════════════
pause >nul

:: Ouvrir navigateur
start http://localhost:3000

echo.
echo 🎉 Navigateur ouvert ! Bonne utilisation de Meca Master !
echo.

:: Garder fenêtre ouverte
timeout /t 3 >nul
