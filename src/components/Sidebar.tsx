import React from 'react';
import { useApp } from '../context/AppContext';
import { SnlLogo } from './SnlLogo';
import { 
  Store, 
  ShoppingBag, 
  Truck, 
  Wallet, 
  Package, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Globe, 
  DollarSign, 
  PlusCircle, 
  Sparkles,
  Layers,
  X,
  UserCheck,
  LayoutDashboard,
  TrendingUp,
  FileCheck,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    cartCount, 
    setIsCartOpen,
    orders,
    vendors,
    language, 
    setLanguage, 
    theme, 
    toggleTheme, 
    currency, 
    setCurrency, 
    logout,
    isSidebarCollapsed,
    toggleSidebar,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    platformSettings,
    t 
  } = useApp();

  const role = currentUser?.role || 'customer';

  // Role-specific Navigation items
  const getNavItems = () => {
    if (role === 'admin') {
      const pendingKYB = vendors.filter(v => !v.verified).length;
      return [
        {
          id: 'admin_hub',
          label: 'Governance & Control',
          icon: ShieldCheck,
          badge: null
        },
        {
          id: 'dashboard',
          label: 'Platform Dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'wallet',
          label: 'Platform Liquidity',
          icon: Wallet,
          badge: 'Bakong'
        },
        {
          id: 'profit_custom',
          label: 'Yield & Margins',
          icon: TrendingUp,
          badge: null
        },
        {
          id: 'kyc',
          label: 'KYC / KYB Center',
          icon: FileCheck,
          badge: pendingKYB > 0 ? `${pendingKYB}` : null,
          badgeColor: 'bg-amber-500/20 text-amber-400'
        }
      ];
    }

    if (role === 'vendor') {
      const pendingFulfillment = orders.filter(o => o.deliveryStatus !== 'delivered').length;
      return [
        {
          id: 'vendor_hub',
          label: t.vendorHubTitle,
          icon: Store,
          badge: null
        },
        {
          id: 'dashboard',
          label: 'Operations Dashboard',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'tracking',
          label: 'Dispatch Queue',
          icon: Truck,
          badge: pendingFulfillment > 0 ? `${pendingFulfillment}` : null,
          badgeColor: 'bg-amber-500/20 text-amber-400'
        },
        {
          id: 'wallet',
          label: 'Bank Payouts',
          icon: Wallet,
          badge: 'ABA/Wing'
        },
        {
          id: 'profit_custom',
          label: 'Margin Settings',
          icon: TrendingUp,
          badge: null
        },
        {
          id: 'kyc',
          label: 'KYB & License',
          icon: FileCheck,
          badge: null
        }
      ];
    }

    // Customer Items (Default)
    return [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        badge: null
      },
      {
        id: 'marketplace',
        label: t.navMarketplace,
        icon: ShoppingBag,
        badge: null
      },
      {
        id: 'vendors',
        label: t.navVendors,
        icon: Store,
        badge: null
      },
      {
        id: 'tracking',
        label: t.navTracking,
        icon: Truck,
        badge: 'Live GPS',
        badgeColor: 'bg-emerald-500/20 text-emerald-400'
      },
      {
        id: 'wallet',
        label: t.navWallet,
        icon: Wallet,
        badge: 'KHQR'
      },
      {
        id: 'orders',
        label: t.navOrders,
        icon: Package,
        badge: orders.length > 0 ? `${orders.length}` : null
      },
      {
        id: 'profit_custom',
        label: 'Profit & Yield',
        icon: TrendingUp,
        badge: '3.8% APY',
        badgeColor: 'bg-purple-500/20 text-purple-400'
      },
      {
        id: 'kyc',
        label: 'KYC Center',
        icon: FileCheck,
        badge: currentUser?.kycStatus === 'verified' ? 'Verified' : 'Verify',
        badgeColor: currentUser?.kycStatus === 'verified' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
      }
    ];
  };

  const navItems = getNavItems();

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Element */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-white dark:bg-[#0D1017] border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Brand & Logo Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 shrink-0">
          <div 
            onClick={() => {
              if (role === 'admin') setActiveTab('admin_hub');
              else if (role === 'vendor') setActiveTab('vendor_hub');
              else setActiveTab('dashboard');
            }}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            <SnlLogo size={isSidebarCollapsed ? 32 : 36} />
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white truncate">
                  {platformSettings.platformName || 'SNL RICH Eco'}
                </span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase truncate">
                  Ecosystem Hub
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu List */}
        <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1.5 scrollbar-none">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Currency & Language Quick Bar (Compact) */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              {/* Currency Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                    currency === 'USD'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-400'
                  }`}
                >
                  $ USD
                </button>
                <button
                  onClick={() => setCurrency('KHR')}
                  className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                    currency === 'KHR'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-400'
                  }`}
                >
                  ៛ KHR
                </button>
              </div>

              {/* Language Switch */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                    language === 'en'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-400'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('km')}
                  className={`px-2 py-1 rounded-lg font-bold text-[10px] transition-all ${
                    language === 'km'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-400'
                  }`}
                >
                  ខ្មែរ
                </button>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* User Card & Logout Bottom Section */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between gap-2">
            
            <div 
              onClick={() => handleNavClick('profile')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer group flex-1"
              title="View & Edit Profile"
            >
              {currentUser?.avatarUrl ? (
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 ring-2 ring-blue-500/30 group-hover:ring-blue-500 transition-all"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 group-hover:bg-blue-500 transition-colors">
                  {currentUser?.name.charAt(0) || 'U'}
                </div>
              )}

              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <div className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                    {currentUser?.name}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                    {role} · Settings
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Desktop Collapse Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 rounded-full bg-white dark:bg-[#1E2330] border border-slate-200 dark:border-slate-700 items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white shadow-xs z-30 transition-transform"
          aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

      </aside>
    </>
  );
};
