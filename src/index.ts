/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    📦 MECA MASTER - INDEX CENTRAL                              ║
 * ║                  Point d'entrée unique pour tous les modules                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 * 
 * CE FICHIER EST L'INDEX PRINCIPAL - Il exporte tout depuis un seul point
 * Importez tout depuis '@/index' ou '@/lib/brain'
 */

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT DU CERVEAU (Logique centrale)
// ═══════════════════════════════════════════════════════════════════════════════
export {
  // Configuration
  APP_CONFIG,
  CONSTANTS,
  
  // Types
  type UserRole,
  type MissionStatus,
  type OrderStatus,
  type GeoLocation,
  
  // Fonctions cerveau
  getRoleConfig,
  getRedirectPath,
  calculateMissionPrice,
  findBestMechanic,
  generateAIContext,
  isActionAuthorized,
} from "./lib/brain";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT UTILITAIRES
// ═══════════════════════════════════════════════════════════════════════════════
export {
  // Fonctions de base
  cn,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  
  // Calculs
  calculateDistance,
  calculateAge,
  
  // Helpers
  truncateText,
  generateSlug,
  getInitials,
  debounce,
  
  // Validation
  validatePhoneNumber,
  validateEmail,
  
  // Files
  fileToBase64,
  compressImage,
  
  // Status
  getStatusColor,
  getRoleColor,
  getRoleLabel,
} from "./lib/utils";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT DATABASE & SCHEMA
// ═══════════════════════════════════════════════════════════════════════════════
export {
  // Tables
  users,
  userProfiles,
  mechanicProfiles,
  enterpriseProfiles,
  vehicles,
  sosRequests,
  missions,
  products,
  orders,
  orderItems,
  transactions,
  reviews,
  vehicleHealthRecords,
  mechanicAffiliations,
  notifications,
  aiChatHistory,
  
  // Enums
  userRoleEnum,
  userStatusEnum,
  subscriptionTypeEnum,
  missionStatusEnum,
  orderStatusEnum,
  transactionTypeEnum,
  transactionStatusEnum,
  sosStatusEnum,
  enterpriseTypeEnum,
  
  // Types
  type User,
  type NewUser,
  type Vehicle,
  type NewVehicle,
  type SOSRequest,
  type NewSOSRequest,
  type Mission,
  type NewMission,
  type Product,
  type NewProduct,
  type Order,
  type NewOrder,
  type Transaction,
  type NewTransaction,
  type Review,
  type NewReview,
  type Notification,
  type NewNotification,
} from "./lib/db/schema";

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORT SUPABASE
// ═══════════════════════════════════════════════════════════════════════════════
export {
  supabase,
  supabaseAdmin,
} from "./lib/supabase";

// ═══════════════════════════════════════════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════════════════════════════════════════
export {
  useToast,
  toast,
  type ToastProps,
} from "./hooks/use-toast";

// ═══════════════════════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════════════════════
// VERSION & INFO
// ═══════════════════════════════════════════════════════════════════════════════
export const APP_VERSION = "1.0.0";
export const APP_NAME = "Meca Master";
export const APP_DESCRIPTION = "Votre mécanicien en un clic";

// Message console
console.log(`🚀 ${APP_NAME} v${APP_VERSION} - All modules loaded!`);
