"""
🚀 Optimisation des performances - Meca Master
Gestion des connexions, cache et scaling
"""

import asyncio
import time
from typing import Dict, List
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

# Limiteur de requêtes (pour éviter abus)
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Meca Master - Optimized API")

# Compression GZip (réduit la taille des réponses de 70%)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# CORS optimisé
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://mecamaster.vercel.app"],  # Ton domaine Vercel
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Cache mémoire simple (remplace Redis pour commencer)
class SimpleCache:
    def __init__(self):
        self.cache: Dict[str, Dict] = {}
        self.ttl: Dict[str, float] = {}
    
    def set(self, key: str, value: any, ttl_seconds: int = 300):
        self.cache[key] = value
        self.ttl[key] = time.time() + ttl_seconds
    
    def get(self, key: str):
        if key in self.ttl and time.time() > self.ttl[key]:
            del self.cache[key]
            del self.ttl[key]
            return None
        return self.cache.get(key)

cache = SimpleCache()

# Pool de connexions base de données
DATABASE_POOL_SIZE = 3  # Limite Neon gratuit
MAX_CONCURRENT_USERS = 100

# Statistiques en temps réel
stats = {
    "active_connections": 0,
    "total_requests": 0,
    "cache_hits": 0,
    "rate_limited": 0
}

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    stats["active_connections"] += 1
    stats["total_requests"] += 1
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    response.headers["X-Active-Connections"] = str(stats["active_connections"])
    
    stats["active_connections"] -= 1
    return response

@app.get("/stats")
@limiter.limit("60/minute")  # 60 requêtes/minute par IP
async def get_stats(request: Request):
    """Statistiques de performance en temps réel"""
    return {
        "performance": stats,
        "limits": {
            "max_concurrent_users": MAX_CONCURRENT_USERS,
            "database_pool_size": DATABASE_POOL_SIZE,
            "rate_limit_per_minute": 60
        },
        "cache_info": {
            "cache_size": len(cache.cache),
            "cache_hits": stats["cache_hits"]
        }
    }

@app.get("/health")
async def health_check():
    """Health check optimisé"""
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "active_connections": stats["active_connections"],
        "uptime": time.time() - start_time
    }

# Cache pour les réponses IA (évite d'appeler OpenAI pour les mêmes questions)
def cache_ai_response(question: str, response: str):
    cache.set(f"ai:{question}", response, ttl_seconds=1800)  # 30 minutes

def get_cached_ai_response(question: str):
    cached = cache.get(f"ai:{question}")
    if cached:
        stats["cache_hits"] += 1
    return cached

start_time = time.time()
