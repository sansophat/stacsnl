import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Wallet, 
  Package, 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Coins, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock, 
  Building2, 
  CheckCircle2, 
  ChevronRight,
  ExternalLink,
  Layers,
  ShoppingBag
} from 'lucide-react';

export const CustomerDashboardView: React.FC = () => {
  const { 
    currentUser, 
    walletBalanceUsd, 
    walletBalanceKhr, 
    orders, 
    metalSpotPrices, 
    formatPrice, 
    setActiveTab, 
    setActiveTrackingOrder,
    profitSettings,
    language,
    t 
  } = useApp();

  const goldSpot = metalSpotPrices.find(m => m.metal === 'gold') || metalSpotPrices[0];
  const goldPricePerGram = goldSpot?.pricePerGramUsd || 84.20;

  // Bullion holdings valuation
  const bullionGrams = currentUser?.bullionHoldingGrams || 37.5; // 1 Damloeng = 37.5g default
  const bullionValueUsd = bullionGrams * goldPricePerGram;
  const bullionChi = +(bullionGrams / 3.75).toFixed(1);
  const bullionDamloeng = +(bullionGrams / 37.5).toFixed(2);

  // Active / pending orders
  const activeOrders = orders.filter(o => o.deliveryStatus !== 'delivered');
  const recentOrders = orders.slice(0, 3);

  // Total Portfolio Valuation
  const totalPortfolioValueUsd = walletBalanceUsd + bullionValueUsd;

  // Yield accrued on bullion holding
  const annualYieldUsd = +(bullionValueUsd * (profitSettings.bullionVaultYieldApy / 100)).toFixed(2);
  const monthlyYieldUsd = +(annualYieldUsd / 12).toFixed(2);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. WELCOME & PORTFOLIO HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#10192A] to-slate-950 border border-slate-800 p-6 sm:p-8 text-white shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-gradient-to-br from-amber-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>SNL RICH Multi-Vendor Ecosystem · Cambodia</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {language === 'km' ? `សួស្តី, ${currentUser?.name}!` : `Welcome back, ${currentUser?.name}!`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              Monitor your NBC Bakong liquid balances, 24K certified bullion custody, live courier dispatches, and custom yield earnings in real time.
            </p>
          </div>

          {/* Quick Total Wealth Stat */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md shrink-0 flex flex-col sm:items-end justify-center">
            <span className="text-xs text-slate-400 font-medium">Total Portfolio Asset Value</span>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono mt-0.5">
              {formatPrice(totalPortfolioValueUsd)}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.8% APY Bullion Staking Yield Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CORE FINANCIAL & OPERATIONAL STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: NBC Bakong Wallet Balance */}
        <div className="bg-white dark:bg-[#121622] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-blue-500/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Local Bank Wallet
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {formatPrice(walletBalanceUsd)}
            </div>
            <div className="text-xs text-slate-400 font-mono mt-0.5">
              ≈ {walletBalanceKhr.toLocaleString()} KHR
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('wallet')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Deposit / Pay</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 2: 24K Bullion Vault Custody */}
        <div className="bg-white dark:bg-[#121622] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-amber-500/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
              Bullion Vault Custody
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              {bullionGrams}g <span className="text-xs font-normal text-slate-400">({bullionDamloeng} Damloeng)</span>
            </div>
            <div className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5 font-bold">
              Valued at {formatPrice(bullionValueUsd)}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <span className="text-slate-400">{bullionChi} Chi 24K Gold</span>
            <button
              onClick={() => setActiveTab('marketplace')}
              className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
            >
              Buy Bullion
            </button>
          </div>
        </div>

        {/* Card 3: Active Orders & Live Logistics */}
        <div className="bg-white dark:bg-[#121622] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Active Dispatches
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {activeOrders.length} <span className="text-xs font-normal text-slate-400">in-transit</span>
            </div>
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
              {activeOrders.length > 0 ? 'Live GPS tracking active' : 'All orders delivered'}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('tracking')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>Track Parcels</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Card 4: Profit & Yield Accrued */}
        <div className="bg-white dark:bg-[#121622] rounded-2xl p-5 border border-slate-200 dark:border-slate-800/80 shadow-xs hover:border-purple-500/50 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Earned Profit & Yield
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>

          <div className="my-3">
            <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
              ${((currentUser?.cashbackEarnedUsd || 0) + (currentUser?.referralEarningsUsd || 0)).toFixed(2)}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Yield: +${monthlyYieldUsd}/mo estimated
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('profit_custom')}
              className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
            >
              <span>Custom Settings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* 3. QUICK ACTION TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        
        <button
          onClick={() => setActiveTab('marketplace')}
          className="p-4 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800/80 hover:border-blue-500 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white">Shop Marketplace</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Products, Services, Metals</div>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className="p-4 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white">NBC Bakong KHQR</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Top-up & P2P Local Transfer</div>
        </button>

        <button
          onClick={() => setActiveTab('kyc')}
          className="p-4 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800/80 hover:border-amber-500 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white">Identity Verification</div>
          <div className="text-[11px] text-slate-400 mt-0.5">KYC Level 2 & Bullion Limits</div>
        </button>

        <button
          onClick={() => setActiveTab('tracking')}
          className="p-4 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800/80 hover:border-purple-500 text-left transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Truck className="w-5 h-5" />
          </div>
          <div className="font-bold text-xs text-slate-900 dark:text-white">Track Parcel GPS</div>
          <div className="text-[11px] text-slate-400 mt-0.5">25-Province Armored Route</div>
        </button>

      </div>

      {/* 4. RECENT ORDERS & LIVE TRACKING SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Recent Orders (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#121622] rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Recent Purchases & Dispatches</h2>
            </div>
            <button
              onClick={() => setActiveTab('orders')}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all ({orders.length})
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentOrders.map(order => (
              <div 
                key={order.id}
                onClick={() => {
                  setActiveTrackingOrder(order);
                  setActiveTab('tracking');
                }}
                className="py-3.5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 font-bold text-xs">
                    {order.items[0]?.title.charAt(0) || 'O'}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                      <span>{order.orderNumber}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                        order.deliveryStatus === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        {order.deliveryStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {order.items.map(i => `${i.quantity}x ${i.title}`).join(', ')}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-black text-xs text-slate-900 dark:text-white font-mono">
                    {formatPrice(order.totalUsd)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {order.createdAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Precious Metals Custody Widget (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-amber-500/5 via-amber-600/5 to-transparent dark:bg-[#121622] rounded-3xl p-6 border border-amber-200 dark:border-amber-800/40 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-500" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Gold & Bullion Custody</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
              Assay Certified 99.99%
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Physical gold bars in Kingdom vault custody earn daily compounding yield backed by licensed vault nodes.
          </p>

          <div className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Total Gold In Vault:</span>
              <span className="font-bold text-slate-900 dark:text-white">{bullionGrams} Grams</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Cambodian Units:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">{bullionDamloeng} Damloeng ({bullionChi} Chi)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Annual Staking APY:</span>
              <span className="font-bold text-emerald-500">+{profitSettings.bullionVaultYieldApy}% per annum</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-2 font-bold">
              <span className="text-slate-900 dark:text-white">Annual Est. Yield:</span>
              <span className="text-emerald-500">+${annualYieldUsd} USD</span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profit_custom')}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
          >
            <span>Manage Staking & Profit Custom Settings</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
