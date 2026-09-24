import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { BannerSlideshow } from '../components/BannerSlideshow';
import { SnlLogo } from '../components/SnlLogo';
import { ListingItem, OfferingType } from '../types';
import { 
  Sparkles, 
  Package, 
  Briefcase, 
  Layers, 
  Truck, 
  ShieldCheck, 
  Wallet,
  TrendingUp,
  Filter,
  Search,
  ArrowRight,
  Store,
  CheckCircle2,
  LogIn,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';

interface MarketplaceViewProps {
  onViewItem: (item: ListingItem) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({ onViewItem }) => {
  const { 
    listings, 
    vendors,
    offeringFilter, 
    setOfferingFilter, 
    searchQuery, 
    setSearchQuery,
    metalSpotPrices,
    language,
    t,
    setActiveTab,
    isAuthenticated,
    setIsAuthModalOpen,
    loginAsDemo
  } = useApp();

  const [selectedVendorFilter, setSelectedVendorFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_low' | 'price_high' | 'in_stock'>('featured');

  // Filter listings based on category, search query, and vendor
  const filteredListings = listings
    .filter(item => {
      // Category filter
      if (offeringFilter !== 'all' && item.type !== offeringFilter) {
        return false;
      }
      // Vendor filter
      if (selectedVendorFilter !== 'all' && item.vendorId !== selectedVendorFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q) || item.titleKm.toLowerCase().includes(q);
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchVendor = item.vendorName.toLowerCase().includes(q);
        const matchSku = item.sku?.toLowerCase().includes(q);
        return matchTitle || matchCategory || matchVendor || matchSku;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price_low') return a.priceUsd - b.priceUsd;
      if (sortBy === 'price_high') return b.priceUsd - a.priceUsd;
      if (sortBy === 'in_stock') return (b.inventoryCount || 0) - (a.inventoryCount || 0);
      return 0; // featured / default
    });

  const goldSpot = metalSpotPrices.find(m => m.metal === 'gold');
  const silverSpot = metalSpotPrices.find(m => m.metal === 'silver');

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* ======================================================== */}
      {/* 1. TOP ADVERTISING BANNER SLIDESHOW (PROMOTIONAL SLIDER) */}
      {/* ======================================================== */}
      <section aria-label="Promotional Advertising Slideshow">
        <BannerSlideshow />
      </section>

      {/* ======================================================== */}
      {/* 2. GUEST WELCOME INVITATION RIBBON (VISIBLE FOR GUESTS) */}
      {/* ======================================================== */}
      {!isAuthenticated && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5 sm:p-6 border border-blue-700/50 shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Guest Visitor Mode</span>
                </span>
                <span className="text-xs text-blue-200">
                  Welcome to Cambodia's Premier Multi-Vendor Ecosystem
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                Browse Products Freely or Sign In for Vault Custody & Bakong KHQR
              </h3>
              <p className="text-xs text-blue-200 max-w-2xl">
                Explore authentic physical merchandise, certified 24K gold bullion, and professional services. Log in to track orders, manage your Bakong balance, and deposit to your secure bullion vault.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-blue-600" />
                <span>Log In / Sign Up</span>
              </button>

              <button
                onClick={() => loginAsDemo('customer')}
                className="px-4 py-2.5 rounded-xl bg-blue-800/80 hover:bg-blue-700 text-white font-bold text-xs border border-blue-500/40 transition-all cursor-pointer"
              >
                <span>1-Click Test Customer</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LIVE METAL SPOT TICKER & BAKONG LIQUIDITY WIDGET     */}
      {/* ======================================================== */}
      <div className="p-4 bg-white dark:bg-[#161922] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shrink-0">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>{t.metalSpotPrices}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400">
              Direct physical bullion refinery rates in Grams, Chi (3.75g), and Damloeng (37.5g)
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {goldSpot && (
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-amber-200">{t.goldSpot}:</span>
              <span className="font-mono font-black text-amber-600 dark:text-amber-400">
                ${goldSpot.pricePerGramUsd.toFixed(2)}/g
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                (${goldSpot.pricePerChiUsd.toFixed(2)}/chi)
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                +{goldSpot.change24h}%
              </span>
            </div>
          )}

          {silverSpot && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <span className="font-bold text-slate-900 dark:text-slate-200">{t.silverSpot}:</span>
              <span className="font-mono font-black text-slate-700 dark:text-slate-300">
                ${silverSpot.pricePerGramUsd.toFixed(2)}/g
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                +{silverSpot.change24h}%
              </span>
            </div>
          )}

          <button
            onClick={() => setOfferingFilter('metal')}
            className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 underline underline-offset-4 cursor-pointer"
          >
            View All Bullion Bars →
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4. VALUE PROPOSITION PILLARS                            */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">24K Bullion Metals</h4>
            <p className="text-[11px] text-slate-400">Assay Cards & Vault Delivery</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">100% Verified Merchants</h4>
            <p className="text-[11px] text-slate-400">MOC Licensed Businesses</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Escrow Protection</h4>
            <p className="text-[11px] text-slate-400">Milestone Handover Guarantee</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 flex items-center gap-3 shadow-2xs">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Armored Vault Dispatch</h4>
            <p className="text-[11px] text-slate-400">Insured 25-Province Logistics</p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 5. VERIFIED MERCHANT DIRECT FILTER STRIP                */}
      {/* ======================================================== */}
      <div className="bg-white dark:bg-[#161922] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-900 dark:text-white">Filter by Verified Merchant Store:</span>
          </div>
          {selectedVendorFilter !== 'all' && (
            <button
              onClick={() => setSelectedVendorFilter('all')}
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Reset Vendor Filter
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedVendorFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              selectedVendorFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            All Merchants ({vendors.length})
          </button>

          {vendors.map(v => (
            <button
              key={v.id}
              onClick={() => setSelectedVendorFilter(v.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                selectedVendorFilter === v.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <img src={v.logo} alt={v.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{v.name}</span>
              {v.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 6. PRODUCTS CATALOG SECTION & CONTROLS                  */}
      {/* ======================================================== */}
      <div id="products-section" className="space-y-4">
        
        {/* Controls Bar: Category Pills + Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white dark:bg-[#161922] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/90 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-none text-xs">
            <button
              onClick={() => setOfferingFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                offeringFilter === 'all'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t.filterAll}</span>
            </button>

            <button
              onClick={() => setOfferingFilter('product')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                offeringFilter === 'product'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>{t.tabProducts}</span>
            </button>

            <button
              onClick={() => setOfferingFilter('metal')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                offeringFilter === 'metal'
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.tabMetals} (24K Gold)</span>
            </button>

            <button
              onClick={() => setOfferingFilter('service')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                offeringFilter === 'service'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t.tabServices}</span>
            </button>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search products or SKU..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent font-bold text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
              >
                <option value="featured" className="bg-white dark:bg-slate-900">Featured First</option>
                <option value="price_low" className="bg-white dark:bg-slate-900">Price: Low to High</option>
                <option value="price_high" className="bg-white dark:bg-slate-900">Price: High to Low</option>
                <option value="in_stock" className="bg-white dark:bg-slate-900">Highest In-Stock</option>
              </select>
            </div>

            {/* Results Counter */}
            <div className="text-xs text-slate-400 font-mono font-bold pl-1">
              {filteredListings.length} items
            </div>
          </div>

        </div>

        {/* 7. PRODUCT CARDS GRID */}
        {filteredListings.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
            <Filter className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No items match your criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your search terms or clearing your vendor/category filters to see all available products.
            </p>
            <button
              onClick={() => {
                setOfferingFilter('all');
                setSelectedVendorFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredListings.map(item => (
              <ProductCard
                key={item.id}
                item={item}
                onViewDetails={onViewItem}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
};
