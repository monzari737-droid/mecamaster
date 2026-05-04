"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the prompt after a delay
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Store dismissal in localStorage to not show again for 24 hours
    localStorage.setItem("pwa-prompt-dismissed", Date.now().toString());
  };

  // Check if dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);
      if (hoursSinceDismissed < 24) {
        setIsVisible(false);
      }
    }
  }, []);

  if (isInstalled || !isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
      >
        <div className="glass rounded-2xl p-4 shadow-2xl border border-brand-orange/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-white mb-1">Installer Meca Master</h3>
              <p className="text-sm text-white/70 mb-3">
                Ajoutez l&apos;application à votre écran d&apos;accueil pour un accès rapide, même hors ligne.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleInstall}
                  className="bg-brand-orange hover:bg-orange-600 text-white flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Installer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-white/60 hover:text-white hover:bg-white/10"
                >
                  Plus tard
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-white/40 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Manual Install Button for when the prompt is not available
export function ManualInstallButton() {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleClick = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isDesktop = !isIOS && !isAndroid;

    if (isIOS) {
      alert("Sur iPhone/iPad : Appuyez sur 'Partager' puis 'Sur l'écran d'accueil'");
    } else if (isAndroid) {
      alert("Sur Android : Appuyez sur les 3 points ⋮ puis 'Ajouter à l'écran d'accueil'");
    } else if (isDesktop) {
      setShowInstructions(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="bg-brand-orange hover:bg-orange-600 text-white"
      >
        <Download className="w-4 h-4 mr-2" />
        Comment installer
      </Button>

      {showInstructions && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setShowInstructions(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass rounded-2xl p-6 max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-white mb-4">Installation sur PC</h3>
            <div className="space-y-3 text-white/80">
              <p className="flex items-start gap-2">
                <span className="bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">1</span>
                <span>Chrome : Cliquez sur l&apos;icône ➕ dans la barre d&apos;adresse</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">2</span>
                <span>Edge : Menu ⋮ → Applications → Installer cette site en tant qu&apos;application</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="bg-brand-orange text-white w-6 h-6 rounded-full flex items-center justify-center text-sm flex-shrink-0">3</span>
                <span>Firefox : Menu ⋮ → Installer</span>
              </p>
            </div>
            <Button
              onClick={() => setShowInstructions(false)}
              className="w-full mt-6 bg-brand-orange hover:bg-orange-600"
            >
              J&apos;ai compris
            </Button>
          </motion.div>
        </div>
      )}
    </>
  );
}
