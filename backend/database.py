"""
Base de données - Neon PostgreSQL
Optimisé pour performance ultra-rapide
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, Integer, Float, DateTime, JSON, Boolean, Text
from datetime import datetime
from typing import Optional

from config import settings

# Engine async ultra-performant
engine = create_async_engine(
    settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://"),
    echo=False,  # Pas de logs SQL en prod
    pool_size=20,
    max_overflow=30,
    pool_pre_ping=True,
    pool_recycle=300,
)

SessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False
)

Base = declarative_base()


# ═════════════════════════════════════════════════════════════════════════════
# 📊 MODÈLES DE DONNÉES
# ═════════════════════════════════════════════════════════════════════════════

class User(Base):
    """Utilisateurs de la plateforme"""
    __tablename__ = "users"
    
    id = Column(String, primary_key=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    role = Column(String, default="user")  # user, mechanic, enterprise
    avatar_url = Column(String, nullable=True)
    
    # Localisation
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    address = Column(String, nullable=True)
    
    # Métadonnées
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # Préférences
    preferences = Column(JSON, default=dict)


class Vehicle(Base):
    """Véhicules des utilisateurs"""
    __tablename__ = "vehicles"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    
    # Informations véhicule
    brand = Column(String)
    model = Column(String)
    year = Column(Integer)
    plate_number = Column(String, unique=True)
    vin = Column(String, nullable=True)
    mileage = Column(Integer, default=0)
    
    # État
    health_score = Column(Integer, default=100)  # 0-100
    last_maintenance = Column(DateTime, nullable=True)
    next_maintenance = Column(DateTime, nullable=True)
    
    # Photos
    photos = Column(JSON, default=dict)  # {front, back, left, right}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Mechanic(Base):
    """Mécaniciens partenaires"""
    __tablename__ = "mechanics"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, unique=True)
    
    # Profil
    business_name = Column(String)
    description = Column(Text)
    specialties = Column(JSON, default=list)  # ["Moteur", "Freins", ...]
    
    # Localisation
    latitude = Column(Float, index=True)
    longitude = Column(Float, index=True)
    service_radius = Column(Float, default=10.0)  # km
    
    # Disponibilité
    is_available = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    current_job = Column(String, nullable=True)
    
    # Notation
    rating = Column(Float, default=5.0)
    review_count = Column(Integer, default=0)
    
    # Tarification
    base_price = Column(Integer, default=5000)  # CFA
    hourly_rate = Column(Integer, default=10000)  # CFA
    
    created_at = Column(DateTime, default=datetime.utcnow)


class Intervention(Base):
    """Interventions/réparations"""
    __tablename__ = "interventions"
    
    id = Column(String, primary_key=True)
    
    # Participants
    user_id = Column(String, index=True)
    mechanic_id = Column(String, index=True, nullable=True)
    vehicle_id = Column(String, index=True)
    
    # Détails
    type = Column(String)  # vidange, freins, moteur, etc.
    description = Column(Text)
    symptoms = Column(Text, nullable=True)
    
    # Diagnostic IA
    ai_diagnosis = Column(Text, nullable=True)
    ai_confidence = Column(Float, nullable=True)
    
    # Statut
    status = Column(String, default="pending")  # pending, accepted, in_progress, completed, cancelled
    
    # Localisation
    address = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Financier
    estimated_cost = Column(Integer, nullable=True)
    final_cost = Column(Integer, nullable=True)
    
    # Timing
    created_at = Column(DateTime, default=datetime.utcnow)
    scheduled_at = Column(DateTime, nullable=True)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    
    # Avis
    user_rating = Column(Integer, nullable=True)
    user_comment = Column(Text, nullable=True)
    mechanic_rating = Column(Integer, nullable=True)


class ChatMessage(Base):
    """Historique des conversations IA"""
    __tablename__ = "chat_messages"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    
    message = Column(Text)
    response = Column(Text)
    context = Column(String, default="")
    
    # Métriques
    response_time_ms = Column(Integer)
    model_used = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class Product(Base):
    """Produits marketplace"""
    __tablename__ = "products"
    
    id = Column(String, primary_key=True)
    seller_id = Column(String, index=True)
    
    name = Column(String)
    description = Column(Text)
    category = Column(String, index=True)
    
    price = Column(Integer)
    original_price = Column(Integer, nullable=True)
    currency = Column(String, default="XOF")
    
    stock = Column(Integer, default=0)
    images = Column(JSON, default=list)
    
    # Filtres
    brand = Column(String, nullable=True)
    compatible_vehicles = Column(JSON, default=list)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class Notification(Base):
    """Notifications push"""
    __tablename__ = "notifications"
    
    id = Column(String, primary_key=True)
    user_id = Column(String, index=True)
    
    type = Column(String)  # info, warning, success, sos
    title = Column(String)
    message = Column(Text)
    
    data = Column(JSON, default=dict)  # Payload additionnel
    
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


# ═════════════════════════════════════════════════════════════════════════════
# 🔧 HELPERS
# ═════════════════════════════════════════════════════════════════════════════

async def get_db():
    """Dépendance FastAPI pour la DB"""
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    """Initialise la base de données"""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Base de données initialisée")


async def close_db():
    """Ferme proprement la DB"""
    await engine.dispose()
    print("✅ Connexion DB fermée")
