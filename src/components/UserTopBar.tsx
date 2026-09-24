import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ChevronDown, 
  Layers, 
  Store, 
  ShieldCheck, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Wallet, 
  Truck, 
  Package, 
  TrendingUp, 
  Coins, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  PlusCircle, 
  ShoppingBag, 
  CreditCard, 
  MapPin, 
  FileCheck,
  Building2,
  Lock,
  ArrowUpRight,
  Edit3
} from 'lucide-react';

export const UserTopBar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    clearNotifications,
    formatPrice,
    walletBalanceUsd,
    logout,
    language,
    t 
  } = useApp();

  // Dropdown states
  const [isFunctionsOpen, setIsFunctionsOpen] = useState(false);
  const [isVendorMenuOpen, setIsVendorMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const functionsRef = useRef<HTMLDivElement>(null);
  const vendorRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close all dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (functionsRef.current && !functionsRef.current.contains(target)) setIsFunctionsOpen(false);
      if (vendorRef.current && !vendorRef.current.contains(target)) setIsVendorMenuOpen(false);
      if (adminRef.current && !adminRef.current.contains(target)) setIsAdminMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(target)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(target)) setIsProfileMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = currentUser?.role || 'customer';

  // KYC badge config
  const kycConfig = {
    verified: {
      text: currentUser?.kycTier ? currentUser.kycTier.split(' ')[0] + ' Verified' : 'Verified',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2
    },
    pending: {
      text: 'KYC Reviewing',
      badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
      icon: Clock
    },
    rejected: {
      text: 'KYC Incomplete',
      badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
      icon: AlertCircle
    },
    unverified: {
      text: 'Verify Identity',
      badge: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      icon: ShieldCheck
    }
  }[currentUser?.kycStatus || 'unverified'];

  const KycIcon = kycConfig.icon;

  // Active section title for breadcrumb
  const currentSectionName = {
    dashboard: 'Dashboard & Overview',
    marketplace: 'Marketplace & Products',
    vendors: 'Verified Vendors & Merchants',
    tracking: 'Delivery Tracking (GPS)',
    wallet: 'NBC Bakong Wallet',
    orders: 'My Orders & Invoices',
    profit_custom: 'Profit Custom & Yield',
    kyc: 'KYC Identity Center',
    profile: 'Profile & Account Settings',
    vendor_hub: 'Merchant Operations Portal',
    admin_hub: 'Platform Governance Hub'
  }[activeTab] || 'Dashboard';

  return (
    <div className="bg-white/95 dark:bg-[#121622]/95 border-b border-slate-200 dark:border-slate-800/80 px-4 sm:px-6 py-2 transition-colors sticky top-[41px] z-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LEFT: Context Breadcrumb + Functional Dropdown Menus */}
        <div className="flex items-center gap-2.5">
          
          {/* Breadcrumb current section label */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
              <span>{currentSectionName}</span>
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
          </div>

          {/* 1. PLATFORM FUNCTIONS DROPDOWN MENU */}
          <div className="relative" ref={functionsRef}>
            <button
              onClick={() => {
                setIsFunctionsOpen(prev => !prev);
                setIsVendorMenuOpen(false);
                setIsAdminMenuOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors border border-slate-200/80 dark:border-slate-700/60"
            >
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              <span>Platform Functions</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isFunctionsOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Platform Functions Menu Popover */}
            {isFunctionsOpen && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-3">
                
                {/* Section A: Marketplace & Bullion */}
                <div>
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Marketplace & Precious Metals
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => { setActiveTab('marketplace'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <ShoppingBag className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">All Products</div>
                        <div className="text-[9px] text-slate-400">Tech & Goods</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('marketplace'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <Coins className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">24K Gold Bullion</div>
                        <div className="text-[9px] text-slate-400">Chi & Damloeng</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section B: Orders & Logistics */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Logistics & Dispatches
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => { setActiveTab('tracking'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Live GPS Tracking</div>
                        <div className="text-[9px] text-slate-400">Armored delivery</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('orders'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <Package className="w-4 h-4 text-purple-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">My Orders</div>
                        <div className="text-[9px] text-slate-400">Invoices & Receipts</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section C: Banking, Staking & Compliance */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-2">
                  <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Finance, Yield & Verification
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <button
                      onClick={() => { setActiveTab('wallet'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">NBC Bakong KHQR</div>
                        <div className="text-[9px] text-slate-400">Instant deposits</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('profit_custom'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Profit & Yield</div>
                        <div className="text-[9px] text-slate-400">3.8% Staking APY</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('kyc'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">KYC Verification</div>
                        <div className="text-[9px] text-slate-400">$50k Bullion limit</div>
                      </div>
                    </button>

                    <button
                      onClick={() => { setActiveTab('profile'); setIsFunctionsOpen(false); }}
                      className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center gap-2 text-slate-800 dark:text-slate-200"
                    >
                      <User className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Profile & Avatar</div>
                        <div className="text-[9px] text-slate-400">Address & details</div>
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* 2. VENDOR SPECIFIC FUNCTIONS DROPDOWN (If vendor) */}
          {role === 'vendor' && (
            <div className="relative" ref={vendorRef}>
              <button
                onClick={() => {
                  setIsVendorMenuOpen(prev => !prev);
                  setIsFunctionsOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold transition-colors border border-amber-500/30"
              >
                <Store className="w-3.5 h-3.5 text-amber-500" />
                <span>Vendor Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isVendorMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isVendorMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 text-xs">
                  <button
                    onClick={() => { setActiveTab('vendor_hub'); setIsVendorMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <Edit3 className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div>Edit Shop & Images</div>
                      <div className="text-[10px] text-slate-400 font-normal">Logo, cover banner, description & contacts</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('vendor_hub'); setIsVendorMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-500 shrink-0" />
                    <div>
                      <div>Publish New Listing</div>
                      <div className="text-[10px] text-slate-400 font-normal">Add product, bullion, or service</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('vendor_hub'); setIsVendorMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <Truck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <div>Dispatch Queue</div>
                      <div className="text-[10px] text-slate-400 font-normal">Manage orders and delivery status</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('profit_custom'); setIsVendorMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <TrendingUp className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <div>Margin & Spot Markup</div>
                      <div className="text-[10px] text-slate-400 font-normal">Set custom profit margins</div>
                    </div>
                  </button>

                  <button
                    onClick={() => { setActiveTab('wallet'); setIsVendorMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                    <div>
                      <div>Bank Payout Request</div>
                      <div className="text-[10px] text-slate-400 font-normal">Settle to ABA or Bakong KHQR</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 3. ADMIN GOVERNANCE DROPDOWN (If admin) */}
          {role === 'admin' && (
            <div className="relative" ref={adminRef}>
              <button
                onClick={() => {
                  setIsAdminMenuOpen(prev => !prev);
                  setIsFunctionsOpen(false);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors border border-purple-500/30"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                <span>Governance Controls</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isAdminMenuOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 space-y-1 animate-in fade-in slide-in-from-top-2 text-xs">
                  <button
                    onClick={() => { setActiveTab('admin_hub'); setIsAdminMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <Settings className="w-4 h-4 text-purple-500" />
                    <span>Branding & Currency Peg Rate</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('admin_hub'); setIsAdminMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    <span>User Management & KYC Audit</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('admin_hub'); setIsAdminMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <Store className="w-4 h-4 text-amber-500" />
                    <span>Merchant KYB Licenses & Commissions</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('admin_hub'); setIsAdminMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-left flex items-center gap-2.5 font-bold text-slate-900 dark:text-white"
                  >
                    <Coins className="w-4 h-4 text-emerald-500" />
                    <span>Metal Spot Price Engine</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT: Quick Wallet Balance, Notifications & Rich User Profile Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Quick Wallet Balance Pill */}
          <button
            onClick={() => setActiveTab('wallet')}
            title="Local bank wallet balance"
            className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white hover:border-blue-500 transition-colors"
          >
            <Wallet className="w-3.5 h-3.5 text-blue-500" />
            <span>{formatPrice(walletBalanceUsd)}</span>
          </button>

          {/* KYC Status Pill */}
          <button
            onClick={() => setActiveTab('kyc')}
            title="Click to manage KYC verification"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all ${kycConfig.badge}`}
          >
            <KycIcon className="w-3.5 h-3.5" />
            <span className="text-[11px]">{kycConfig.text}</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(prev => !prev)}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#121622] animate-pulse" />
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 z-50 space-y-3 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                      Notifications
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span className="px-1.5 py-0.2 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[10px]">
                    <button
                      onClick={markAllNotificationsAsRead}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
                    >
                      Mark all read
                    </button>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <button
                      onClick={clearNotifications}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 pr-1 text-xs">
                  {notifications.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 text-xs">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.targetTab) {
                            setActiveTab(notif.targetTab);
                            setIsNotifOpen(false);
                          }
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          notif.isRead
                            ? 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 text-slate-500'
                            : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40 text-slate-900 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="font-bold text-xs flex items-center gap-1.5">
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                            )}
                            <span>{language === 'km' && notif.titleKm ? notif.titleKm : notif.title}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                          {language === 'km' && notif.messageKm ? notif.messageKm : notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 4. USER PROFILE & AVATAR DROPDOWN MENU */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            >
              <img
                src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.name}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-blue-500/30 shadow-xs"
              />
              <div className="hidden sm:flex flex-col text-left min-w-0 pr-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[110px]">
                  {currentUser?.name}
                </span>
                <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">
                  {currentUser?.role}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Menu Popover */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#161B26] border border-slate-200 dark:border-slate-800 shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 space-y-2">
                
                {/* User Card Header */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <img
                    src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={currentUser?.name}
                    className="w-11 h-11 rounded-xl object-cover ring-2 ring-blue-500/30"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                      {currentUser?.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate font-mono">
                      {currentUser?.email}
                    </div>
                    <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase">
                      {currentUser?.role} · {currentUser?.kycTier?.split(' ')[0]}
                    </span>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="space-y-0.5 text-xs">
                  <button
                    onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                  >
                    <User className="w-4 h-4 text-blue-500" />
                    <span>My Profile & Detailed Info</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('profile'); setIsProfileMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <span>Delivery Address (Cambodia)</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('wallet'); setIsProfileMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                  >
                    <Building2 className="w-4 h-4 text-amber-500" />
                    <span>NBC Bakong & Bank Accounts</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('kyc'); setIsProfileMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-500" />
                    <span>KYC & Bullion Trading Limits</span>
                  </button>

                  <button
                    onClick={() => { setActiveTab('profit_custom'); setIsProfileMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/70 text-left flex items-center gap-2.5 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                  >
                    <TrendingUp className="w-4 h-4 text-indigo-500" />
                    <span>Profit Custom & Yield Settings</span>
                  </button>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                  <button
                    onClick={() => { logout(); setIsProfileMenuOpen(false); }}
                    className="w-full p-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left flex items-center gap-2.5 text-rose-600 font-bold transition-colors text-xs"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
