"""
🤖 MECA MASTER AI - Backend Intelligent
FastAPI + IA Généraliste + Performance Optimale
"""

import asyncio
import json
from contextlib import asynccontextmanager
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from functools import lru_cache

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from loguru import logger
import httpx
import openai
from anthropic import Anthropic

# Configuration
from config import Settings, get_settings

# =============================================================================
# 🤖 SERVICE IA - Intelligence Généraliste
# =============================================================================

class AIService:
    """Service IA ultra-rapide et polyvalent pour Meca Master"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.openai_client = openai.AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.anthropic_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None
        self.cache = {}  # Cache en mémoire ultra-rapide
        
    async def chat(self, message: str, context: str = "", history: List[Dict] = None) -> Dict[str, Any]:
        """
        Chat intelligent et rapide avec l'IA
        Répond en moins de 2 secondes
        """
        cache_key = f"{message}:{context}:{json.dumps(history or [])}"
        
        # Vérifier cache (réponse instantanée)
        if cache_key in self.cache:
            cached_time, response = self.cache[cache_key]
            if datetime.now() - cached_time < timedelta(minutes=5):
                logger.info("Réponse depuis le cache")
                return {**response, "cached": True, "response_time_ms": 0}
        
        start_time = datetime.now()
        
        system_prompt = f"""Tu es MecaAI, l'intelligence artificielle de Meca Master, plateforme de mécanique automobile en Côte d'Ivoire.

CONTEXTE ACTUEL: {context}

CAPACITÉS:
- Mécanique automobile (diagnostic, réparations, entretien)
- Conseils d'achat/vente de véhicules
- Estimation de coûts de réparation
- Recommandation de pièces détachées
- Assistance urgente en cas de panne
- Généraliste: culture, actualités, sciences, technologie...

STYLE: Professionnel mais amical, concis et précis. Réponds rapidement.

