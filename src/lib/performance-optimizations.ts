// 🚀 OPTIMISATIONS PERFORMANCE - Meca Master
// Code ultra-rapide et optimisé pour le Cameroun

import { useCallback, useMemo, useRef, useEffect } from 'react';

// 🎯 Memoization intelligente
export const useMemoizedCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

export const useMemoizedValue = <T>(
  factory: () => T,
  deps: React.DependencyList
): T => {
  return useMemo(factory, deps);
};

// ⚡ Debounce pour les recherches et inputs
export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
};

// 🚀 Throttle pour les scroll et resize
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
};

// 📱 Lazy loading des images
export const useLazyImage = (src: string, placeholder?: string) => {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoading, setIsLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
              setImageSrc(src);
              setIsLoading(false);
            };
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return { imageSrc, isLoading, imgRef };
};

// 🎨 Optimisation des animations
export const useOptimizedAnimation = (
  trigger: boolean,
  animation: string,
  duration: number = 300
) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return isAnimating;
};

// 💾 Cache local optimisé
export class LocalCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 300000): void { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }

  // Nettoyer les entrées expirées
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

export const appCache = new LocalCache();

// 🌐 Optimisation des appels API
export class ApiOptimizer {
  private pendingRequests = new Map<string, Promise<any>>();

  // Éviter les doublons de requêtes
  async deduplicatedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key);
    }

    const request = requestFn().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, request);
    return request;
  }

  // Retry automatique avec backoff exponentiel
  async retryWithBackoff<T>(
    requestFn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        lastError = error as Error;
        
        if (i === maxRetries) break;
        
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }
}

export const apiOptimizer = new ApiOptimizer();

// 📱 Optimisation mobile
export const useMobileOptimizations = () => {
  const [isLowEndDevice, setIsLowEndDevice] = useState(false);
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  useEffect(() => {
    // Détecter les appareils bas de gamme
    const checkDevicePerformance = () => {
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
      
      if (connection) {
        setIsSlowConnection(connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
      }

      // Détecter la mémoire disponible (si disponible)
      if ('deviceMemory' in navigator) {
        const memory = (navigator as any).deviceMemory;
        setIsLowEndDevice(memory < 4); // Moins de 4GB RAM
      }
    };

    checkDevicePerformance();
  }, []);

  return {
    isLowEndDevice,
    isSlowConnection,
    shouldReduceAnimations: isLowEndDevice || isSlowConnection,
    shouldUseLowResImages: isSlowConnection
  };
};

// 🎨 Optimisation des couleurs et thèmes
export const optimizedColors = {
  primary: '#FF8C42',
  secondary: '#00D4FF',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  // Couleurs optimisées pour le contraste au Cameroun
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  background: '#ffffff',
  surface: '#f9fafb',
} as const;

// 🚀 Optimisation du rendu des listes
export const useVirtualizedList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      top: (startIndex + index) * itemHeight
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);

  const totalHeight = items.length * itemHeight;

  return {
    visibleItems,
    totalHeight,
    onScroll: useCallback((e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    }, [])
  };
};

// 📊 Optimisation des graphiques et statistiques
export const useOptimizedChart = (data: any[], maxDataPoints: number = 50) => {
  return useMemo(() => {
    if (data.length <= maxDataPoints) return data;
    
    // Échantillonnage intelligent pour les grands datasets
    const step = Math.ceil(data.length / maxDataPoints);
    return data.filter((_, index) => index % step === 0);
  }, [data, maxDataPoints]);
};

// 🔧 Optimisation des formulaires
export const useOptimizedForm = <T extends Record<string, any>>(
  initialValues: T,
  validate?: (values: T) => Partial<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name] && validate) {
      const newErrors = validate({ ...values, [name]: value });
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  }, [values, touched, validate]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    if (validate) {
      const newErrors = validate(values);
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }));
    }
  }, [values, validate]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0 && Object.keys(touched).length > 0;
  }, [errors, touched]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    isValid,
    setValues
  };
};

// 🌐 Service Worker pour le cache offline
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker enregistré:', registration);
      
      // Mise à jour automatique
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Nouvelle version disponible
              if (confirm('🚀 Nouvelle version disponible ! Recharger maintenant ?')) {
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('❌ Erreur Service Worker:', error);
    }
  }
};

// 📱 Optimisation de la batterie
export const useBatteryOptimization = () => {
  const [isLowBattery, setIsLowBattery] = useState(false);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          setIsLowBattery(battery.level < 0.2);
        };

        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);

        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      });
    }
  }, []);

  return {
    isLowBattery,
    shouldReduceAnimations: isLowBattery,
    shouldDisableBackgroundTasks: isLowBattery
  };
};

// 🎯 Performance monitoring
export const usePerformanceMonitor = () => {
  const metrics = useRef({
    renderTime: 0,
    apiCalls: 0,
    errors: 0,
    memoryUsage: 0
  });

  const measureRenderTime = useCallback((name: string) => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      metrics.current.renderTime += renderTime;
      
      if (renderTime > 100) { // Alert si > 100ms
        console.warn(`⚠️ Rendu lent pour ${name}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, []);

  const trackApiCall = useCallback(() => {
    metrics.current.apiCalls++;
  }, []);

  const trackError = useCallback(() => {
    metrics.current.errors++;
  }, []);

  const getMetrics = useCallback(() => {
    if ('memory' in performance) {
      metrics.current.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }
    
    return { ...metrics.current };
  }, []);

  return {
    measureRenderTime,
    trackApiCall,
    trackError,
    getMetrics
  };
};

// 🚀 Export principal
export const performanceUtils = {
  useMemoizedCallback,
  useMemoizedValue,
  useDebounce,
  useThrottle,
  useLazyImage,
  useOptimizedAnimation,
  appCache,
  apiOptimizer,
  useMobileOptimizations,
  optimizedColors,
  useVirtualizedList,
  useOptimizedChart,
  useOptimizedForm,
  registerServiceWorker,
  useBatteryOptimization,
  usePerformanceMonitor
};
