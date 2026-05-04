"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { 
  Wrench, Car, Store, ArrowRight, Star, MapPin, Shield, 
  Download, Smartphone, Monitor, CheckCircle, Quote, Users, 
  Clock, Award, TrendingUp, MessageCircle, Heart, Zap, Sparkles,
  Play, ChevronDown, Target, Truck, CreditCard, Bell, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ═══════════════════════════════════════════════════════════════
// ANIMATIONS CONFIG
// ═══════════════════════════════════════════════════════════════
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] }
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function LandingPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-black overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════
          BACKGROUND EFFECTS
          ═══════════════════════════════════════════════════════════════ */}
      <div className="fixed inset-0 z-0">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-brand-orange/30 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[200px]" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,140,66,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,140,66,0.1) 1px, transparent 1px)`,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════════════ */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 px-4 py-4"
      >
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push("/")}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <motion.div 
                  className="absolute -top-1 -right-1 w-4 h-4 bg-brand-orange rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
              <span className="text-xl font-bold text-white">Meca Master</span>
            </motion.div>

            <nav className="hidden md:flex items-center gap-8">
              {["Fonctionnalités", "Comment ça marche", "Avis", "Télécharger"].map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${["features", "how-it-works", "reviews", "download"][i]}`}
                  className="text-sm text-white/70 hover:text-white transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-orange group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push("/auth/login")}
                className="text-white hover:text-brand-orange hover:bg-white/10"
              >
                Connexion
              </Button>
              <Button
                onClick={() => router.push("/auth/register")}
                className="bg-brand-orange hover:bg-orange-600 text-white shadow-lg shadow-orange-500/30"
              >
                Commencer
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ═══════════════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 px-4">
        <motion.div 
          style={{ y, opacity, scale }}
          className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Content */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center lg:text-left"
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6"
            >
              <Sparkles className="w-4 h-4 text-brand-orange" />
              <span className="text-sm text-white/80">L&apos;application #1 en Côte d&apos;Ivoire</span>
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6"
            >
              Votre mécanicien
              <span className="block mt-2">
                <span className="gradient-text">en un clic</span>
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-white/70 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Connectez-vous instantanément avec des mécaniciens qualifiés. 
              SOS 24/7, marketplace de pièces, et assistance IA.
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start flex-wrap"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg bg-brand-orange hover:bg-orange-600 text-white shadow-xl shadow-orange-500/30 shimmer"
                  onClick={() => router.push("/auth/register")}
                >
                  <Smartphone className="mr-2 h-5 w-5" />
                  Installer l&apos;app
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 text-lg border-2 border-white/30 text-white hover:bg-white/10"
                  onClick={() => router.push("/demo")}
                >
                  <Eye className="mr-2 h-5 w-5" />
                  Essayer sans compte
                </Button>
              </motion.div>
            </motion.div>
            
            {/* PWA Install Note */}
            <motion.p 
              variants={fadeInUp}
              className="mt-4 text-sm text-white/50 flex items-center gap-2 justify-center lg:justify-start"
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Application installable sur Android et PC
            </motion.p>

            <motion.div 
              variants={fadeInUp}
              className="mt-8 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-black flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-white/60">4.9/5 sur 2,000+ avis</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual - 3D Card Effect */}
          <motion.div
            initial={{ opacity: 0, x: 100, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            className="relative"
          >
            <div className="relative z-10">
              <motion.div
                animate={{ 
                  rotateY: [0, 5, 0, -5, 0],
                  rotateX: [0, -5, 0, 5, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Main Phone Mockup */}
                <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-[3rem] p-2 shadow-2xl shadow-orange-500/20 border border-white/10">
                  <div className="bg-black rounded-[2.5rem] overflow-hidden">
                    <div className="bg-gradient-to-br from-brand-orange/20 to-purple-600/20 p-8 min-h-[500px] flex flex-col items-center justify-center">
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-32 h-32 bg-gradient-to-br from-brand-orange to-orange-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl"
                      >
                        <span className="text-6xl font-bold text-white">M</span>
                      </motion.div>
                      <h3 className="text-2xl font-bold text-white mb-2">Meca Master</h3>
                      <p className="text-white/60 text-center">Votre mécanicien en un clic</p>
                      
                      {/* Animated buttons inside mockup */}
                      <div className="mt-8 space-y-3 w-full max-w-xs">
                        <motion.div 
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                          className="bg-white/10 rounded-xl p-4 flex items-center gap-3"
                        >
                          <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">SOS Urgent</p>
                            <p className="text-white/50 text-sm">Appuyez pour l&apos;aide</p>
                          </div>
                        </motion.div>
                        
                        <motion.div 
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="bg-white/10 rounded-xl p-4 flex items-center gap-3"
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">Mécaniciens proches</p>
                            <p className="text-white/50 text-sm">5 disponibles à 2km</p>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-8 -right-8 glass rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold">Intervention</p>
                      <p className="text-white/60 text-sm">Terminée !</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-8 glass rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-bold">4.9</span>
                    <span className="text-white/60 text-sm">(128 avis)</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-white/50 cursor-pointer"
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <span className="text-sm">Découvrir</span>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          STATS SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { value: "500+", label: "Mécaniciens", icon: Users, color: "from-blue-500 to-blue-600" },
              { value: "15K+", label: "Interventions", icon: CheckCircle, color: "from-green-500 to-green-600" },
              { value: "4.9", label: "Note moyenne", icon: Star, color: "from-yellow-500 to-yellow-600" },
              { value: "12min", label: "Temps de réponse", icon: Clock, color: "from-brand-orange to-orange-600" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-2xl p-6 text-center group cursor-pointer"
              >
                <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <motion.div 
                  className="text-4xl font-bold text-white mb-1"
                  initial={{ scale: 0.5 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-white/60">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-medium mb-4">
              Fonctionnalités
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Tout ce qu&apos;il vous faut
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Une suite complète d&apos;outils pour gérer tous vos besoins automobiles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Zap, 
                title: "SOS Dépannage", 
                desc: "Bouton d'urgence 24/7. Un mécanicien qualifié arrive en moins de 15 minutes.",
                color: "from-red-500 to-red-600",
                glow: "shadow-red-500/30"
              },
              { 
                icon: MapPin, 
                title: "Géolocalisation", 
                desc: "Trouvez les mécaniciens les plus proches avec suivi GPS en temps réel.",
                color: "from-blue-500 to-blue-600",
                glow: "shadow-blue-500/30"
              },
              { 
                icon: Store, 
                title: "Marketplace", 
                desc: "Achetez des pièces détachées authentiques à prix réduit.",
                color: "from-green-500 to-green-600",
                glow: "shadow-green-500/30"
              },
              { 
                icon: MessageCircle, 
                title: "Assistant IA", 
                desc: "Diagnostic instantané et conseils d'entretien personnalisés.",
                color: "from-purple-500 to-purple-600",
                glow: "shadow-purple-500/30"
              },
              { 
                icon: Truck, 
                title: "Suivi véhicule", 
                desc: "Carnet de santé numérique avec historique complet des réparations.",
                color: "from-yellow-500 to-yellow-600",
                glow: "shadow-yellow-500/30"
              },
              { 
                icon: CreditCard, 
                title: "Paiement sécurisé", 
                desc: "Payez en toute sécurité. Garantie satisfait ou remboursé.",
                color: "from-brand-orange to-orange-600",
                glow: "shadow-orange-500/30"
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative"
              >
                <div className="glass rounded-3xl p-8 h-full border border-white/10 hover:border-brand-orange/50 transition-all duration-500">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-white/60 leading-relaxed">{feature.desc}</p>
                  
                  <motion.div 
                    className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="w-5 h-5 text-brand-orange" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-medium mb-4">
              Comment ça marche
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Simple et rapide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Créez votre compte", desc: "Inscription en 30 secondes avec votre téléphone", color: "brand-orange" },
              { step: "02", title: "Décrivez votre besoin", desc: "SOS, mécanicien ou pièces - on s'occupe de tout", color: "blue-500" },
              { step: "03", title: "Solution instantanée", desc: "Mécanicien assigné ou pièces commandées en quelques clics", color: "green-500" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index === 0 ? -50 : index === 2 ? 50 : 0, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                className="relative"
              >
                <div className="glass rounded-3xl p-8 text-center relative overflow-hidden">
                  <div className={`text-7xl font-bold text-${item.color} opacity-20 absolute top-4 left-4`}>
                    {item.step}
                  </div>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-${item.color}/20 flex items-center justify-center relative z-10`}>
                    <span className={`text-2xl font-bold text-${item.color}`}>{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                  <p className="text-white/60 relative z-10">{item.desc}</p>
                </div>
                
                {index < 2 && (
                  <motion.div 
                    className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 + 0.3 }}
                  >
                    <ArrowRight className="w-8 h-8 text-brand-orange" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════════ */}
      <section id="reviews" className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-brand-orange/20 text-brand-orange text-sm font-medium mb-4">
              Témoignages
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ils nous font confiance
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Marie K.", role: "Propriétaire", avatar: "MK", comment: "Incroyable ! Mon pneu crevé réparé en 20 min. Service ultra rapide !", rating: 5 },
              { name: "Koffi B.", role: "Chauffeur VTC", avatar: "KB", comment: "J'utilise Meca Master pour toutes mes pannes. Prix justes et mécaniciens pros.", rating: 5 },
              { name: "Aminata D.", role: "Entrepreneuse", avatar: "AD", comment: "Le marketplace est génial ! Pièces à moitié prix, livraison en 24h.", rating: 5 },
            ].map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 40, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass rounded-3xl p-8 relative overflow-hidden group"
              >
                <Quote className="absolute top-6 right-6 w-10 h-10 text-brand-orange/20" />
                
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                
                <p className="text-white/80 mb-6 italic leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-orange-600 flex items-center justify-center text-white font-bold">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{review.name}</p>
                    <p className="text-white/50 text-sm">{review.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          DOWNLOAD SECTION
          ═══════════════════════════════════════════════════════════════ */}
      <section id="download" className="relative py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/20 via-purple-600/10 to-blue-600/20" />
            
            <div className="relative z-10">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-6xl font-bold text-white mb-6"
              >
                Téléchargez maintenant
              </motion.h2>
              
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
                Disponible sur Android et PC. Installez l&apos;application et rejoignez la communauté.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    className="h-16 px-8 text-lg bg-white text-gray-900 hover:bg-gray-100 shadow-xl"
                    onClick={() => router.push("/auth/register")}
                  >
                    <Smartphone className="mr-3 h-6 w-6" />
                    <div className="text-left">
                      <p className="text-xs text-gray-500">Télécharger sur</p>
                      <p className="font-bold">Android</p>
                    </div>
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-16 px-8 text-lg border-2 border-white/30 text-white hover:bg-white/10"
                    onClick={() => router.push("/auth/register")}
                  >
                    <Monitor className="mr-3 h-6 w-6" />
                    <div className="text-left">
                      <p className="text-xs text-white/50">Installer sur</p>
                      <p className="font-bold">Windows / Mac</p>
                    </div>
                  </Button>
                </motion.div>
              </div>

              <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-white/50">
                {["Gratuit", "Sans publicité", "Mises à jour auto"].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-orange" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative py-20 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-brand-orange to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-bold text-white">Meca Master</span>
              </div>
              <p className="text-white/60 max-w-md mb-6">
                Votre solution complète pour la maintenance automobile. 
                Mécaniciens qualifiés, marketplace et assistance IA.
              </p>
              <div className="flex gap-4">
                {["facebook", "twitter", "instagram"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-orange transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-white/80 rounded-sm" />
                  </motion.a>
                ))}
              </div>
            </div>

            {[
              { title: "Produit", links: ["Fonctionnalités", "Tarifs", "Télécharger"] },
              { title: "Support", links: ["Aide", "Contact", "FAQ"] },
            ].map((section) => (
              <div key={section.title}>
                <h4 className="text-white font-semibold mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-white/60 hover:text-brand-orange transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/40 text-sm">
              © 2026 Meca Master. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              <span>en Côte d&apos;Ivoire</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