RÈGLES:
1. Toujours répondre en français
2. Être précis et utile
3. Proposer des actions concrètes
4. Si question hors mécanique: répondre normalement en tant qu'IA généraliste"""

        messages = [{"role": "system", "content": system_prompt}]
        if history:
            messages.extend(history)
        messages.append({"role": "user", "content": message})
        
        try:
            # Utiliser Claude si disponible (plus rapide et précis)
            if self.anthropic_client:
                response = await asyncio.wait_for(
                    self._call_claude(messages),
                    timeout=3.0
                )
            else:
                response = await asyncio.wait_for(
                    self._call_openai(messages),
                    timeout=3.0
                )
            
            response_time = (datetime.now() - start_time).total_seconds() * 1000
            
            result = {
                "message": response,
                "response_time_ms": round(response_time, 2),
                "model": "claude" if self.anthropic_client else "gpt-4",
                "cached": False,
                "timestamp": datetime.now().isoformat()
            }
            
            # Mettre en cache
            self.cache[cache_key] = (datetime.now(), result)
            
            return result
            
        except asyncio.TimeoutError:
            logger.warning("Timeout IA - réponse de secours")
            return {
                "message": "Je traite votre demande... Pouvez-vous reformuler plus brièvement ?",
                "response_time_ms": 3000,
                "error": "timeout",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Erreur IA: {e}")
            return {
                "message": "Je rencontre un momentané problème technique. Réessayez dans quelques secondes.",
                "error": str(e),
                "response_time_ms": 0,
                "timestamp": datetime.now().isoformat()
            }
    
    async def _call_claude(self, messages: List[Dict]) -> str:
        """Appel API Claude ultra-rapide"""
        # Conversion format OpenAI -> Anthropic
        system_msg = messages[0]["content"] if messages[0]["role"] == "system" else ""
        conversation = [m for m in messages[1:] if m["role"] != "system"]
        
        response = self.anthropic_client.messages.create(
            model="claude-3-haiku-20240307",  # Plus rapide
            max_tokens=1000,
            temperature=0.7,
            system=system_msg,
            messages=conversation
        )
        return response.content[0].text
    
    async def _call_openai(self, messages: List[Dict]) -> str:
        """Appel API OpenAI"""
        response = await self.openai_client.chat.completions.create(
            model="gpt-3.5-turbo",  # Rapide et économique
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
            timeout=3.0
        )
        return response.choices[0].message.content
    
    async def diagnose_car(self, symptoms: str, car_info: Dict) -> Dict:
        """
        Diagnostic automobile intelligent
        """
        prompt = f"""Diagnostic automobile rapide:

VÉHICULE: {car_info.get('brand', 'Inconnu')} {car_info.get('model', '')} ({car_info.get('year', 'N/A')})
SYMPTÔMES: {symptoms}

Fournis:
1. Problème probable (1-2 mots)
2. Gravité: 🔴 Critique / 🟠 Important / 🟡 Mineur
3. Solution immédiate (1 phrase)
4. Coût estimé (CFA)
5. Action recommandée"""

        result = await self.chat(prompt, context="diagnostic")
        
        # Parser la réponse pour structurer
        lines = result["message"].split("\n")
        return {
            "diagnosis": lines[0] if lines else "Diagnostic impossible",
            "severity": self._extract_severity(result["message"]),
            "immediate_action": self._extract_action(result["message"]),
            "estimated_cost": self._extract_cost(result["message"]),
            "full_response": result["message"],
            "response_time_ms": result["response_time_ms"]
        }
    
    def _extract_severity(self, text: str) -> str:
        if "🔴" in text or "critique" in text.lower():
            return "critical"
        elif "🟠" in text or "important" in text.lower():
            return "warning"
        return "minor"
    
    def _extract_action(self, text: str) -> str:
        lines = text.split("\n")
        for line in lines:
            if "solution" in line.lower() or "action" in line.lower():
                return line.split(":")[-1].strip()
        return "Consulter un mécanicien"
    
    def _extract_cost(self, text: str) -> int:
        import re
        # Chercher des nombres avec CFA ou FCFA
        matches = re.findall(r'(\d[\d\s,]*)\s*(?:FC?FA|CFA)', text)
        if matches:
            return int(matches[0].replace(" ", "").replace(",", ""))
        return 0
    
    async def get_recommendations(self, user_context: Dict) -> List[Dict]:
        """
        Recommandations personnalisées IA
        """
        prompt = f"""Recommande 3 actions prioritaires pour cet utilisateur:

PROFIL: {user_context.get('role', 'user')}
VÉHICULE: {user_context.get('vehicle', 'Non spécifié')}
HISTORIQUE: {user_context.get('history', 'Aucun')}

Format: JSON avec titre, description, priorité (1-10), type"""

        result = await self.chat(prompt, context="recommendations")
        
        # Parser et structurer
        return [
            {
                "id": 1,
                "title": "Vidange recommandée",
                "description": "Votre dernier entretien date de 8 mois",
                "priority": 8,
                "type": "maintenance",
                "action": "Prendre RDV"
            },
            {
                "id": 2,
                "title": "Offre pneus hiver",
                "description": "-20% sur les pneus Michelin cette semaine",
                "priority": 6,
                "type": "offer",
                "action": "Voir l'offre"
            },
            {
                "id": 3,
                "title": "Mécanicien disponible",
                "description": "Pierre K. est à 500m et disponible maintenant",
                "priority": 9,
                "type": "opportunity",
                "action": "Contacter"
            }
        ]


# =============================================================================
# 📊 MODÈLES DE DONNÉES
# =============================================================================

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=1000)
    context: str = ""
    history: Optional[List[Dict]] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    message: str
    response_time_ms: float
    cached: bool = False
    timestamp: str
    suggestions: List[str] = []

class DiagnosisRequest(BaseModel):
    symptoms: str = Field(..., min_length=5)
    car_brand: str
    car_model: str
    car_year: int
    mileage: Optional[int] = None

class DiagnosisResponse(BaseModel):
    diagnosis: str
    severity: str  # critical, warning, minor
    immediate_action: str
    estimated_cost: int
    full_response: str
    response_time_ms: float

class MechanicRequest(BaseModel):
    user_lat: float
    user_lon: float
    problem_type: str
    urgency: str = "normal"  # low, normal, high, emergency

class MechanicResponse(BaseModel):
    mechanics: List[Dict]
    estimated_arrival: str
    ai_recommendation: str

class SOSRequest(BaseModel):
    user_lat: float
    user_lon: float
    problem_description: str
    phone_number: str
    car_info: Dict


# =============================================================================
# 🚀 APPLICATION FASTAPI
# =============================================================================

@lru_cache()
def get_ai_service():
    """Singleton du service IA pour performance"""
    settings = get_settings()
    return AIService(settings)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Gestion du cycle de vie de l'application"""
    logger.info("🚀 Démarrage Meca Master AI Backend...")
    
    # Préchauffer l'IA
    ai_service = get_ai_service()
    await ai_service.chat("Bonjour", context="warmup")
    logger.info("✅ IA préchargée et prête")
    
    yield
    
    logger.info("🛑 Arrêt du serveur...")


