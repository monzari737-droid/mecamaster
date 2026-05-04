/**
 * 🤖 API Client - Connexion au backend Python ultra-rapide
 * Meca Master AI Integration
 */

import { useState, useCallback } from "react";

// URL de l'API - Change cette valeur apres le deploiement Railway
// En local : 'http://localhost:8000'
// En production : 'https://ton-app.up.railway.app'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ═════════════════════════════════════════════════════════════════════════════
// 🔧 TYPES
// ═════════════════════════════════════════════════════════════════════════════

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  message: string;
  response_time_ms: number;
  cached: boolean;
  timestamp: string;
  suggestions: string[];
}

export interface DiagnosisRequest {
  symptoms: string;
  car_brand: string;
  car_model: string;
  car_year: number;
  mileage?: number;
}

export interface DiagnosisResponse {
  diagnosis: string;
  severity: "critical" | "warning" | "minor";
  immediate_action: string;
  estimated_cost: number;
  full_response: string;
  response_time_ms: number;
}

export interface Mechanic {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance: number;
  rating: number;
  reviews: number;
  specialties: string[];
  available_now: boolean;
  price_range: string;
  image: string;
}

export interface SOSRequest {
  user_lat: number;
  user_lon: number;
  problem_description: string;
  phone_number: string;
  car_info: {
    brand: string;
    model: string;
    year: number;
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// 🚀 API CLIENT
// ═════════════════════════════════════════════════════════════════════════════

class MecaAPI {
  private baseUrl: string;
  private wsConnection: WebSocket | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 🤖 IA - Chat intelligent
  // ───────────────────────────────────────────────────────────────────────────

  async chat(message: string, context: string = "", history: ChatMessage[] = []): Promise<ChatResponse> {
    const startTime = performance.now();

    try {
      const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, context, history }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data: ChatResponse = await response.json();
      
      console.log(`🤖 IA réponse: ${data.response_time_ms}ms ${data.cached ? "(cache)" : ""}`);
      
      return data;
    } catch (error) {
      console.error("Erreur chat IA:", error);
      // Fallback rapide
      return {
        message: "Je suis temporairement indisponible. Réessayez dans quelques secondes.",
        response_time_ms: performance.now() - startTime,
        cached: false,
        timestamp: new Date().toISOString(),
        suggestions: [],
      };
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 🔧 Diagnostic automobile
  // ───────────────────────────────────────────────────────────────────────────

  async diagnose(data: DiagnosisRequest): Promise<DiagnosisResponse> {
    const response = await fetch(`${this.baseUrl}/api/ai/diagnose`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("Diagnostic failed");

    return response.json();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ⚡ SOS Urgence
  // ───────────────────────────────────────────────────────────────────────────

  async sendSOS(data: SOSRequest): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error("SOS failed");

    return response.json();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 🔍 Recherche mécaniciens
  // ───────────────────────────────────────────────────────────────────────────

  async searchMechanics(
    lat: number,
    lon: number,
    problemType: string,
    urgency: "low" | "normal" | "high" | "emergency" = "normal"
  ): Promise<{ mechanics: Mechanic[]; ai_recommendation: string }> {
    const response = await fetch(`${this.baseUrl}/api/mechanics/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_lat: lat,
        user_lon: lon,
        problem_type: problemType,
        urgency,
      }),
    });

    if (!response.ok) throw new Error("Search failed");

    return response.json();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 🎯 Recommandations
  // ───────────────────────────────────────────────────────────────────────────

  async getRecommendations(userId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/recommendations/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch recommendations");
    return response.json();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 📊 Statistiques
  // ───────────────────────────────────────────────────────────────────────────

  async getUserStats(userId: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/api/stats/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch stats");
    return response.json();
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 📡 WebSocket - Temps réel
  // ───────────────────────────────────────────────────────────────────────────

  connectWebSocket(clientId: string, onMessage: (data: any) => void): WebSocket {
    const ws = new WebSocket(`ws://${this.baseUrl.replace("http://", "").replace("https://", "")}/ws/${clientId}`);

    ws.onopen = () => {
      console.log("📡 WebSocket connecté");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("📡 WebSocket déconnecté");
    };

    this.wsConnection = ws;
    return ws;
  }

  sendWebSocketMessage(type: string, content: any) {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({ type, content }));
    }
  }

  disconnectWebSocket() {
    this.wsConnection?.close();
    this.wsConnection = null;
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 🏥 Santé API
  // ───────────────────────────────────────────────────────────────────────────

  async healthCheck(): Promise<{ status: string; response_time_ms: number }> {
    const start = performance.now();
    const response = await fetch(`${this.baseUrl}/health`, {
      method: "GET",
    });
    const data = await response.json();
    return { ...data, response_time_ms: performance.now() - start };
  }
}

// Instance singleton
export const api = new MecaAPI();

// ═════════════════════════════════════════════════════════════════════════════
// 🎣 REACT HOOKS - Pour les composants
// ═════════════════════════════════════════════════════════════════════════════

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const sendMessage = useCallback(async (content: string, context: string = "") => {
    setIsLoading(true);

    // Ajouter message utilisateur
    const userMessage: ChatMessage = { role: "user", content, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await api.chat(content, context, messages);

      // Ajouter réponse IA
      const aiMessage: ChatMessage = {
        role: "assistant",
        content: response.message,
        timestamp: response.timestamp,
      };

      setMessages((prev) => [...prev, aiMessage]);
      setSuggestions(response.suggestions);

      return response;
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSuggestions([]);
  }, []);

  return { messages, sendMessage, clearChat, isLoading, suggestions };
}

export function useDiagnosis() {
  const [result, setResult] = useState<DiagnosisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const diagnose = useCallback(async (data: DiagnosisRequest) => {
    setIsLoading(true);
    try {
      const response = await api.diagnose(data);
      setResult(response);
      return response;
    } catch (error) {
      console.error("Diagnosis error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, diagnose, isLoading, clearResult: () => setResult(null) };
}

export function useMechanicSearch() {
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const search = useCallback(async (
    lat: number,
    lon: number,
    problemType: string,
    urgency: "low" | "normal" | "high" | "emergency" = "normal"
  ) => {
    setIsLoading(true);
    try {
      const response = await api.searchMechanics(lat, lon, problemType, urgency);
      setMechanics(response.mechanics);
      setAiRecommendation(response.ai_recommendation);
      return response;
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { mechanics, aiRecommendation, search, isLoading };
}

export default api;
