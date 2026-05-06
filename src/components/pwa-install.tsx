// 📱 PWA INSTALL - Meca Master
 Téléchargement et installation de l'application mobile

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  X,
  Smartphone,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Home,
  Wrench,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Détecter si l'app est déjà installée
    const checkIfInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isInWebAppChrome = window.matchMedia("(display-mode: standalone)").matches;
      
      setIsInstalled(isStandalone || isInWebAppiOS || isInWebAppChrome);
    };

    // Écouter l'événement beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Montrer le prompt après 3 secondes
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 3000);
    };

    // Écouter l'événement appinstalled
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      toast({
        title: "🎉 Application installée !",
        description: "Meca Master est maintenant disponible sur votre écran d'accueil",
      });
    };

    checkIfInstalled();
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [isInstalled, toast]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Montrer le prompt d'installation
      await deferredPrompt.prompt();
      
      // Attendre la réponse de l'utilisateur
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === "accepted") {
        toast({
          title: "📱 Installation en cours...",
          description: "Meca Master s'installe sur votre appareil",
        });
      } else {
        toast({
          title: "Installation annulée",
          description: "Vous pourrez installer l'application plus tard",
        });
      }
      
      // Nettoyer
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
      
    } catch (error) {
      console.error("❌ Erreur installation PWA:", error);
      toast({
        title: "❌ Erreur d'installation",
        description: "Veuillez réessayer ou utiliser un navigateur compatible",
      });
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Sauvegarder que l'utilisateur a refusé pour ne plus le déranger
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  // Instructions pour iOS/Safari
  const showIOSInstructions = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome|CriOS|FxiOS/.test(navigator.userAgent);
    
    return isIOS && isSafari && !deferredPrompt;
  };

  if (isInstalled || showInstallPrompt === false) return null;

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <Card className="shadow-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Installez Meca Master
                    </h3>
                    <p className="text-sm text-gray-600">
                      Application mobile gratuite
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Avantages */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="text-sm text-gray-700">Accès instantané hors ligne</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-700">Notifications SOS immédiates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-700">Expérience native optimisée</span>
                </div>
              </div>

              {/* Boutons d'action */}
              {showIOSInstructions() ? (
                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-900 font-medium mb-2">
                      📱 Installation sur iPhone/iPad :
                    </p>
                    <ol className="text-xs text-blue-800 space-y-1">
                      <li>1. Appuyez sur <strong>Partager</strong> 📤 en bas de l'écran</li>
                      <li>2. Faites défiler et appuyez sur <strong>"Sur l'écran d'accueil"</strong> ➕</li>
                      <li>3. Appuyez sur <strong>"Ajouter"</strong> ✅</li>
                    </ol>
                  </div>
                  <Button
                    onClick={() => setShowInstallPrompt(false)}
                    className="w-full"
                    variant="outline"
                  >
                    J'ai compris
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstallClick}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Installer
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                  >
                    Plus tard
                  </Button>
                </div>
              )}

              {/* Badge confiance */}
              <div className="flex items-center justify-center mt-4">
                <Badge variant="secondary" className="text-xs">
                  🔒 Sécurisé • Gratuit • Sans publicité
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// 📊 Statistiques d'installation PWA
export const usePWAStats = () => {
  const [installStats, setInstallStats] = useState({
    totalViews: 0,
    installAttempts: 0,
    successfulInstalls: 0,
    platform: "unknown"
  });

  useEffect(() => {
    // Récupérer les stats depuis localStorage
    const stats = localStorage.getItem("pwa-stats");
    if (stats) {
      setInstallStats(JSON.parse(stats));
    }
  }, []);

  const trackInstallAttempt = () => {
    const newStats = {
      ...installStats,
      installAttempts: installStats.installAttempts + 1
    };
    setInstallStats(newStats);
    localStorage.setItem("pwa-stats", JSON.stringify(newStats));
  };

  const trackSuccessfulInstall = () => {
    const newStats = {
      ...installStats,
      successfulInstalls: installStats.successfulInstalls + 1
    };
    setInstallStats(newStats);
    localStorage.setItem("pwa-stats", JSON.stringify(newStats));
  };

  return {
    installStats,
    trackInstallAttempt,
    trackSuccessfulInstall
  };
};

// 🎯 Instructions d'installation par plateforme
export const getInstallInstructions = () => {
  const userAgent = navigator.userAgent;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  if (/Android/.test(userAgent)) {
    return {
      platform: "Android",
      icon: "🤖",
      steps: [
        "Appuyez sur le menu ⋯ en haut à droite",
        "Sélectionnez 'Installer l'application' ou 'Ajouter à l'écran d'accueil'",
        "Confirmez l'installation"
      ],
      browser: "Chrome, Firefox, Edge"
    };
  } else if (/iPhone|iPad|iPod/.test(userAgent)) {
    return {
      platform: "iOS",
      icon: "🍎",
      steps: [
        "Appuyez sur Partager 📤 en bas de l'écran",
        "Faites défiler vers le bas",
        "Appuyez sur 'Sur l'écran d'accueil' ➕",
        "Appuyez sur 'Ajouter'"
      ],
      browser: "Safari"
    };
  } else {
    return {
      platform: "Desktop",
      icon: "💻",
      steps: [
        "Appuyez sur le bouton d'installation dans la barre d'adresse",
        "Ou cherchez 'Installer l'application' dans le menu",
        "Confirmez l'installation"
      ],
      browser: "Chrome, Edge, Firefox"
    };
  }
};
