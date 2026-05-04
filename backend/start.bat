@echo off
chcp 65001 >nul
title 🤖 Meca Master AI Backend

:: Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé !
    echo 📥 Téléchargez Python ici: https://python.org/downloads
    pause
    exit /b 1
)

:: Créer environnement virtuel si non existant
if not exist "venv" (
    echo 🐍 Création de l'environnement virtuel...
    python -m venv venv
)

:: Activer environnement virtuel
call venv\Scripts\activate.bat

:: Installer dépendances si nécessaire
if not exist "venv\Lib\site-packages\fastapi" (
    echo 📦 Installation des dépendances...
    pip install -r requirements.txt
)

:: Vérifier fichier .env
if not exist ".env" (
    echo ⚙️ Création du fichier .env...
    (
        echo # Configuration IA
        echo OPENAI_API_KEY=votre-cle-openai-ici
        echo ANTHROPIC_API_KEY=votre-cle-anthropic-ici
        echo.
        echo # Base de données Neon
        echo DATABASE_URL=postgresql://neondb_owner:npg_RPcWpaz4Z5uo@ep-bitter-bird-al979aun-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require^&channel_binding=require
        echo.
        echo # Mode debug
        echo DEBUG=True
    ) > .env
    echo ✅ Fichier .env créé. Éditez-le pour ajouter vos clés API.
)

cls
echo ═══════════════════════════════════════════════════════════
echo 🤖 MECA MASTER AI BACKEND
echo ═══════════════════════════════════════════════════════════
echo.
echo 🚀 Démarrage du serveur...
echo 📡 API disponible sur: http://localhost:8000
echo 📖 Documentation: http://localhost:8000/docs
echo 🧪 Tester l'IA: http://localhost:8000/
echo.
echo ⚡ Performance: Ultra-rapide avec cache
echo 🤖 IA: Generaliste + Spécialiste automobile
echo 🗄️  Base de données: Neon PostgreSQL
echo.
echo Appuyez sur Ctrl+C pour arrêter
echo ═══════════════════════════════════════════════════════════
echo.

:: Démarrer le serveur avec rechargement auto
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level info

pause
