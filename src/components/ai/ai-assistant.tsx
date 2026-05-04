"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  X,
  Send,
  User,
  Sparkles,
  Wrench,
  Search,
  Lightbulb,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Wrench, label: "Diagnostic panne", prompt: "Mon moteur fait un bruit étrange au démarrage" },
  { icon: Search, label: "Trouver un mécanicien", prompt: "Où trouver un bon mécanicien près de chez moi ?" },
  { icon: Lightbulb, label: "Conseil entretien", prompt: "Quand dois-je changer mon huile ?" },
];

const welcomeMessage = `Bonjour ! Je suis l'assistant IA de Meca Master. 🤖

Je peux vous aider à :
• Diagnostiquer une panne de véhicule
• Trouver les meilleurs mécaniciens près de chez vous
• Donner des conseils d'entretien
• Répondre à vos questions sur l'application

Comment puis-je vous aider aujourd'hui ?`;

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: welcomeMessage,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        "bruit moteur": `🔧 **Diagnostic possible :**

Un bruit étrange au démarrage peut indiquer :

1. **Courroie de distribution usée** - Vérifiez son état
2. **Démarreur défaillant** - À remplacer si nécessaire
3. **Pompe à eau** - Peut couiner si les roulements sont usés
4. **Culasse** - Si bruit métallique, urgence

**Conseil :** Ne roulez pas avec ce bruit, faites vérifier rapidement par un mécanicien.

Souhaitez-vous que je vous trouve un mécanicien spécialisé moteur ?`,
        "mécanicien": `🔍 **Recherche de mécaniciens**

Je peux vous aider à trouver un mécanicien selon :
- Votre localisation actuelle
- Le type de problème
- Les avis et notes
- La disponibilité immédiate

Rendez-vous sur l'onglet "Mécaniciens" ou lancez un SOS si c'est urgent !`,
        "huile": `🛢️ **Entretien de l'huile moteur**

**Fréquence recommandée :**
- Huile synthétique : tous les 10,000 - 15,000 km
- Huile minérale : tous les 5,000 - 7,500 km
- Ou 1 fois par an minimum

**Signes qu'il faut changer :**
- Couleur noire et épaisse
- Niveau bas
- Témoin rouge sur le tableau de bord
- Brûlage d'huile (fumée bleue)

Souhaitez-vous commander de l'huile sur notre marketplace ?`,
      };

      let response = `Je comprends votre question. Voici ce que je peux vous dire :

💡 **Analyse :**
Votre demande concerne l'entretien/réparation automobile. Je vous recommande de :

1. Consulter un mécanicien professionnel pour un diagnostic précis
2. Utiliser la fonction SOS si c'est urgent
3. Parcourir notre marketplace pour les pièces nécessaires

Souhaitez-vous que je vous guide vers l'une de ces options ?`;

      // Try to match keywords
      const lowerInput = input.toLowerCase();
      for (const [keyword, resp] of Object.entries(responses)) {
        if (lowerInput.includes(keyword)) {
          response = resp;
          break;
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (prompt: string) => {
    setInput(prompt);
    // Auto send after a short delay
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSend();
    }, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
      >
        <Bot className="h-7 w-7" />
      </button>

      {/* Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setIsOpen(false)}
            />

            {/* Chat Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-4 z-50 w-full max-w-md h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Assistant IA</h3>
                    <p className="text-xs text-white/80">Meca Master</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        message.role === "user"
                          ? "bg-purple-500 text-white rounded-br-md"
                          : "bg-white shadow-sm border rounded-bl-md"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4 text-purple-500" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-sm border rounded-2xl rounded-bl-md p-3">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-500" />
                        <div className="flex gap-1">
                          <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="h-2 w-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="px-4 py-2 bg-white border-t">
                <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => handleQuickAction(action.prompt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm whitespace-nowrap hover:bg-purple-100 transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-4 bg-white border-t"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Posez votre question..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="rounded-full bg-purple-500 hover:bg-purple-600 h-10 w-10"
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  L&apos;IA peut se tromper. Vérifiez les informations importantes.
                </p>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
