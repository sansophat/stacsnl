import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  Currency, 
  UserRole, 
  UserProfile, 
  OfferingType, 
  ListingItem, 
  Vendor, 
  CartItem, 
  Order, 
  DeliveryStatus, 
  LocalPaymentMethod, 
  WalletTransaction, 
  MetalSpotPrice,
  NotificationItem,
  PlatformBrandingSettings,
  ProfitCustomSettings,
  KycStatus,
  KycTier,
  KycDocument,
  VendorPayout,
  BannerAdv
} from '../types';
import { translations } from '../i18n/translations';
import { 
  initialListings, 
  initialVendors, 
  initialOrders, 
  initialWalletTransactions, 
  initialMetalSpotPrices,
  initialBanners
} from '../data/seedData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export const INITIAL_PLATFORM_SETTINGS: PlatformBrandingSettings = {
  platformName: 'SNL RICH Eco',
  platformTagline: 'Multi-Vendor Marketplace: Products, Services & Precious Metals',
  platformTaglineKm: 'ផ្សារពាណិជ្ជកម្មពហុអាជីវករ៖ ទំនិញ សេវាកម្ម និងលោហធាតុមានតម្លៃ',
  logoText: 'SNL RICH Eco',
  primaryAccent: '#2563eb', // blue-600
  usdToKhrRate: 4100,
  defaultCommissionPercent: 3.5,
  vatTaxPercent: 10.0,
  armoredTransportBaseFeeUsd: 15.00,
  bakongMerchantId: 'snl_rich_eco@nbc.bakong',
  maintenanceMode: false,
  allowPublicRegistrations: true,
  kycRequiredForBullion: true
};

