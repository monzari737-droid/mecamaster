"""
Configuration du backend Meca Master AI
"""

from functools import lru_cache
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """Configuration centralisée"""
    
    # Application
    APP_NAME: str = "Meca Master AI"
    DEBUG: bool = False
    VERSION: str = "2.0.0"
    
    # Sécurité
    SECRET_KEY: str = Field(default="votre-cle-super-secrete-changez-en-prod")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Base de données Neon PostgreSQL
    DATABASE_URL: str = Field(
        default="postgresql://neondb_owner:npg_RPcWpaz4Z5uo@ep-bitter-bird-al979aun-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
    )
    
    # Redis (cache ultra-rapide)
    REDIS_URL: str = Field(default="redis://localhost:6379/0")
    REDIS_ENABLED: bool = False
    
    # IA - API Keys (à remplacer par vos vraies clés)
    OPENAI_API_KEY: str = Field(default="")
    ANTHROPIC_API_KEY: str = Field(default="")
    
    # Ollama (IA locale gratuite - alternative)
    OLLAMA_URL: str = Field(default="http://localhost:11434")
    USE_LOCAL_AI: bool = Field(default=True)  # Utiliser Ollama par défaut (gratuit)
    
    # Configuration IA
    AI_MODEL: str = Field(default="claude-3-haiku-20240307")  # ou "gpt-3.5-turbo"
    AI_MAX_TOKENS: int = 1000
    AI_TEMPERATURE: float = 0.7
    AI_TIMEOUT_SECONDS: float = 3.0
    
    # Performance
    CACHE_TTL_SECONDS: int = 300  # 5 minutes
    MAX_CONCURRENT_REQUESTS: int = 100
    
    # CORS
    CORS_ORIGINS: list = Field(default=[
        "http://localhost:3000",
        "https://mecamaster.vercel.app",
        "https://mecamaster.com"
    ])
    
    # WebSocket
    WS_HEARTBEAT_INTERVAL: int = 30  # secondes
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    """Singleton des paramètres"""
    return Settings()


# Export pour utilisation
settings = get_settings()