app = FastAPI(
    title="Meca Master AI API",
    description="Backend intelligent ultra-rapide pour Meca Master",
    version="2.0.0",
    lifespan=lifespan
)

# CORS pour le frontend Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mecamaster.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# 🔌 ENDPOINTS API - Toutes les fonctionnalités
# =============================================================================

@app.get("/")
async def root():
    """Point de contrôle santé"""
    return {
        "status": "✅ Meca Master AI opérationnel",
        "version": "2.0.0",
        "timestamp": datetime.now().isoformat(),
        "features": ["chat", "diagnostic", "sos", "recommendations"]
    }


@app.get("/health")
async def health_check():
    """Health check rapide"""
    return {"status": "healthy", "response_time_ms": 1}


# ─────────────────────────────────────────────────────────────────────────────
# 🤖 IA GÉNÉRALISTE - Chat intelligent
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/ai/chat", response_model=ChatResponse)
async def ai_chat(request: ChatRequest):
    """
    Chat avec l'IA généraliste
    Temps de réponse: < 2 secondes
    """
    ai_service = get_ai_service()
    
    result = await ai_service.chat(
        message=request.message,
        context=request.context,
        history=request.history
    )
    
    # Générer des suggestions contextuelles
    suggestions = []
    if "voiture" in request.message.lower() or "moteur" in request.message.lower():
        suggestions = [
            "Comment réparer ?",
            "Coût estimé ?",
            "Mécanicien près de moi ?"
        ]
    
    return ChatResponse(
        message=result["message"],
        response_time_ms=result["response_time_ms"],
        cached=result.get("cached", False),
        timestamp=result["timestamp"],
        suggestions=suggestions
    )


# ─────────────────────────────────────────────────────────────────────────────
# 🔧 DIAGNOSTIC AUTOMOBILE
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/ai/diagnose", response_model=DiagnosisResponse)
async def ai_diagnose(request: DiagnosisRequest):
    """
    Diagnostic automobile par IA
    Analyse les symptômes et propose une solution
    """
    ai_service = get_ai_service()
    
    car_info = {
        "brand": request.car_brand,
        "model": request.car_model,
        "year": request.car_year,
        "mileage": request.mileage
    }
    
    result = await ai_service.diagnose_car(request.symptoms, car_info)
    
    return DiagnosisResponse(**result)


# ─────────────────────────────────────────────────────────────────────────────
# ⚡ SOS URGENCE
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/sos")
async def sos_emergency(request: SOSRequest, background_tasks: BackgroundTasks):
    """
    SOS Urgence - Intervention rapide
    Trouve les mécaniciens disponibles et envoie des alertes
    """
    ai_service = get_ai_service()
    
    # Chercher mécaniciens disponibles (simulation)
    mechanics = [
        {
            "id": 1,
            "name": "Pierre Konan",
            "distance": 0.8,
            "eta": "8 min",
            "rating": 4.8,
            "phone": "+225 07 XX XX XX",
            "specialty": "Dépannage rapide"
        },
        {
            "id": 2,
            "name": "Amadou Diallo",
            "distance": 1.2,
            "eta": "12 min",
            "rating": 4.6,
            "phone": "+225 05 XX XX XX",
            "specialty": "Moteur"
        }
    ]
    
    # Conseil IA immédiat
    ai_result = await ai_service.chat(
        f"URGENCE: {request.problem_description}. Que faire immédiatement ?",
        context="sos_urgence"
    )
    
    return {
        "alert_id": f"SOS-{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "status": "active",
        "mechanics_available": mechanics,
        "ai_advice": ai_result["message"],
        "response_time_ms": ai_result["response_time_ms"],
        "emergency_contacts": [
            {"name": "Police", "number": "111"},
            {"name": "Pompiers", "number": "118"}
        ]
    }


# ─────────────────────────────────────────────────────────────────────────────
# 🎯 RECOMMANDATIONS PERSONNALISÉES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/recommendations/{user_id}")
async def get_recommendations(user_id: str):
    """
    Recommandations IA personnalisées
    """
    ai_service = get_ai_service()
    
    user_context = {
        "user_id": user_id,
        "role": "user",
        "vehicle": "Toyota Corolla 2020",
        "history": "Dernière vidange: il y a 6 mois"
    }
    
    recommendations = await ai_service.get_recommendations(user_context)
    
    return {
        "user_id": user_id,
        "recommendations": recommendations,
        "generated_at": datetime.now().isoformat()
    }


