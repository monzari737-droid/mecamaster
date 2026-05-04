"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Wrench, 
  AlertTriangle,
  Car,
  X,
  Minimize2,
  Maximize2,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIChat } from "@/lib/api";

interface AIChatProps {
  context?: string;
  floating?: boolean;
}

const SUGGESTIONS = [
  { icon: Wrench, text: "Diagnostic panne", prompt: "J'ai un problème avec ma voiture" },
  { icon: Car, text: "Estimation réparation", prompt: "Combien coûte une vidange ?" },
  { icon: AlertTriangle, text: "SOS Urgence", prompt: "Mon moteur fait un bruit bizarre" },
];

export function AIChat({ context = "", floating = true }: AIChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, clearChat, isLoading, suggestions } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    await sendMessage(input, context);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = async (prompt: string) => {
    setInput(prompt);
    await sendMessage(prompt, context);
    setInput("");
  };

  if (!floating) {
    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 to-black rounded-2xl overflow-hidden border border-white/10">
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-brand-orange/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white flex items-center gap-2">
                MecaAI
                <Sparkles className="w-4 h-4 text-brand-orange" />
              </h3>
              <p className="text-xs text-white/50">Assistant intelligent</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="space-y-3">
              <p className="text-sm text-white/50 text-center mb-4">
                Comment puis-je vous aider aujourd'hui ?
              </p>
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => handleSuggestion(s.prompt)}
                  className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 
                           hover:border-brand-orange/30 transition-all text-left flex items-center gap-3"
                >
                  <s.icon className="w-5 h-5 text-brand-orange" />
                  <span className="text-sm text-white/80">{s.text}</span>
                </motion.button>
              ))}
            </div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                ${msg.role === "user" 
                  ? "bg-brand-orange" 
                  : "bg-gradient-to-br from-blue-500 to-purple-600"}`}>
                {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm
                ${msg.role === "user"
                  ? "bg-brand-orange text-white rounded-br-md"
                  : "bg-white/10 text-white/90 rounded-bl-md"}`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 p-3 rounded-2xl rounded-bl-md">
                <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />
              </div>
            </motion.div>
          )}

          {suggestions.length > 0 && messages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs px-3 py-1.5 bg-brand-orange/20 text-brand-orange rounded-full
                           hover:bg-brand-orange/30 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 
                       text-white placeholder-white/40 focus:outline-none focus:border-brand-orange/50"
            />
            <Button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="btn-vibrant px-4"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </Button>
          </div>
          <p className="text-[10px] text-white/30 mt-2 text-center">
            Powered by MecaAI • Réponses en moins de 2 secondes
          </p>
        </div>
      </div>
    );
  }

  // Floating chat button
  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full 
                     bg-gradient-to-br from-brand-orange to-orange-600 
                     shadow-lg shadow-orange-500/40 flex items-center justify-center
                     group"
          >
            <Bot className="w-8 h-8 text-white" />
            <motion.div
              className="absolute inset-0 rounded-full bg-brand-orange/30"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full 
                           flex items-center justify-center text-[10px] text-white font-bold">
              IA
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? "auto" : "600px",
              width: isMinimized ? "300px" : "380px"
            }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-b from-gray-900 to-black 
                     rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-gradient-to-r from-brand-orange/20 to-transparent
                          flex items-center justify-between cursor-pointer"
                 onClick={() => setIsMinimized(!isMinimized)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 
                              flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    MecaAI
                    <Sparkles className="w-4 h-4 text-brand-orange" />
                  </h3>
                  <p className="text-xs text-white/50">
                    {isLoading ? "Réflexion..." : "En ligne"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4 text-white/60" /> 
                               : <Minimize2 className="w-4 h-4 text-white/60" />}
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                  className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <>
                <div className="h-[420px] overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="space-y-3">
                      <p className="text-sm text-white/50 text-center mb-4">
                        Je suis MecaAI, votre assistant automobile intelligent. Posez-moi n'importe quelle question !
                      </p>
                      {SUGGESTIONS.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => handleSuggestion(s.prompt)}
                          className="w-full p-3 bg-white/5 hover:bg-white/10 rounded-xl 
                                   border border-white/10 hover:border-brand-orange/30 
                                   transition-all text-left flex items-center gap-3 group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-brand-orange/20 
                                        flex items-center justify-center group-hover:scale-110 transition-transform">
                            <s.icon className="w-5 h-5 text-brand-orange" />
                          </div>
                          <span className="text-sm text-white/80">{s.text}</span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${msg.role === "user" 
                          ? "bg-brand-orange" 
                          : "bg-gradient-to-br from-blue-500 to-purple-600"}`}>
                        {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed
                        ${msg.role === "user"
                          ? "bg-brand-orange text-white rounded-br-md"
                          : "bg-white/10 text-white/90 rounded-bl-md border border-white/5"}`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 
                                    flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-white/10 p-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                        <Loader2 className="w-4 h-4 text-brand-orange animate-spin" />
                        <span className="text-xs text-white/50">Réflexion...</span>
                      </div>
                    </motion.div>
                  )}

                  {suggestions.length > 0 && messages.length > 0 && !isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-wrap gap-2 pl-11"
                    >
                      {suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestion(s)}
                          className="text-xs px-3 py-1.5 bg-brand-orange/10 text-brand-orange 
                                   rounded-full border border-brand-orange/20
                                   hover:bg-brand-orange/20 transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Écrivez votre message..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 
                               text-white text-sm placeholder-white/40 
                               focus:outline-none focus:border-brand-orange/50 transition-colors"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="btn-vibrant px-4 h-11"
                    >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </Button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <button 
                      onClick={clearChat}
                      className="text-[10px] text-white/30 hover:text-white/60 transition-colors"
                    >
                      Effacer la conversation
                    </button>
                    <p className="text-[10px] text-white/30">
                      ⚡ Réponse en ~1.5s
                    </p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