export const INITIAL_PROFIT_SETTINGS: ProfitCustomSettings = {
  bullionVaultYieldApy: 3.8,
  cashbackRewardPercent: 1.5,
  referralCommissionPercent: 2.5,
  autoReinvestDividends: true,
  vendorTargetProfitMarginPercent: 22.0,
  goldSpotMarkupPercent: 4.5,
  silverSpotMarkupPercent: 6.0,
  instantPayoutThresholdUsd: 500
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'NBC Bakong KHQR Settlement',
    titleKm: 'ការទូទាត់តាមបាគង KHQR ជោគជ័យ',
    message: 'Your recent order SNL-ORD-882910 was settled via ABA Bakong with zero clearance fee.',
    messageKm: 'ការបញ្ជាទិញ SNL-ORD-882910 របស់អ្នកត្រូវបានទូទាត់តាម ABA បាគងដោយជោគជ័យ។',
    type: 'wallet',
    timestamp: '10 mins ago',
    isRead: false,
    targetTab: 'wallet'
  },
  {
    id: 'notif-2',
    title: '24K Gold Bullion Spot Alert',
    titleKm: 'ដំណឹងតម្លៃទីផ្សារមាសទឹកដប់ 24K',
    message: 'Angkor Heritage Gold Spot increased +1.42% to $84.20/g ($315.75/Chi).',
    messageKm: 'តម្លៃមាសសុទ្ធបានកើនឡើង +1.42% ដល់ $84.20 ក្នុងមួយក្រាម ($315.75/ជី)។',
    type: 'metal',
    timestamp: '35 mins ago',
    isRead: false,
    targetTab: 'marketplace'
  },
  {
    id: 'notif-3',
    title: 'Armored Vault Logistics Dispatch',
    titleKm: 'រថយន្តពាសដែកបានចេញដំណើរដឹកជញ្ជូន',
    message: 'Armored transport vehicle AT-09 has departed Phnom Penh Vault Hub heading to delivery destination.',
    messageKm: 'រថយន្តពាសដែកលេខ AT-09 បានចាកចេញពីឃ្លាំងរាជធានីភ្នំពេញ ឆ្ពោះទៅកាន់គោលដៅ។',
    type: 'order',
    timestamp: '2 hours ago',
    isRead: true,
    targetTab: 'tracking'
  },
  {
    id: 'notif-4',
    title: 'KYB Merchant Verified',
    titleKm: 'អាជីវករត្រូវបានផ្ទៀងផ្ទាត់ KYB',
    message: 'Angkor Royal Bullion Co. license renewal audited and approved for 2026/2027.',
    messageKm: 'អាជ្ញាប័ណ្ណ Angkor Royal Bullion Co. ត្រូវបានផ្ទៀងផ្ទាត់ និងអនុម័តរួចរាល់។',
    type: 'kyc',
    timestamp: '1 day ago',
    isRead: true,
    targetTab: 'vendors'
  }
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-01',
    name: 'Chhay Seng',
    email: 'admin@snlrich.eco',
    phone: '+855 23 881 999',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    gender: 'male',
    dob: '1988-09-14',
    bio: 'Chief Governance Administrator for SNL RICH Eco Platform & Kingdom Bullion Depository.',
    address: {
      street: 'Vattanac Capital Tower, Level 28, Monivong Blvd',
      sangkat: 'Voat Phnum',
      khan: 'Doun Penh',
      province: 'Phnom Penh',
      postalCode: '120211'
    },
    bankAccount: {
      bankName: 'ABA',
      accountNumber: '000 112 990',
      accountHolder: 'SNL RICH ECO PLATFORM GOVERNANCE',
      bakongAccountId: 'snl_rich_gov@aba'
    },
    emergencyContact: {
      name: 'Dr. Vanna Seng',
      phone: '+855 12 771 223',
      relationship: 'Spouse'
    },
    twoFactorEnabled: true,
    walletBalanceUsd: 50000.00,
    walletBalanceKhr: 205000000,
    joinedDate: '2023-08-01',
    kycStatus: 'verified',
    kycTier: 'Tier 3 (Institutional Unlimited)',
    accountStatus: 'active',
    bullionHoldingGrams: 500,
    cashbackEarnedUsd: 1240.50,
    referralEarningsUsd: 3820.00
  },
  {
    id: 'v-angkor-bullion',
    name: 'Angkor Royal Bullion Co.',
    email: 'vendor@angkorbullion.com',
    phone: '+855 12 778 899',
    role: 'vendor',
    vendorId: 'v-angkor-bullion',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    companyName: 'Angkor Royal Bullion Co., Ltd.',
    taxIdentificationNumber: 'K002-901882194',
    bio: 'Official licensed precious metals refiner and assay certified gold bullion depository in Phnom Penh.',
    address: {
      street: '#88, Preah Norodom Blvd',
      sangkat: 'Tonle Bassac',
      khan: 'Chamkar Mon',
      province: 'Phnom Penh',
      postalCode: '120101'
    },
    bankAccount: {
      bankName: 'ABA',
      accountNumber: '000 882 192',
      accountHolder: 'ANGKOR ROYAL BULLION CO LTD',
      bakongAccountId: 'angkor_bullion@aba'
    },
    emergencyContact: {
      name: 'Vong Rathana',
      phone: '+855 17 889 001',
      relationship: 'Operations Director'
    },
    twoFactorEnabled: true,
    walletBalanceUsd: 14200.00,
    walletBalanceKhr: 58220000,
    joinedDate: '2024-01-15',
    kycStatus: 'verified',
    kycTier: 'Tier 3 (Institutional Unlimited)',
    accountStatus: 'active',
    bullionHoldingGrams: 3750, // 100 Damloeng
    cashbackEarnedUsd: 840.00,
    referralEarningsUsd: 1200.00
  },
  {
    id: 'user-sophath-01',
    name: 'Sophath San',
    email: 'sansophatweb3@gmail.com',
    phone: '+855 12 889 912',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    gender: 'male',
    dob: '1995-04-12',
    bio: 'FinTech developer and 24K gold bullion investor in Phnom Penh. Verified Bakong KHQR user.',
    address: {
      street: '#42, Street 214 (Samdech Pan Ave)',
      sangkat: 'Boeung Reang',
      khan: 'Daun Penh',
      province: 'Phnom Penh',
      postalCode: '120204'
    },
    bankAccount: {
      bankName: 'ABA',
      accountNumber: '000 882 192',
      accountHolder: 'SOPHATH SAN',
      bakongAccountId: 'sophath_san@aba'
    },
    emergencyContact: {
      name: 'Sophea San',
      phone: '+855 12 998 877',
      relationship: 'Sister'
    },
    twoFactorEnabled: true,
    walletBalanceUsd: 1410.00,
    walletBalanceKhr: 5781000,
    joinedDate: '2024-01-01',
    kycStatus: 'verified',
    kycTier: 'Tier 2 ($50,000)',
    accountStatus: 'active',
    bullionHoldingGrams: 37.5, // 1 Damloeng Gold
    cashbackEarnedUsd: 68.40,
    referralEarningsUsd: 145.00
  },
  {
    id: 'user-borey-02',
    name: 'Borey Vuthy',
    email: 'borey.vuthy@gmail.com',
    phone: '+855 10 992 110',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    gender: 'male',
    dob: '1998-11-20',
    bio: 'Agritech specialist exploring modern irrigation and organic pepper supply.',
    address: {
      street: '#15, Street 60M (Hunky Highway)',
      sangkat: 'Chak Angre Kraom',
      khan: 'Mean Chey',
      province: 'Phnom Penh',
      postalCode: '120602'
    },
    bankAccount: {
      bankName: 'Wing',
      accountNumber: '098 776 543',
      accountHolder: 'BOREY VUTHY',
      bakongAccountId: 'borey_vuthy@wing'
    },
    emergencyContact: {
      name: 'Chan Vuthy',
      phone: '+855 10 554 433',
      relationship: 'Brother'
    },
    twoFactorEnabled: false,
    walletBalanceUsd: 850.00,
    walletBalanceKhr: 3485000,
    joinedDate: '2024-02-10',
    kycStatus: 'pending',
    kycTier: 'Tier 1 ($1,000)',
    accountStatus: 'active',
    bullionHoldingGrams: 7.5,
    cashbackEarnedUsd: 22.10,
    referralEarningsUsd: 40.00
  },
  {
    id: 'user-kiri-03',
    name: 'Kirirom Eco Tech Supplies',
    email: 'kirirom.tech@outlook.com',
    phone: '+855 97 554 321',
    role: 'vendor',
    vendorId: 'v-eco-agritech',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    companyName: 'Kirirom Eco Tech Enterprise',
    taxIdentificationNumber: 'K009-881927311',
    bio: 'Smart solar sensors, sustainable irrigation systems and high-tech agricultural equipment.',
    address: {
      street: 'National Road 4, Phum 3',
      sangkat: 'Treng Trayeung',
      khan: 'Phnom Sruoch',
      province: 'Kampong Speu',
      postalCode: '050201'
    },
    bankAccount: {
      bankName: 'ACLEDA',
      accountNumber: '100 234 887',
      accountHolder: 'KIRIROM ECO TECH',
      bakongAccountId: 'kirirom_tech@acleda'
    },
    emergencyContact: {
      name: 'Sokha Meng',
      phone: '+855 97 881 299',
      relationship: 'Chief Accountant'
    },
    twoFactorEnabled: true,
    walletBalanceUsd: 4200.00,
    walletBalanceKhr: 17220000,
    joinedDate: '2024-03-01',
    kycStatus: 'verified',
    kycTier: 'Tier 2 ($50,000)',
    accountStatus: 'active',
    bullionHoldingGrams: 0,
    cashbackEarnedUsd: 110.00,
    referralEarningsUsd: 290.00
  }
];

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (amountInUsd: number) => string;

  // Authentication & Users
  isAuthenticated: boolean;
  currentUser: UserProfile | null;
  allUsers: UserProfile[];
  login: (email: string, password?: string) => boolean;
  loginAsDemo: (role: UserRole) => void;
  register: (userData: { name: string; email: string; phone: string; role: UserRole }) => void;
  logout: () => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended' | 'pending_review') => void;
  updateUserKyc: (userId: string, status: KycStatus, tier: KycTier) => void;
  submitKycVerification: (doc: KycDocument) => void;
  updateUserProfile: (profileData: Partial<UserProfile>) => void;

  // Sidebar Layout State
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;

  // Active Tab
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Catalog & Spot Prices
  listings: ListingItem[];
  vendors: Vendor[];
  currentVendor: Vendor | null;
  updateVendorProfile: (vendorId: string, updatedData: Partial<Vendor>) => void;
  metalSpotPrices: MetalSpotPrice[];
  updateMetalSpotPrice: (metal: MetalSpotPrice['metal'], newPriceGram: number) => void;
  offeringFilter: OfferingType | 'all';
  setOfferingFilter: (filter: OfferingType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedItem: ListingItem | null;
  setSelectedItem: (item: ListingItem | null) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: ListingItem, quantity?: number, deliveryOption?: 'standard_courier' | 'armored_vault_delivery') => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalUsd: number;
  cartDeliveryFeeUsd: number;
  cartTotalUsd: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders & Delivery Tracking
  orders: Order[];
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;
  trackOrderByNumber: (trackingNumber: string) => Order | null;
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    shippingCity: string;
    paymentMethod: LocalPaymentMethod;
    notes?: string;
  }) => Order | null;
  advanceDeliveryStatus: (orderId: string) => void;

  // Wallet & Local Bank Payments
  walletBalanceUsd: number;
  walletBalanceKhr: number;
  walletTransactions: WalletTransaction[];
  depositToWallet: (amountUsd: number, method?: string) => void;
  withdrawFromWallet: (amountUsd: number, bankName: string, accountNumber: string) => boolean;
  activePaymentModalOrder: Order | null;
  setActivePaymentModalOrder: (order: Order | null) => void;
  confirmPaymentForOrder: (orderId: string) => void;

  // Vendor Management Actions
  addNewListing: (listing: Partial<ListingItem>) => void;
  updateListing: (itemId: string, updatedData: Partial<ListingItem>) => void;
  deleteListing: (itemId: string) => void;
  updateListingStock: (itemId: string, newInventoryCount: number) => void;
  updateOrderDelivery: (orderId: string, updates: {
    deliveryStatus: DeliveryStatus;
    courierName?: string;
    courierPhone?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    locationNote?: string;
  }) => void;
  vendorPayouts: VendorPayout[];
  requestVendorPayout: (vendorId: string, amountUsd: number, payoutDetails: { bankName: string; accountNumber: string; accountHolder?: string; bakongId?: string }) => boolean;
  updateVendorOrderStatus: (orderId: string, status: DeliveryStatus) => void;
  updateVendorCommission: (vendorId: string, commissionPercent: number) => void;
  updateVendorProfitMargin: (vendorId: string, marginPercent: number) => void;
  updateVendorStatus: (vendorId: string, status: 'active' | 'suspended' | 'pending') => void;

  // Admin Management Actions
  toggleVendorVerification: (vendorId: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Platform & Branding Settings
  platformSettings: PlatformBrandingSettings;
  updatePlatformSettings: (settings: Partial<PlatformBrandingSettings>) => void;

  // Profit Custom Settings
  profitSettings: ProfitCustomSettings;
  updateProfitSettings: (settings: Partial<ProfitCustomSettings>) => void;

  // Banner Advertisements & Slideshow
  banners: BannerAdv[];
  addBanner: (bannerData: Omit<BannerAdv, 'id' | 'createdAt'>) => void;
  updateBanner: (id: string, updates: Partial<BannerAdv>) => void;
  deleteBanner: (id: string) => void;
  toggleBannerActive: (id: string) => void;
  reorderBanners: (orderedIds: string[]) => void;

  // Guest / Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Toasts
  toasts: Toast[];
  addToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'snl_rich_eco_v2_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language & Theme
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + 'lang') as Language) || 'en';
  });

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem(STORAGE_PREFIX + 'theme') as 'light' | 'dark') || 'light';
  });

  const [currency, setCurrency] = useState<Currency>('USD');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_PREFIX + 'lang', lang);
  };

  const t = translations[language];

  // 2. Platform Branding Settings
  const [platformSettings, setPlatformSettings] = useState<PlatformBrandingSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'platform_settings');
      return saved ? JSON.parse(saved) : INITIAL_PLATFORM_SETTINGS;
    } catch {
      return INITIAL_PLATFORM_SETTINGS;
    }
  });

  const updatePlatformSettings = (newSettings: Partial<PlatformBrandingSettings>) => {
    setPlatformSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_PREFIX + 'platform_settings', JSON.stringify(updated));
      return updated;
    });
    addToast('Platform governance & branding settings updated!', 'success');
  };

  // 3. Profit Custom Settings
  const [profitSettings, setProfitSettings] = useState<ProfitCustomSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'profit_settings');
      return saved ? JSON.parse(saved) : INITIAL_PROFIT_SETTINGS;
    } catch {
      return INITIAL_PROFIT_SETTINGS;
    }
  });

  const updateProfitSettings = (newSettings: Partial<ProfitCustomSettings>) => {
    setProfitSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem(STORAGE_PREFIX + 'profit_settings', JSON.stringify(updated));
      return updated;
    });
    addToast('Profit & yield configurations updated!', 'success');
  };

  // 4. Users Database
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'all_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'all_users', JSON.stringify(allUsers));
  }, [allUsers]);

  // Current User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'current_user');
      return saved ? JSON.parse(saved) : INITIAL_USERS[2]; // Sophath
    } catch {
      return INITIAL_USERS[2];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem(STORAGE_PREFIX + 'auth');
    return savedAuth !== null ? savedAuth === 'true' : true;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_PREFIX + 'current_user');
    }
    localStorage.setItem(STORAGE_PREFIX + 'auth', isAuthenticated ? 'true' : 'false');
  }, [currentUser, isAuthenticated]);

  // Active tab state depends on the user's role
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (currentUser?.role === 'admin') return 'admin_hub';
    if (currentUser?.role === 'vendor') return 'vendor_hub';
    return 'dashboard';
  });

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadNotificationCount = notifications.filter(n => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    addToast('All notifications marked as read', 'info');
  };

  const clearNotifications = () => {
    setNotifications([]);
    addToast('Notification history cleared', 'info');
  };

  // User Management Actions
  const updateUserStatus = (userId: string, status: 'active' | 'suspended' | 'pending_review') => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, accountStatus: status } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, accountStatus: status } : null);
    }
    addToast(`User account status updated to ${status.toUpperCase()}`, 'info');
  };

  const updateUserKyc = (userId: string, status: KycStatus, tier: KycTier) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, kycStatus: status, kycTier: tier } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, kycStatus: status, kycTier: tier } : null);
    }
    addToast(`KYC status updated: ${status.toUpperCase()} (${tier})`, 'success');
  };

  const updateUserProfile = (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = { ...currentUser, ...profileData };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    addToast('Profile details and avatar updated successfully!', 'success');
  };

  const submitKycVerification = (doc: KycDocument) => {
    if (!currentUser) return;
    const updatedUser: UserProfile = {
      ...currentUser,
      kycStatus: 'pending',
      kycDoc: doc
    };
    setCurrentUser(updatedUser);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    // Send admin notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New KYC Submission Received',
      titleKm: 'មានសំណើផ្ទៀងផ្ទាត់ KYC ថ្មី',
      message: `${currentUser.name} submitted ${doc.idType.replace('_', ' ').toUpperCase()} for verification.`,
      type: 'kyc',
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'admin_hub'
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast('KYC documents submitted successfully! Our compliance team will review them within 2 hours.', 'success');
  };

  const login = (email: string, password = ''): boolean => {
    const trimmed = email.trim().toLowerCase();
    let targetUser = allUsers.find(u => u.email.toLowerCase() === trimmed);

    if (!targetUser) {
      if (trimmed.includes('admin')) {
        targetUser = allUsers.find(u => u.role === 'admin') || INITIAL_USERS[0];
      } else if (trimmed.includes('vendor')) {
        targetUser = allUsers.find(u => u.role === 'vendor') || INITIAL_USERS[1];
      } else {
        targetUser = {
          ...INITIAL_USERS[2],
          id: `user-${Date.now()}`,
          email: email.trim(),
          name: email.split('@')[0] || 'Customer User',
          role: 'customer'
        };
        setAllUsers(prev => [targetUser!, ...prev]);
      }
    }

    if (targetUser.accountStatus === 'suspended') {
      addToast('This account has been suspended by the platform administrator.', 'error');
      return false;
    }

    setCurrentUser(targetUser);
    setIsAuthenticated(true);

    if (targetUser.role === 'admin') {
      setActiveTab('admin_hub');
    } else if (targetUser.role === 'vendor') {
      setActiveTab('vendor_hub');
    } else {
      setActiveTab('dashboard');
    }

    addToast(`Signed in as ${targetUser.name} (${targetUser.role.toUpperCase()})`, 'success');
    return true;
  };

  const loginAsDemo = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role) || INITIAL_USERS.find(u => u.role === role) || INITIAL_USERS[0];
    setCurrentUser(targetUser);
    setIsAuthenticated(true);

    if (role === 'admin') {
      setActiveTab('admin_hub');
    } else if (role === 'vendor') {
      setActiveTab('vendor_hub');
    } else {
      setActiveTab('dashboard');
    }

    addToast(`Welcome back, ${targetUser.name}!`, 'success');
  };

  const register = (userData: { name: string; email: string; phone: string; role: UserRole }) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      walletBalanceUsd: 1000.00,
      walletBalanceKhr: 4100000,
      bankAccount: {
        bankName: 'ABA',
        accountNumber: '001 234 567',
        accountHolder: userData.name.toUpperCase()
      },
      joinedDate: new Date().toISOString().split('T')[0],
      kycStatus: 'unverified',
      kycTier: 'Tier 1 ($1,000)',
      accountStatus: 'active',
      bullionHoldingGrams: 0,
      cashbackEarnedUsd: 0,
      referralEarningsUsd: 0
    };

    setAllUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setIsAuthenticated(true);

    if (newUser.role === 'admin') {
      setActiveTab('admin_hub');
    } else if (newUser.role === 'vendor') {
      setActiveTab('vendor_hub');
    } else {
      setActiveTab('dashboard');
    }

    addToast(`Account created successfully as ${userData.role.toUpperCase()}!`, 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('You have been signed out.', 'info');
  };

  // 5. Catalog Data
  const [listings, setListings] = useState<ListingItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'listings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialListings;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'listings', JSON.stringify(listings));
  }, [listings]);
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'vendors');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialVendors.map(v => ({
      ...v,
      commissionRatePercent: 3.5,
      customProfitMarginPercent: 20.0,
      mocLicenseNumber: `MOC-REG-${Math.floor(10000 + Math.random() * 90000)}`,
      patentTaxNumber: `TAX-PAT-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'active'
    }));
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'vendors', JSON.stringify(vendors));
  }, [vendors]);

  const currentVendor = currentUser?.role === 'vendor'
    ? vendors.find(v => v.id === (currentUser.vendorId || currentUser.id)) || vendors[0]
    : null;

  const [metalSpotPrices, setMetalSpotPrices] = useState<MetalSpotPrice[]>(initialMetalSpotPrices);

  const updateMetalSpotPrice = (metal: MetalSpotPrice['metal'], newPriceGram: number) => {
    setMetalSpotPrices(prev => prev.map(m => {
      if (m.metal === metal) {
        const oldPrice = m.pricePerGramUsd;
        const change = ((newPriceGram - oldPrice) / oldPrice) * 100;
        return {
          ...m,
          pricePerGramUsd: newPriceGram,
          pricePerChiUsd: +(newPriceGram * 3.75).toFixed(2),
          pricePerTroyOzUsd: +(newPriceGram * 31.1035).toFixed(2),
          change24h: +change.toFixed(2)
        };
      }
      return m;
    }));
    addToast(`${metal.toUpperCase()} spot price updated to $${newPriceGram.toFixed(2)}/g`, 'success');
  };

  const [offeringFilter, setOfferingFilter] = useState<OfferingType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);

  // 6. Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: ListingItem, quantity = 1, deliveryOption: 'standard_courier' | 'armored_vault_delivery' = 'standard_courier') => {
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci => ci.item.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci);
      }
      return [...prev, { item, quantity, deliveryOption: item.type === 'metal' ? 'armored_vault_delivery' : deliveryOption }];
    });
    addToast(`${item.title} added to cart!`, 'success');
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev => prev.map(ci => ci.item.id === itemId ? { ...ci, quantity } : ci));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const cartSubtotalUsd = cart.reduce((acc, ci) => acc + (ci.item.priceUsd * ci.quantity), 0);
  
  const hasMetal = cart.some(ci => ci.item.type === 'metal');
  const cartDeliveryFeeUsd = cartSubtotalUsd === 0 ? 0 : (hasMetal ? platformSettings.armoredTransportBaseFeeUsd : (cartSubtotalUsd >= 100 ? 0 : 2.50));
  const cartTotalUsd = cartSubtotalUsd + cartDeliveryFeeUsd;

  // 7. Orders & Delivery Tracking
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'orders');
      return saved ? JSON.parse(saved) : initialOrders;
    } catch {
      return initialOrders;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'orders', JSON.stringify(orders));
  }, [orders]);

  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(orders[0] || null);
  const [activePaymentModalOrder, setActivePaymentModalOrder] = useState<Order | null>(null);

  const trackOrderByNumber = (trackingNumber: string): Order | null => {
    const trimmed = trackingNumber.trim().toUpperCase();
    const found = orders.find(o => o.trackingNumber.toUpperCase() === trimmed || o.orderNumber.toUpperCase() === trimmed);
    if (found) {
      setActiveTrackingOrder(found);
      return found;
    }
    return null;
  };

  // 8. Local Bank Wallet
  const [walletBalanceUsd, setWalletBalanceUsd] = useState<number>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'wallet_usd');
    return saved ? parseFloat(saved) : (currentUser?.walletBalanceUsd || 1410.00);
  });

  const walletBalanceKhr = Math.round(walletBalanceUsd * platformSettings.usdToKhrRate);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'wallet_usd', walletBalanceUsd.toString());
  }, [walletBalanceUsd]);

  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'wallet_tx');
      return saved ? JSON.parse(saved) : initialWalletTransactions;
    } catch {
      return initialWalletTransactions;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'wallet_tx', JSON.stringify(walletTransactions));
  }, [walletTransactions]);

  const depositToWallet = (amountUsd: number, method = 'Bakong KHQR') => {
    setWalletBalanceUsd(prev => prev + amountUsd);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'deposit_khqr',
      amountUsd,
      amountKhr: Math.round(amountUsd * platformSettings.usdToKhrRate),
      description: `Top-up deposit via ${method}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: `KHQR-DEP-${Math.floor(100000 + Math.random() * 900000)}`,
      method
    };
    setWalletTransactions(prev => [newTx, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Wallet Deposit Credited',
      titleKm: 'ប្រាក់បានបញ្ចូលក្នុងកាបូប',
      message: `+$${amountUsd.toFixed(2)} USD deposited successfully via ${method}.`,
      type: 'wallet',
      timestamp: 'Just now',
      isRead: false,
      targetTab: 'wallet'
    };
    setNotifications(prev => [newNotif, ...prev]);
    addToast(`$${amountUsd.toFixed(2)} deposited into your SNL RICH Local Bank Wallet!`, 'success');
  };

  const withdrawFromWallet = (amountUsd: number, bankName: string, accountNumber: string): boolean => {
    if (amountUsd > walletBalanceUsd) {
      addToast('Insufficient wallet balance for withdrawal.', 'error');
      return false;
    }

    setWalletBalanceUsd(prev => prev - amountUsd);
    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'vendor_payout',
      amountUsd: -amountUsd,
      amountKhr: -Math.round(amountUsd * platformSettings.usdToKhrRate),
      description: `Local bank transfer to ${bankName} (${accountNumber})`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      reference: `WTH-${Math.floor(100000 + Math.random() * 900000)}`,
      method: bankName
    };
    setWalletTransactions(prev => [newTx, ...prev]);
    addToast(`$${amountUsd.toFixed(2)} withdrawn to ${bankName} account successfully!`, 'success');
    return true;
  };

  // 9. Create Order & Local Bank Checkout
  const createOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    shippingAddress: string;
    shippingCity: string;
    paymentMethod: LocalPaymentMethod;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) {
      addToast('Cart is empty', 'error');
      return null;
    }

    if (orderData.paymentMethod === 'wallet' && walletBalanceUsd < cartTotalUsd) {
      addToast(t.insufficientWallet, 'error');
      return null;
    }

    const orderNum = `SNL-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    const trackingNum = `SNL-TRK-${Math.floor(100000 + Math.random() * 900000)}`;
    const isPaidWithWallet = orderData.paymentMethod === 'wallet';

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: currentUser?.id || 'guest',
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: orderData.customerEmail,
      shippingAddress: orderData.shippingAddress,
      shippingCity: orderData.shippingCity,
      items: cart.map(ci => ({
        itemId: ci.item.id,
        title: ci.item.title,
        type: ci.item.type,
        vendorId: ci.item.vendorId,
        vendorName: ci.item.vendorName,
        quantity: ci.quantity,
        unitPriceUsd: ci.item.priceUsd,
        totalPriceUsd: ci.item.priceUsd * ci.quantity,
        image: ci.item.image
      })),
      subtotalUsd: cartSubtotalUsd,
      shippingFeeUsd: cartDeliveryFeeUsd,
      totalUsd: cartTotalUsd,
      totalKhr: Math.round(cartTotalUsd * platformSettings.usdToKhrRate),
      paymentMethod: orderData.paymentMethod,
      paymentStatus: isPaidWithWallet ? 'paid' : 'pending',
      deliveryStatus: 'order_confirmed',
      trackingNumber: trackingNum,
      courierName: hasMetal ? 'Armored Vault Secure Logistics' : 'SNL Express Courier Network',
      courierPhone: '+855 23 889 100',
      estimatedDeliveryDate: 'Within 24-48 Hours',
      createdAt: new Date().toLocaleString(),
      milestones: [
        {
          stage: 'order_confirmed',
          label: isPaidWithWallet ? 'Settled instantly via SNL Local Bank Wallet' : 'Order Placed - Awaiting Local Bank Settlement',
          labelKm: isPaidWithWallet ? 'ទូទាត់ជោគជ័យតាមកាបូបប្រាក់ SNL' : 'ការបញ្ជាទិញបានបង្កើត - រង់ចាំការទូទាត់ធនាគារ',
          location: 'Phnom Penh Operations Center',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          completed: true,
          current: true
        },
        {
          stage: 'preparing_dispatch',
          label: 'Vendor Packaging & Quality Inspection',
          labelKm: 'អាជីវករកំពុងវេចខ្ចប់ និងត្រួតពិនិត្យគុណភាព',
          location: 'Vendor Regional Facility',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          stage: 'picked_up_courier',
          label: 'Handover to Licensed Logistics Courier',
          labelKm: 'ប្រគល់ជូនភ្នាក់ងារដឹកជញ្ជូន',
          location: 'Dispatch Hub',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          stage: 'in_transit',
          label: 'In Transit across Provincial Corridor',
          labelKm: 'កំពុងធ្វើដំណើរលើដងផ្លូវ',
          location: 'Transit Route',
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          stage: 'out_for_delivery',
          label: 'Courier Dispatched for Final Mile Handover',
          labelKm: 'អ្នកដឹកជញ្ជូនចេញដំណើរទៅកាន់អតិថិជន',
          location: orderData.shippingCity,
          timestamp: 'Pending',
          completed: false,
          current: false
        },
        {
          stage: 'delivered',
          label: 'Successfully Delivered & Customer Signed',
          labelKm: 'បានប្រគល់ជូន និងចុះហត្ថលេខាទទួល',
          location: orderData.shippingAddress,
          timestamp: 'Pending',
          completed: false,
          current: false
        }
      ]
    };

    if (isPaidWithWallet) {
      setWalletBalanceUsd(prev => prev - cartTotalUsd);
      const paymentTx: WalletTransaction = {
        id: `tx-${Date.now()}`,
        type: 'order_payment',
        amountUsd: -cartTotalUsd,
        amountKhr: -Math.round(cartTotalUsd * platformSettings.usdToKhrRate),
        description: `Order Payment for ${orderNum}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        reference: orderNum,
        method: 'SNL Wallet'
      };
      setWalletTransactions(prev => [paymentTx, ...prev]);

      // Calculate cashback reward
      const cashbackEarned = +(cartTotalUsd * (profitSettings.cashbackRewardPercent / 100)).toFixed(2);
      if (cashbackEarned > 0 && currentUser) {
        setCurrentUser(prev => prev ? {
          ...prev,
          cashbackEarnedUsd: (prev.cashbackEarnedUsd || 0) + cashbackEarned
        } : null);
      }
    }

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);

    if (!isPaidWithWallet) {
      setActivePaymentModalOrder(newOrder);
    } else {
      addToast(`Order ${orderNum} placed successfully and paid via wallet!`, 'success');
      setActiveTab('tracking');
    }

    return newOrder;
  };

  const confirmPaymentForOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: 'paid',
          milestones: o.milestones.map((m, idx) => {
            if (idx === 0) return { ...m, label: 'Payment Settled via Local Bank Gateway', completed: true, current: false };
            if (idx === 1) return { ...m, current: true, timestamp: 'In progress' };
            return m;
          })
        };
      }
      return o;
    }));
    setActivePaymentModalOrder(null);
    addToast('Payment verified successfully! Order is being prepared for dispatch.', 'success');
    setActiveTab('tracking');
  };

  const advanceDeliveryStatus = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const stages: DeliveryStatus[] = [
        'order_confirmed',
        'preparing_dispatch',
        'picked_up_courier',
        'in_transit',
        'out_for_delivery',
        'delivered'
      ];
      const currentIndex = stages.indexOf(o.deliveryStatus);
      if (currentIndex >= stages.length - 1) return o;
      const nextStage = stages[currentIndex + 1];

      const updatedMilestones = o.milestones.map((m, idx) => {
        if (idx <= currentIndex + 1) {
          return {
            ...m,
            completed: true,
            current: idx === currentIndex + 1,
            timestamp: m.timestamp === 'Pending' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : m.timestamp
          };
        }
        return { ...m, current: false };
      });

      const updated = {
        ...o,
        deliveryStatus: nextStage,
        milestones: updatedMilestones
      };

      if (activeTrackingOrder?.id === orderId) {
        setActiveTrackingOrder(updated);
      }
      return updated;
    }));
    addToast('Delivery stage advanced to next milestone!', 'info');
  };

  const updateVendorOrderStatus = (orderId: string, status: DeliveryStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, deliveryStatus: status } : o));
    addToast(`Order status updated to ${status}`, 'success');
  };

  const updateVendorCommission = (vendorId: string, commissionPercent: number) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, commissionRatePercent: commissionPercent } : v));
    addToast(`Commission rate set to ${commissionPercent}% for vendor`, 'success');
  };

  const updateVendorProfitMargin = (vendorId: string, marginPercent: number) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, customProfitMarginPercent: marginPercent } : v));
    addToast(`Target profit margin updated to ${marginPercent}%`, 'success');
  };

  const updateVendorStatus = (vendorId: string, status: 'active' | 'suspended' | 'pending') => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status } : v));
    addToast(`Vendor account status changed to ${status.toUpperCase()}`, 'info');
  };

  const updateVendorProfile = (vendorId: string, updatedData: Partial<Vendor>) => {
    setVendors(prev => prev.map(v => {
      if (v.id === vendorId) {
        return { ...v, ...updatedData };
      }
      return v;
    }));

    // If current user is associated with this vendor, keep user state in sync
    if (currentUser && (currentUser.id === vendorId || currentUser.vendorId === vendorId)) {
      const updatedUser: UserProfile = {
        ...currentUser,
        name: updatedData.name || currentUser.name,
        companyName: updatedData.name || currentUser.companyName,
        avatarUrl: updatedData.logo || currentUser.avatarUrl
      };
      setCurrentUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));
    }

    // Sync listing representations if name or location changed
    if (updatedData.name || updatedData.nameKm || updatedData.location) {
      setListings(prev => prev.map(item => {
        if (item.vendorId === vendorId) {
          return {
            ...item,
            vendorName: updatedData.name || item.vendorName,
            vendorNameKm: updatedData.nameKm || item.vendorNameKm,
            vendorLocation: updatedData.location || item.vendorLocation
          };
        }
        return item;
      }));
    }

    addToast('Shop profile, images and store details updated successfully!', 'success');
  };

  const addNewListing = (listingData: Partial<ListingItem>) => {
    const activeV = (currentUser?.role === 'vendor' 
      ? vendors.find(v => v.id === (currentUser.vendorId || currentUser.id)) 
      : null) || vendors[0];

    const newItem: ListingItem = {
      id: `item-${Date.now()}`,
      type: listingData.type || 'product',
      title: listingData.title || 'New Marketplace Item',
      titleKm: listingData.titleKm || listingData.title || 'មុខទំនិញថ្មី',
      subtitle: listingData.subtitle || 'Verified SNL RICH listing',
      subtitleKm: listingData.subtitleKm || 'មុខទំនិញមានការបញ្ជាក់ត្រឹមត្រូវ',
      description: listingData.description || 'Detailed item specification and delivery policy.',
      descriptionKm: listingData.descriptionKm || 'ព័ត៌មានលម្អិតអំពីមុខទំនិញ និងគោលការណ៍ដឹកជញ្ជូន។',
      priceUsd: listingData.priceUsd || 100,
      image: listingData.image || 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
      vendorId: listingData.vendorId || activeV?.id || 'v-angkor-bullion',
      vendorName: listingData.vendorName || activeV?.name || 'Angkor Royal Bullion & Vault Custody',
      vendorNameKm: listingData.vendorNameKm || activeV?.nameKm || 'អង្គរ រ៉ូយ៉ាល់ ដុំមាស និងឃ្លាំងសុវត្ថិភាព',
      vendorLocation: listingData.vendorLocation || activeV?.location || 'Phnom Penh',
      vendorVerified: activeV?.verified ?? true,
      category: listingData.category || 'General',
      categoryKm: listingData.categoryKm || 'ទូទៅ',
      rating: 5.0,
      reviewCount: 1,
      inventoryCount: listingData.inventoryCount !== undefined ? listingData.inventoryCount : 25,
      sku: listingData.sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      ...listingData
    };

    setListings(prev => [newItem, ...prev]);
    addToast(`"${newItem.title}" published to your store catalog!`, 'success');
  };

  const updateListing = (itemId: string, updatedData: Partial<ListingItem>) => {
    setListings(prev => prev.map(item => item.id === itemId ? { ...item, ...updatedData } : item));
    addToast('Product details updated successfully!', 'success');
  };

  const deleteListing = (itemId: string) => {
    setListings(prev => prev.filter(item => item.id !== itemId));
    addToast('Product removed from store catalog.', 'info');
  };

  const updateListingStock = (itemId: string, newInventoryCount: number) => {
    setListings(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, inventoryCount: Math.max(0, newInventoryCount) };
      }
      return item;
    }));
    addToast(`Inventory stock updated to ${Math.max(0, newInventoryCount)}`, 'success');
  };

  const updateOrderDelivery = (orderId: string, updates: {
    deliveryStatus: DeliveryStatus;
    courierName?: string;
    courierPhone?: string;
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    locationNote?: string;
  }) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const stages: DeliveryStatus[] = [
        'order_confirmed',
        'preparing_dispatch',
        'picked_up_courier',
        'in_transit',
        'out_for_delivery',
        'delivered'
      ];
      const newIdx = stages.indexOf(updates.deliveryStatus);

      const updatedMilestones = order.milestones.map((m, idx) => {
        const isDone = idx < newIdx;
        const isCurrent = idx === newIdx;
        return {
          ...m,
          completed: isDone || isCurrent,
          current: isCurrent,
          timestamp: isCurrent ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : m.timestamp,
          location: (isCurrent && updates.locationNote) ? updates.locationNote : m.location
        };
      });

      return {
        ...order,
        deliveryStatus: updates.deliveryStatus,
        courierName: updates.courierName || order.courierName,
        courierPhone: updates.courierPhone || order.courierPhone,
        trackingNumber: updates.trackingNumber || order.trackingNumber,
        estimatedDeliveryDate: updates.estimatedDeliveryDate || order.estimatedDeliveryDate,
        milestones: updatedMilestones
      };
    }));

    addToast(`Order dispatch status transitioned to ${updates.deliveryStatus.replace(/_/g, ' ').toUpperCase()}`, 'success');
  };

  // Vendor Payouts Ledger
  const [vendorPayouts, setVendorPayouts] = useState<VendorPayout[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'vendor_payouts');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'payout-101',
        vendorId: 'v-angkor-bullion',
        amountUsd: 12500.00,
        amountKhr: 51250000,
        bankName: 'ABA Bank',
        accountNumber: '001 234 567',
        accountHolder: 'ANGKOR ROYAL BULLION VAULT',
        bakongAccountId: 'angkor_bullion@aba',
        status: 'completed',
        referenceNumber: 'SNL-PAY-992144',
        createdAt: '2026-09-21 11:30 AM'
      },
      {
        id: 'payout-102',
        vendorId: 'v-khmer-silk',
        amountUsd: 850.00,
        amountKhr: 3485000,
        bankName: 'Wing Bank',
        accountNumber: '088 123 999',
        accountHolder: 'TAKEO GOLDEN SILK COOP',
        bakongAccountId: 'takeo_silk@wing',
        status: 'completed',
        referenceNumber: 'SNL-PAY-881920',
        createdAt: '2026-09-22 04:15 PM'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'vendor_payouts', JSON.stringify(vendorPayouts));
  }, [vendorPayouts]);

  const requestVendorPayout = (vendorId: string, amountUsd: number, payoutDetails: { bankName: string; accountNumber: string; accountHolder?: string; bakongId?: string }): boolean => {
    const newPayout: VendorPayout = {
      id: `payout-${Date.now()}`,
      vendorId,
      amountUsd,
      amountKhr: Math.round(amountUsd * platformSettings.usdToKhrRate),
      bankName: payoutDetails.bankName,
      accountNumber: payoutDetails.accountNumber,
      accountHolder: payoutDetails.accountHolder,
      bakongAccountId: payoutDetails.bakongId,
      status: 'completed',
      referenceNumber: `SNL-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString()
    };

    setVendorPayouts(prev => [newPayout, ...prev]);
    addToast(`Payout of $${amountUsd.toFixed(2)} requested and settled to ${payoutDetails.bankName}!`, 'success');
    return true;
  };

  const toggleVendorVerification = (vendorId: string) => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, verified: !v.verified } : v));
    addToast('Vendor license verification status updated', 'info');
  };

  // Guest / Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 10. Banner Advertisements & Slideshow
  const [banners, setBanners] = useState<BannerAdv[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + 'banners');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialBanners;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'banners', JSON.stringify(banners));
  }, [banners]);

  const addBanner = (bannerData: Omit<BannerAdv, 'id' | 'createdAt'>) => {
    const newBanner: BannerAdv = {
      ...bannerData,
      id: `banner-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBanners(prev => {
      const updated = [...prev, newBanner].sort((a, b) => a.order - b.order);
      return updated;
    });
    addToast('New promotional banner created successfully!', 'success');
  };

  const updateBanner = (id: string, updates: Partial<BannerAdv>) => {
    setBanners(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...updates } : b).sort((a, b) => a.order - b.order);
      return updated;
    });
    addToast('Banner advertisement updated!', 'success');
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    addToast('Banner removed successfully', 'info');
  };

  const toggleBannerActive = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const reorderBanners = (orderedIds: string[]) => {
    setBanners(prev => {
      const updated = [...prev].map(b => {
        const idx = orderedIds.indexOf(b.id);
        return idx !== -1 ? { ...b, order: idx + 1 } : b;
      }).sort((a, b) => a.order - b.order);
      return updated;
    });
    addToast('Banner display order updated!', 'info');
  };

  // 11. Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const formatPrice = (amountInUsd: number): string => {
    if (currency === 'KHR') {
      const khr = Math.round(amountInUsd * platformSettings.usdToKhrRate);
      return `${khr.toLocaleString()} ៛`;
    }
    return `$${amountInUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,

        // Authentication & Users
        isAuthenticated,
        currentUser,
        allUsers,
        login,
        loginAsDemo,
        register,
        logout,
        updateUserStatus,
        updateUserKyc,
        submitKycVerification,
        updateUserProfile,

        // Sidebar
        isSidebarCollapsed,
        toggleSidebar,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,

        activeTab,
        setActiveTab,

        listings,
        vendors,
        currentVendor,
        updateVendorProfile,
        metalSpotPrices,
        updateMetalSpotPrice,
        offeringFilter,
        setOfferingFilter,
        searchQuery,
        setSearchQuery,
        selectedItem,
        setSelectedItem,

        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotalUsd,
        cartDeliveryFeeUsd,
        cartTotalUsd,
        isCartOpen,
        setIsCartOpen,

        orders,
        activeTrackingOrder,
        setActiveTrackingOrder,
        trackOrderByNumber,
        createOrder,
        advanceDeliveryStatus,

        walletBalanceUsd,
        walletBalanceKhr,
        walletTransactions,
        depositToWallet,
        withdrawFromWallet,
        activePaymentModalOrder,
        setActivePaymentModalOrder,
        confirmPaymentForOrder,

        addNewListing,
        updateListing,
        deleteListing,
        updateListingStock,
        updateOrderDelivery,
        vendorPayouts,
        requestVendorPayout,
        updateVendorOrderStatus,
        updateVendorCommission,
        updateVendorProfitMargin,
        updateVendorStatus,
        toggleVendorVerification,

        // Notifications
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,

        // Platform & Branding Settings
        platformSettings,
        updatePlatformSettings,

        // Profit Custom Settings
        profitSettings,
        updateProfitSettings,

        // Banner Advertisements & Slideshow
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        toggleBannerActive,
        reorderBanners,

        // Guest / Auth Modal
        isAuthModalOpen,
        setIsAuthModalOpen,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