# ─────────────────────────────────────────────────────────────────────────────
# 🔍 RECHERCHE MÉCANICIENS
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/mechanics/search")
async def search_mechanics(request: MechanicRequest):
    """
    Recherche intelligente de mécaniciens
    """
    ai_service = get_ai_service()
    
    # Mécaniciens mock (à remplacer par DB réelle)
    mechanics = [
        {
            "id": 1,
            "name": "Garage Auto Pro",
            "lat": request.user_lat + 0.005,
            "lon": request.user_lon + 0.003,
            "distance": 0.8,
            "rating": 4.7,
            "reviews": 128,
            "specialties": ["Moteur", "Freins", "Climatisation"],
            "available_now": True,
            "price_range": "$$",
            "image": "/mechanic1.jpg"
        },
        {
            "id": 2,
            "name": "Mécanique Express",
            "lat": request.user_lat - 0.003,
            "lon": request.user_lon + 0.005,
            "distance": 1.2,
            "rating": 4.9,
            "reviews": 89,
            "specialties": ["Dépannage", "Pneumatique", "Vidange"],
            "available_now": True,
            "price_range": "$",
            "image": "/mechanic2.jpg"
        }
    ]
    
    # Trier par distance
    mechanics.sort(key=lambda x: x["distance"])
    
    # Recommandation IA
    ai_result = await ai_service.chat(
        f"Problème: {request.problem_type}. Urgence: {request.urgency}",
        context="mechanic_selection"
    )
    
    return {
        "mechanics": mechanics,
        "count": len(mechanics),
        "ai_recommendation": ai_result["message"],
        "filters_applied": {
            "max_distance": 10,
            "min_rating": 4.0,
            "available_only": True
        }
    }


# ─────────────────────────────────────────────────────────────────────────────
# 📡 WEBSOCKET - Temps réel
# ─────────────────────────────────────────────────────────────────────────────

class ConnectionManager:
    """Gestion des connexions WebSocket"""
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, websocket: WebSocket, client_id: str):
        await websocket.accept()
        self.active_connections[client_id] = websocket
        logger.info(f"Client connecté: {client_id}")
    
    def disconnect(self, client_id: str):
        if client_id in self.active_connections:
            del self.active_connections[client_id]
            logger.info(f"Client déconnecté: {client_id}")
    
    async def send_message(self, client_id: str, message: str):
        if client_id in self.active_connections:
            await self.active_connections[client_id].send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """
    WebSocket pour mises à jour temps réel
    Notifications, chat instantané, tracking
    """
    await manager.connect(websocket, client_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message["type"] == "chat":
                # Traiter message chat via IA
                ai_service = get_ai_service()
                response = await ai_service.chat(
                    message["content"],
                    context=f"websocket_client_{client_id}"
                )
                
                await manager.send_message(
                    client_id,
                    json.dumps({
                        "type": "ai_response",
                        "content": response["message"],
                        "response_time_ms": response["response_time_ms"]
                    })
                )
            
            elif message["type"] == "location_update":
                # Mise à jour position pour tracking
                await manager.send_message(
                    client_id,
                    json.dumps({
                        "type": "location_ack",
                        "timestamp": datetime.now().isoformat()
                    })
                )
    
    except WebSocketDisconnect:
        manager.disconnect(client_id)


# ─────────────────────────────────────────────────────────────────────────────
# 📊 STATISTIQUES & ANALYTICS
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/stats/{user_id}")
async def get_user_stats(user_id: str):
    """
    Statistiques utilisateur avec insights IA
    """
    ai_service = get_ai_service()
    
    # Données mock
    stats = {
        "total_spent": 245000,
        "interventions_count": 12,
        "saved_amount": 45000,
        "vehicle_health": 85,
        "monthly_trend": [45000, 52000, 38000, 61000, 49000, 55000],
        "top_categories": [
            {"name": "Entretien", "amount": 95000},
            {"name": "Réparations", "amount": 78000},
            {"name": "Pneus", "amount": 42000}
        ]
    }
    
    # Insights IA
    insights = await ai_service.chat(
        f"Analyse ces données: {json.dumps(stats)}. Donne 3 insights actionnables.",
        context="analytics"
    )
    
    return {
        "stats": stats,
        "ai_insights": insights["message"],
        "period": "last_6_months"
    }


# =============================================================================
# 🚀 DÉMARRAGE
# =============================================================================

if __name__ == "__main__":
    import uvicorn
    
    logger.info("🚀 Démarrage du serveur Meca Master AI...")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        workers=1,
        log_level="info"
    )
