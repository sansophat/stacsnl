import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Menu, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Store, 
  User, 
  Bell,
  Search,
  LogOut,
  LogIn
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    isAuthenticated,
    setIsAuthModalOpen,
    loginAsDemo,
    currentUser, 
    metalSpotPrices, 
    cartCount, 
    setIsCartOpen, 
    setIsMobileSidebarOpen, 
    searchQuery, 
    setSearchQuery, 
    logout,
    activeTab,
    setActiveTab,
    t 
  } = useApp();

  const role = currentUser?.role || 'customer';

  const roleBadgeInfo = {
    admin: {
      text: t.roleBadgeAdmin,
      icon: ShieldCheck,
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800'
    },
    vendor: {
      text: t.roleBadgeVendor,
      icon: Store,
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
    },
    customer: {
      text: t.roleBadgeCustomer,
      icon: User,
      color: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800'
    }
  }[role];

  const RoleIcon = roleBadgeInfo.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0E1118]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      
      {/* 1. TOP LIVE SPOT TICKER BAR */}
      <div className="bg-slate-950 text-white text-[11px] py-1.5 px-4 overflow-x-auto whitespace-nowrap border-b border-slate-800 scrollbar-none flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-amber-400 text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Spot Metals</span>
          </span>
        </div>

        <div className="flex items-center gap-6 text-[11px] font-mono shrink-0">
          {metalSpotPrices.map(metal => (
            <div key={metal.metal} className="flex items-center gap-2">
              <span className="text-slate-400 capitalize">{metal.metal}:</span>
              <span className="text-white font-bold">${metal.pricePerGramUsd.toFixed(2)}/g</span>
              {metal.pricePerChiUsd && (
                <span className="text-amber-300/80 text-[10px]">(${metal.pricePerChiUsd.toFixed(0)}/chi)</span>
              )}
              <span className={`text-[10px] font-bold ${metal.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {metal.change24h >= 0 ? '+' : ''}{metal.change24h.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-400 text-[10px] shrink-0 font-medium">
          <span>NBC Bakong Liquidity: 1 USD = 4,100 KHR</span>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Mobile hamburger menu trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Quick Search bar (Visible on desktop) */}
          {role === 'customer' && (
            <div className="hidden md:flex items-center relative w-72 lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          )}

          {/* Admin / Vendor contextual breadcrumb */}
          {role === 'admin' && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white">Admin Control Center</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">Platform Governance & Compliance</span>
            </div>
          )}

          {role === 'vendor' && (
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white">{currentUser?.name}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">Merchant Operations Portal</span>
            </div>
          )}
        </div>

        {/* Right Actions: Strict Role Badge / Guest Login, Cart, User Profile & Logout */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {!isAuthenticated ? (
            /* ======================================================== */
            /* GUEST MODE: PROMINENT LOG IN BUTTON & DEMO ACCESS       */
            /* ======================================================== */
            <div className="flex items-center gap-2">
              {/* Quick Demo Access */}
              <button
                onClick={() => loginAsDemo('customer')}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all cursor-pointer"
                title="1-Click Demo Buyer Access"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Demo Buyer</span>
              </button>

              {/* Prominent Log In Button on Top */}
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Sign Up</span>
              </button>

              {/* Guest Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-md animate-scale">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          ) : (
            /* ======================================================== */
            /* AUTHENTICATED MODE: ROLE BADGE, CART, AVATAR, LOGOUT    */
            /* ======================================================== */
            <>
              {/* Strictly Informational Role Badge */}
              <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${roleBadgeInfo.color}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleBadgeInfo.text}</span>
              </div>

              {/* Customer Cart Trigger */}
              {role === 'customer' && (
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                  aria-label="Open Cart"
                >
                  <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-md animate-scale">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* User Avatar with Profile shortcut */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  title={`${currentUser?.name} - Click to edit profile`}
                  className="flex items-center gap-2 p-0.5 rounded-xl hover:ring-2 hover:ring-blue-500/50 transition-all"
                >
                  {currentUser?.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-xl object-cover shadow-xs border border-slate-200 dark:border-slate-700"
                    />
                  ) : (
                    <div 
                      className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-xs"
                    >
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>

                <button
                  onClick={logout}
                  title={t.signOut}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

        </div>

      </div>

    </header>
  );
};
