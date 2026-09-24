export type Language = 'en' | 'km';
export type Currency = 'USD' | 'KHR';

export type UserRole = 'customer' | 'vendor' | 'admin';

export type OfferingType = 'product' | 'service' | 'metal';

export type KycStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type KycTier = 'Tier 1 ($1,000)' | 'Tier 2 ($50,000)' | 'Tier 3 (Institutional Unlimited)';

export interface KycDocument {
  idType: 'national_id' | 'passport' | 'business_license';
  idNumber: string;
  fullName: string;
  dob: string;
  frontDocUrl: string;
  backDocUrl: string;
  selfieUrl: string;
  submittedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export interface UserAddress {
  street: string;
  sangkat: string; // Commune
  khan: string;    // District
  province: string;// E.g. Phnom Penh, Siem Reap, Battambang
  postalCode?: string;
}

export interface UserEmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserBankAccount {
  bankName: 'ABA' | 'Wing' | 'ACLEDA' | 'Canadia' | 'Sathapana';
  accountNumber: string;
  accountHolder: string;
  bakongAccountId?: string; // e.g. sophath_san@aba
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  vendorId?: string;
  avatarUrl?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: string;
  bio?: string;
  companyName?: string;
  taxIdentificationNumber?: string;
  address?: UserAddress;
  bankAccount?: UserBankAccount;
  emergencyContact?: UserEmergencyContact;
  twoFactorEnabled?: boolean;
  walletBalanceUsd: number;
  walletBalanceKhr: number;
  joinedDate: string;
  kycStatus: KycStatus;
  kycTier: KycTier;
  kycDoc?: KycDocument;
  accountStatus: 'active' | 'suspended' | 'pending_review';
  bullionHoldingGrams?: number;
  cashbackEarnedUsd?: number;
  referralEarningsUsd?: number;
}

export type MetalType = 'gold' | 'silver' | 'platinum' | 'copper';

export interface ListingItem {
  id: string;
  type: OfferingType;
  title: string;
  titleKm: string;
  subtitle: string;
  subtitleKm: string;
  description: string;
  descriptionKm: string;
  priceUsd: number;
  originalPriceUsd?: number;
  image: string;
  vendorId: string;
  vendorName: string;
  vendorNameKm: string;
  vendorLocation: string;
  vendorVerified: boolean;
  category: string;
  categoryKm: string;
  rating: number;
  reviewCount: number;
  
  // Specific for Physical Products
  inventoryCount?: number;
  sku?: string;
  weightGrams?: number;

  // Specific for Services
  serviceDuration?: string;
  serviceType?: 'consulting' | 'tech_development' | 'logistics' | 'installation';

  // Specific for Precious Metals
  metalType?: MetalType;
  purity?: string;
  metalWeightGrams?: number;
  metalWeightChi?: number; // 1 Chi = 3.75 grams (Cambodian gold unit)
  metalWeightDamloeng?: number; // 1 Damloeng = 37.5 grams (10 Chi)
  assayCertified?: boolean;
  vaultEligible?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  nameKm: string;
  logo: string;
  coverImage: string;
  tagline: string;
  taglineKm: string;
  description?: string;
  descriptionKm?: string;
  location: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  operatingHours?: string;
  deliveryPromise?: string;
  rating: number;
  totalSales: number;
  totalRevenueUsd: number;
  verified: boolean;
  joinedDate: string;
  categories: OfferingType[];
  commissionRatePercent?: number;
  customProfitMarginPercent?: number;
  mocLicenseNumber?: string;
  patentTaxNumber?: string;
  status?: 'active' | 'suspended' | 'pending';
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    bakongAccountId?: string;
  };
}

export interface CartItem {
  item: ListingItem;
  quantity: number;
  deliveryOption?: 'standard_courier' | 'armored_vault_delivery' | 'digital_consultation';
}

export type DeliveryStatus = 
  | 'order_confirmed'
  | 'preparing_dispatch'
  | 'picked_up_courier'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered';

export interface TrackingMilestone {
  stage: DeliveryStatus;
  label: string;
  labelKm: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface OrderItemRecord {
  itemId: string;
  title: string;
  type: OfferingType;
  vendorId: string;
  vendorName: string;
  quantity: number;
  unitPriceUsd: number;
  totalPriceUsd: number;
  image: string;
}

export type LocalPaymentMethod = 'wallet' | 'khqr' | 'aba' | 'wing' | 'acleda';

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCity: string;
  items: OrderItemRecord[];
  subtotalUsd: number;
  shippingFeeUsd: number;
  totalUsd: number;
  totalKhr: number;
  paymentMethod: LocalPaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  deliveryStatus: DeliveryStatus;
  trackingNumber: string;
  courierName: string;
  courierPhone: string;
  estimatedDeliveryDate: string;
  milestones: TrackingMilestone[];
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit_khqr' | 'order_payment' | 'vendor_payout' | 'transfer' | 'cashback' | 'yield';
  amountUsd: number;
  amountKhr: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'processing';
  reference: string;
  method?: string;
}

export interface MetalSpotPrice {
  metal: MetalType;
  symbol: string;
  pricePerGramUsd: number;
  pricePerChiUsd: number; // 3.75g
  pricePerTroyOzUsd: number; // 31.1035g
  change24h: number; // percentage
}

export interface NotificationItem {
  id: string;
  title: string;
  titleKm?: string;
  message: string;
  messageKm?: string;
  type: 'order' | 'wallet' | 'kyc' | 'system' | 'metal';
  timestamp: string;
  isRead: boolean;
  targetTab?: string;
}

export interface PlatformBrandingSettings {
  platformName: string;
  platformTagline: string;
  platformTaglineKm: string;
  logoText: string;
  primaryAccent: string;
  usdToKhrRate: number;
  defaultCommissionPercent: number;
  vatTaxPercent: number;
  armoredTransportBaseFeeUsd: number;
  bakongMerchantId: string;
  maintenanceMode: boolean;
  allowPublicRegistrations: boolean;
  kycRequiredForBullion: boolean;
}

export interface ProfitCustomSettings {
  // Customer settings
  bullionVaultYieldApy: number; // e.g. 3.5%
  cashbackRewardPercent: number; // e.g. 1.2%
  referralCommissionPercent: number; // e.g. 2.0%
  autoReinvestDividends: boolean;
  
  // Vendor settings
  vendorTargetProfitMarginPercent: number; // e.g. 18.0%
  goldSpotMarkupPercent: number; // e.g. 4.2%
  silverSpotMarkupPercent: number; // e.g. 5.0%
  instantPayoutThresholdUsd: number; // e.g. 500
}

export interface VendorPayout {
  id: string;
  vendorId: string;
  amountUsd: number;
  amountKhr: number;
  bankName: string;
  accountNumber: string;
  accountHolder?: string;
  bakongAccountId?: string;
  status: 'completed' | 'processing' | 'pending';
  referenceNumber: string;
  createdAt: string;
}

export interface BannerAdv {
  id: string;
  title: string;
  titleKm?: string;
  subtitle: string;
  subtitleKm?: string;
  badge?: string;
  badgeKm?: string;
  imageUrl: string;
  ctaText: string;
  ctaTextKm?: string;
  ctaCategory?: OfferingType | 'all';
  ctaLinkTab?: string;
  isActive: boolean;
  order: number;
  gradientOverlay?: string;
  createdAt: string;
}
