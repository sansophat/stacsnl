import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Store, 
  PlusCircle, 
  Package, 
  Sparkles, 
  Briefcase, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  DollarSign,
  Building2,
  X, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Camera, 
  Coins,
  Search,
  Sliders,
  AlertTriangle,
  ArrowUpRight,
  ChevronRight,
  Filter,
  Trash2,
  Eye,
  Wallet,
  Calendar,
  Layers,
  ChevronDown,
  Navigation,
  RefreshCw,
  Award
} from 'lucide-react';
import { OfferingType, ListingItem, Order, DeliveryStatus, Vendor } from '../types';
import { EditShopModal } from '../components/EditShopModal';
import { EditProductModal } from '../components/EditProductModal';
import { DispatchOrderModal } from '../components/DispatchOrderModal';
import { VendorPayoutModal } from '../components/VendorPayoutModal';

type VendorTab = 'products' | 'stock' | 'orders' | 'delivery' | 'wallet' | 'sold';

export const VendorHubView: React.FC = () => {
  const { 
    currentUser,
    currentVendor,
    vendors,
    listings, 
    orders, 
    addNewListing, 
    updateListingStock,
    advanceDeliveryStatus, 
    vendorPayouts,
    platformSettings,
    formatPrice, 
    language, 
    t, 
    addToast 
  } = useApp();

  // Active vendor selection (Scoped to merchant's own business)
  const [selectedVendorOverride, setSelectedVendorOverride] = useState<string | null>(null);

  const activeVendor: Vendor = 
    (selectedVendorOverride ? vendors.find(v => v.id === selectedVendorOverride) : null) ||
    currentVendor ||
    vendors.find(v => v.id === currentUser?.vendorId) ||
    vendors[0];

  // Active tab state
  const [activeTab, setActiveTab] = useState<VendorTab>('products');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ListingItem | null>(null);
  const [dispatchOrder, setDispatchOrder] = useState<Order | null>(null);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState('');
  const [productTypeFilter, setProductTypeFilter] = useState<OfferingType | 'all'>('all');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'in_transit' | 'delivered'>('all');

  // Add Listing Form state
  const [offeringType, setOfferingType] = useState<OfferingType>('product');
  const [title, setTitle] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [priceUsd, setPriceUsd] = useState<number>(120);
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [inventoryCount, setInventoryCount] = useState<number>(25);
  const [sku, setSku] = useState('');

  // Metal specific fields
  const [purity, setPurity] = useState('99.99% (24K Gold)');
  const [metalWeightGrams, setMetalWeightGrams] = useState<number>(37.5);
  const [metalWeightChi, setMetalWeightChi] = useState<number>(10);

  // Service specific fields
  const [serviceDuration, setServiceDuration] = useState('3-5 Business Days');

  // =========================================================================
  // MULTI-TENANT ISOLATION: FILTER STRICTLY FOR THIS MERCHANT'S OWN DATA
  // =========================================================================
  const myListings = listings.filter(item => item.vendorId === activeVendor.id);
  
  const myOrders = orders.filter(order => 
    order.items.some(item => item.vendorId === activeVendor.id)
  );

  // Extracted sold item records belonging only to this merchant
  const mySoldItems = myOrders.flatMap(order => 
    order.items
      .filter(item => item.vendorId === activeVendor.id)
      .map(item => ({
        ...item,
        orderId: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        shippingCity: order.shippingCity,
        orderDate: order.createdAt,
        paymentStatus: order.paymentStatus,
        deliveryStatus: order.deliveryStatus
      }))
  );

  // Analytics & Metrics calculation strictly for this merchant
  const totalUnitsSold = mySoldItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalGrossRevenue = mySoldItems.reduce((acc, item) => acc + item.totalPriceUsd, 0);
  const commissionRate = activeVendor.commissionRatePercent || 3.5;
  const totalCommissionDeducted = +(totalGrossRevenue * (commissionRate / 100)).toFixed(2);
  const totalNetEarnings = +(totalGrossRevenue - totalCommissionDeducted).toFixed(2);
  
  // Total payouts made for this vendor
  const vendorPayoutTotal = vendorPayouts
    .filter(p => p.vendorId === activeVendor.id && p.status === 'completed')
    .reduce((acc, p) => acc + p.amountUsd, 0);

  // Available balance for payout
  const availablePayoutBalance = Math.max(0, +(totalNetEarnings - vendorPayoutTotal).toFixed(2));

  const pendingOrders = myOrders.filter(o => o.deliveryStatus !== 'delivered');
  const lowStockListings = myListings.filter(item => item.type !== 'service' && (item.inventoryCount ?? 0) <= 5);

  // Filtered listings
  const filteredListings = myListings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(productSearch.toLowerCase()) ||
      item.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesType = productTypeFilter === 'all' || item.type === productTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filtered orders
  const filteredOrders = myOrders.filter(order => {
    if (orderFilter === 'pending') return order.deliveryStatus === 'order_confirmed' || order.deliveryStatus === 'preparing_dispatch';
    if (orderFilter === 'in_transit') return order.deliveryStatus === 'picked_up_courier' || order.deliveryStatus === 'in_transit' || order.deliveryStatus === 'out_for_delivery';
    if (orderFilter === 'delivered') return order.deliveryStatus === 'delivered';
    return true;
  });

  // Create Listing Submit Handler
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const defaultImage = offeringType === 'metal' 
      ? 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80'
      : offeringType === 'service'
      ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80';

    addNewListing({
      type: offeringType,
      title,
      titleKm: titleKm || title,
      subtitle: subtitle || 'Verified merchant listing',
      subtitleKm: subtitle || 'មុខទំនិញមានការបញ្ជាក់ត្រឹមត្រូវ',
      description,
      descriptionKm: description,
      priceUsd,
      category,
      categoryKm: category,
      image: image.trim() || defaultImage,
      vendorId: activeVendor.id,
      vendorName: activeVendor.name,
      vendorNameKm: activeVendor.nameKm,
      vendorLocation: activeVendor.location,
      vendorVerified: activeVendor.verified,
      sku: sku.trim() || `SKU-${Math.floor(10000 + Math.random() * 90000)}`,
      inventoryCount: offeringType === 'service' ? undefined : inventoryCount,
      purity: offeringType === 'metal' ? purity : undefined,
      metalWeightGrams: offeringType === 'metal' ? metalWeightGrams : undefined,
      metalWeightChi: offeringType === 'metal' ? metalWeightChi : undefined,
      metalType: offeringType === 'metal' ? 'gold' : undefined,
      assayCertified: offeringType === 'metal' ? true : undefined,
      vaultEligible: offeringType === 'metal' ? true : undefined,
      serviceDuration: offeringType === 'service' ? serviceDuration : undefined,
    });

    setAddModalOpen(false);
    // Reset Form
    setTitle('');
    setTitleKm('');
    setSubtitle('');
    setDescription('');
    setImage('');
    setSku('');
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & STORE PROFILE SWITCHER                  */}
      {/* ======================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              <Store className="w-3 h-3" />
              <span>Merchant Operations Center</span>
            </span>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Only Your Products & Orders
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
            {activeVendor.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {activeVendor.tagline} · {activeVendor.location}
          </p>
        </div>

        {/* Action Controls & Store Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Demo Store Selector for Testing Multi-Tenancy */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Store:</span>
            <select
              value={activeVendor.id}
              onChange={e => setSelectedVendorOverride(e.target.value)}
              className="bg-transparent font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none"
            >
              {vendors.map(v => (
                <option key={v.id} value={v.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setIsEditShopOpen(true)}
            className="px-4 py-2 bg-white dark:bg-[#161922] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Edit3 className="w-4 h-4 text-amber-500" />
            <span>Edit Shop & Images</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. STORE HERO BANNER & STATUS CARD                      */}
      {/* ======================================================== */}
      <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="h-36 sm:h-44 w-full bg-slate-900 relative">
          <img
            src={activeVendor.coverImage}
            alt={activeVendor.name}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white font-mono text-[11px] font-bold border border-white/20">
              MOC: {activeVendor.mocLicenseNumber || 'MOC-REG-88291'}
            </span>
          </div>
        </div>

        <div className="p-5 sm:p-6 relative -mt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="flex items-end gap-3.5">
            <img
              src={activeVendor.logo}
              alt={activeVendor.name}
              className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-[#161922] shadow-md bg-white shrink-0"
            />
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {language === 'km' && activeVendor.nameKm ? activeVendor.nameKm : activeVendor.name}
                </h2>
                {activeVendor.verified && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 border border-emerald-500/20">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Merchant</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-blue-500" /> {activeVendor.location}</span>
                <span>·</span>
                <span>Settlement: <strong className="font-mono text-slate-700 dark:text-slate-300">{activeVendor.bankAccount?.bankName} ({activeVendor.bankAccount?.accountNumber})</strong></span>
                {activeVendor.bankAccount?.bakongAccountId && (
                  <>
                    <span>·</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono font-bold">KHQR: {activeVendor.bankAccount.bakongAccountId}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Request Payout</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. CORE METRICS KPI CARDS (MERCHANT-SCOPED ONLY)        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Gross Sales */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Gross Sold Value</div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            ${totalGrossRevenue.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400">Lifetime volume</div>
        </div>

        {/* Net Merchant Earnings */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Net Earnings</div>
          <div className="text-lg font-black text-purple-600 font-mono">
            ${totalNetEarnings.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400">After {commissionRate}% platform fee</div>
        </div>

        {/* Available Wallet Balance */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 shadow-2xs space-y-1">
          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase flex items-center justify-between">
            <span>Available Balance</span>
            <Wallet className="w-3 h-3" />
          </div>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
            ${availablePayoutBalance.toFixed(2)}
          </div>
          <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="text-[10px] text-blue-600 hover:underline font-bold"
          >
            Transfer to Bank →
          </button>
        </div>

        {/* Units Sold */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">Units Sold</div>
          <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
            {totalUnitsSold} items
          </div>
          <div className="text-[10px] text-slate-400">Across {myOrders.length} orders</div>
        </div>

        {/* Active Products Count */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
          <div className="text-[10px] text-slate-400 font-bold uppercase">My Products</div>
          <div className="text-lg font-black text-blue-600 font-mono">
            {myListings.length}
          </div>
          <div className="text-[10px] text-slate-400">In storefront catalog</div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`p-4 rounded-2xl border shadow-2xs space-y-1 ${
          lowStockListings.length > 0 
            ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-500/40 text-amber-700 dark:text-amber-300'
            : 'bg-white dark:bg-[#161922] border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        }`}>
          <div className="text-[10px] font-bold uppercase flex items-center justify-between">
            <span>Low Stock Alert</span>
            {lowStockListings.length > 0 && <AlertTriangle className="w-3 h-3 text-amber-500" />}
          </div>
          <div className="text-lg font-black font-mono">
            {lowStockListings.length}
          </div>
          <button
            onClick={() => setActiveTab('stock')}
            className="text-[10px] text-amber-600 hover:underline font-bold"
          >
            Manage Inventory →
          </button>
        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. MAIN FUNCTIONAL NAVIGATION BAR                       */}
      {/* ======================================================== */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-2 scrollbar-none text-xs">
        
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'products'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Products ({myListings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stock')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'stock'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Stock Control</span>
          {lowStockListings.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-bold">
              {lowStockListings.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'orders'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Customer Orders ({myOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('delivery')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'delivery'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Delivery & Dispatch System</span>
          {pendingOrders.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-white text-[10px] font-bold">
              {pendingOrders.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'wallet'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Wallet className="w-4 h-4" />
          <span>Merchant Wallet & Payout</span>
        </button>

        <button
          onClick={() => setActiveTab('sold')}
          className={`px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shrink-0 ${
            activeTab === 'sold'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Sold & Analytics ({totalUnitsSold})</span>
        </button>

      </div>

      {/* ======================================================== */}
      {/* TAB 1: MY PRODUCTS & CATALOG (EDIT / ADD / DELETE)      */}
      {/* ======================================================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#161922] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search your products by title, SKU, or notes..."
                  value={productSearch}
                  onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                {(['all', 'product', 'metal', 'service'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setProductTypeFilter(type)}
                    className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-colors ${
                      productTypeFilter === type
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {type === 'all' ? 'All Types' : type === 'metal' ? 'Bullion' : type}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAddModalOpen(true)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <Package className="w-12 h-12 mx-auto text-slate-400" />
              <div className="font-extrabold text-slate-900 dark:text-white text-base">No Products Found</div>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                You haven't listed any items under this filter yet. Add your first product, bullion bar, or professional service now.
              </p>
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                + Add New Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map(item => (
                <div 
                  key={item.id}
                  className="bg-white dark:bg-[#161922] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700"
                    />
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                          item.type === 'metal' 
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : item.type === 'service'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.sku || item.id}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Pricing and Stock details */}
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[9px] text-slate-400 uppercase font-bold">Selling Price</div>
                      <div className="font-mono font-black text-slate-900 dark:text-white text-sm">
                        ${item.priceUsd.toFixed(2)}
                      </div>
                    </div>

                    {item.type !== 'service' ? (
                      <div className="text-right">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Stock In Hand</div>
                        <div className={`font-mono font-black text-xs ${
                          (item.inventoryCount ?? 0) <= 5 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {item.inventoryCount ?? 0} units
                        </div>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="text-[9px] text-slate-400 uppercase font-bold">Duration</div>
                        <div className="font-bold text-xs text-blue-600 dark:text-blue-400">
                          {item.serviceDuration || '3-5 Days'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => setEditingProduct(item)}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Edit Product</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: STOCK & INVENTORY CONTROL                        */}
      {/* ======================================================== */}
      {activeTab === 'stock' && (
        <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-blue-600" />
                <span>Warehouse & Shelf Stock Control</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Adjust on-hand inventory levels instantly. Low stock threshold alert triggers at 5 units.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 font-bold">
                In Stock: {myListings.filter(i => (i.inventoryCount ?? 0) > 5).length}
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-600 font-bold">
                Low Stock: {lowStockListings.length}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 font-bold">Product / Bullion Bar</th>
                  <th className="py-2.5 font-bold">SKU Serial</th>
                  <th className="py-2.5 font-bold">Price</th>
                  <th className="py-2.5 font-bold">Stock Status</th>
                  <th className="py-2.5 font-bold">Current Units</th>
                  <th className="py-2.5 font-bold text-right">Quick Stock Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {myListings.map(item => {
                  if (item.type === 'service') return null;
                  const count = item.inventoryCount ?? 0;
                  const isLow = count <= 5;
                  const isOut = count === 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-9 h-9 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                            <div className="text-[10px] text-slate-400">{item.category}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 font-mono font-bold text-slate-500">
                        {item.sku || 'N/A'}
                      </td>

                      <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                        ${item.priceUsd.toFixed(2)}
                      </td>

                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          isOut
                            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                            : isLow
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>

                      <td className="py-3 font-mono font-black text-sm text-slate-900 dark:text-white">
                        {count}
                      </td>

                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => updateListingStock(item.id, Math.max(0, count - 5))}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-mono font-bold text-[10px]"
                            title="Decrease 5"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => updateListingStock(item.id, Math.max(0, count - 1))}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-mono font-bold text-[10px]"
                            title="Decrease 1"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => updateListingStock(item.id, count + 1)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-blue-600 font-mono font-bold text-[10px]"
                            title="Increase 1"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => updateListingStock(item.id, count + 10)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-100 text-blue-600 font-mono font-bold text-[10px]"
                            title="Increase 10"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => updateListingStock(item.id, 50)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100 font-bold text-[10px]"
                            title="Restock to 50"
                          >
                            Restock
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CUSTOMER ORDERS (FOR THIS MERCHANT ONLY)         */}
      {/* ======================================================== */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          
          {/* Order filters */}
          <div className="flex items-center justify-between bg-white dark:bg-[#161922] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">Filter Status:</span>
              <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                {(['all', 'pending', 'in_transit', 'delivered'] as const).map(status => (
                  <button
                    key={status}
                    onClick={() => setOrderFilter(status)}
                    className={`px-3 py-1 rounded-lg font-bold capitalize transition-colors ${
                      orderFilter === status
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {status === 'all' ? 'All Orders' : status.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs font-mono font-bold text-slate-400">
              Showing {filteredOrders.length} orders
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-400" />
              <div className="font-bold text-slate-900 dark:text-white">No Orders Found</div>
              <p className="text-xs text-slate-400">
                You currently have no customer orders matching the selected filter.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map(order => {
                const merchantItems = order.items.filter(i => i.vendorId === activeVendor.id);
                const merchantSubtotal = merchantItems.reduce((acc, i) => acc + i.totalPriceUsd, 0);

                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-slate-900 dark:text-white">{order.orderNumber}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-500">{order.trackingNumber}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          order.deliveryStatus === 'delivered'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {order.deliveryStatus.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-slate-400">
                        <span>{order.createdAt}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold uppercase text-[9px] text-slate-700 dark:text-slate-300">
                          {order.paymentMethod.toUpperCase()} · {order.paymentStatus.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Customer Info */}
                      <div className="space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Customer & Shipping</div>
                        <div className="font-bold text-slate-900 dark:text-white">{order.customerName}</div>
                        <div className="text-slate-500 font-mono">{order.customerPhone}</div>
                        <div className="text-slate-500">{order.shippingAddress}, {order.shippingCity}</div>
                      </div>

                      {/* Items from this merchant */}
                      <div className="space-y-1 md:col-span-1">
                        <div className="text-[10px] text-slate-400 uppercase font-bold">Your Store Items Ordered</div>
                        {merchantItems.map(item => (
                          <div key={item.itemId} className="flex items-center gap-2">
                            <img src={item.image} alt={item.title} className="w-7 h-7 rounded-lg object-cover" />
                            <div className="min-w-0">
                              <div className="font-medium text-slate-900 dark:text-white truncate">{item.title}</div>
                              <div className="text-[10px] text-slate-400 font-mono">
                                {item.quantity} × ${item.unitPriceUsd.toFixed(2)} = ${item.totalPriceUsd.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Financials & Dispatch Action */}
                      <div className="flex flex-col justify-between items-start md:items-end gap-2 text-right">
                        <div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold">Your Order Share</div>
                          <div className="font-mono font-black text-base text-slate-900 dark:text-white">
                            ${merchantSubtotal.toFixed(2)}
                          </div>
                        </div>

                        <button
                          onClick={() => setDispatchOrder(order)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span>Manage Delivery & Dispatch</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: DELIVERY SYSTEM (DISPATCH PIPELINE)              */}
      {/* ======================================================== */}
      {activeTab === 'delivery' && (
        <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <span>Active Delivery & Logistics Pipeline</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Assign couriers (Armored Vault, SNL Express, Kerry, J&T), generate tracking codes, and advance delivery stages.
              </p>
            </div>

            <div className="text-xs font-mono font-bold text-slate-400">
              {pendingOrders.length} in dispatch progress
            </div>
          </div>

          <div className="space-y-4">
            {myOrders.map(order => (
              <div 
                key={order.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900 dark:text-white">{order.orderNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{order.trackingNumber}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-medium">Carrier:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{order.courierName}</span>
                    <button
                      onClick={() => setDispatchOrder(order)}
                      className="ml-2 px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-[10px] hover:bg-blue-500 transition-colors"
                    >
                      Update Courier & Stage
                    </button>
                  </div>
                </div>

                {/* Milestone Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                  {order.milestones.map((milestone, idx) => (
                    <div 
                      key={idx}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        milestone.completed
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
                          : milestone.current
                          ? 'bg-blue-50 dark:bg-blue-950/30 border-blue-500 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                    >
                      <div className="font-mono text-[9px] font-bold uppercase opacity-75">Step {idx + 1}</div>
                      <div className="font-bold text-[10px] truncate mt-0.5">{milestone.stage.replace(/_/g, ' ')}</div>
                      <div className="text-[9px] opacity-75 truncate mt-0.5">{milestone.location}</div>
                    </div>
                  ))}
                </div>

                {/* Direct quick advance button */}
                {order.deliveryStatus !== 'delivered' && (
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => advanceDeliveryStatus(order.id)}
                      className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-blue-600 hover:text-white font-bold text-xs text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                    >
                      <span>Advance to Next Delivery Stage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: MERCHANT WALLET & BANK PAYOUT                    */}
      {/* ======================================================== */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          
          {/* Wallet Balance Hero */}
          <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-blue-900/50 shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-bold text-[10px] uppercase tracking-wider">
                    Settlement Account Active
                  </span>
                  <span className="text-slate-400 font-mono text-xs">
                    {activeVendor.bankAccount?.bankName} · {activeVendor.bankAccount?.accountNumber}
                  </span>
                </div>

                <div className="text-xs text-slate-400">Available Net Earnings Ready for Payout</div>
                <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                  ${availablePayoutBalance.toFixed(2)}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  ≈ {(availablePayoutBalance * platformSettings.usdToKhrRate).toLocaleString()} KHR (Peg 1 USD = 4,100 KHR)
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => setIsPayoutModalOpen(true)}
                  disabled={availablePayoutBalance <= 0}
                  className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Request Bank Payout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Settlement Details & Payout History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Settlement Bank Info */}
            <div className="p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Configured Settlement Account</span>
              </h4>

              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Bank Name</div>
                  <div className="font-bold text-slate-900 dark:text-white">{activeVendor.bankAccount?.bankName}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Account Number</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">{activeVendor.bankAccount?.accountNumber}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Beneficiary Name</div>
                  <div className="font-bold uppercase text-slate-900 dark:text-white">{activeVendor.bankAccount?.accountHolder || activeVendor.name}</div>
                </div>

                {activeVendor.bankAccount?.bakongAccountId && (
                  <div className="p-3.5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/40 space-y-1">
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 uppercase font-bold">NBC Bakong KHQR ID</div>
                    <div className="font-mono font-bold text-blue-700 dark:text-blue-300">{activeVendor.bankAccount.bakongAccountId}</div>
                  </div>
                )}

                <button
                  onClick={() => setIsEditShopOpen(true)}
                  className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Edit Bank Settings
                </button>
              </div>
            </div>

            {/* Right: Payout Ledger */}
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Coins className="w-4 h-4 text-emerald-600" />
                  <span>Settlement & Payout Ledger</span>
                </h4>
                <span className="text-xs font-mono text-slate-400">
                  Total Paid Out: ${vendorPayoutTotal.toFixed(2)}
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {vendorPayouts
                  .filter(p => p.vendorId === activeVendor.id)
                  .map(payout => (
                    <div key={payout.id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{payout.bankName}</span>
                          <span className="font-mono text-slate-400">({payout.accountNumber})</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                            {payout.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Ref: {payout.referenceNumber} · {payout.createdAt}
                        </div>
                      </div>

                      <div className="text-right font-mono">
                        <div className="font-black text-sm text-slate-900 dark:text-white">
                          ${payout.amountUsd.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {payout.amountKhr.toLocaleString()} KHR
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: SOLD & SALES ANALYTICS                           */}
      {/* ======================================================== */}
      {activeTab === 'sold' && (
        <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span>Sales Ledger & Items Sold History</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every unit sold from this storefront with transaction timestamps, buyer, and profit share.
              </p>
            </div>

            <div className="text-right text-xs">
              <span className="text-slate-400">Lifetime Units Sold: </span>
              <span className="font-mono font-black text-slate-900 dark:text-white">{totalUnitsSold}</span>
            </div>
          </div>

          {mySoldItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No sold items recorded yet for this storefront.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                    <th className="py-2.5 font-bold">Item Sold</th>
                    <th className="py-2.5 font-bold">Order #</th>
                    <th className="py-2.5 font-bold">Customer</th>
                    <th className="py-2.5 font-bold">Date</th>
                    <th className="py-2.5 font-bold">Qty</th>
                    <th className="py-2.5 font-bold">Unit Price</th>
                    <th className="py-2.5 font-bold">Gross Total</th>
                    <th className="py-2.5 font-bold text-right">Net Take-Home</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {mySoldItems.map((item, idx) => {
                    const gross = item.totalPriceUsd;
                    const net = +(gross * (1 - commissionRate / 100)).toFixed(2);

                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <img src={item.image} alt={item.title} className="w-8 h-8 rounded-lg object-cover" />
                            <div className="font-bold text-slate-900 dark:text-white max-w-xs truncate">
                              {item.title}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 font-mono text-slate-500 font-bold">
                          {item.orderNumber}
                        </td>

                        <td className="py-3">
                          <div className="font-medium text-slate-900 dark:text-white">{item.customerName}</div>
                          <div className="text-[10px] text-slate-400">{item.shippingCity}</div>
                        </td>

                        <td className="py-3 text-slate-400 text-[11px]">
                          {item.orderDate}
                        </td>

                        <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                          x{item.quantity}
                        </td>

                        <td className="py-3 font-mono text-slate-700 dark:text-slate-300">
                          ${item.unitPriceUsd.toFixed(2)}
                        </td>

                        <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                          ${gross.toFixed(2)}
                        </td>

                        <td className="py-3 font-mono font-black text-purple-600 text-right">
                          ${net.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. ADD LISTING MODAL                                    */}
      {/* ======================================================== */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#151922] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Add New Product to Store Catalog
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="p-6 space-y-4 overflow-y-auto text-xs flex-1">
              
              {/* Category Selector */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                  Offering Category *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOfferingType('product')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      offeringType === 'product'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Package className="w-3.5 h-3.5" />
                    <span>Physical Product</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOfferingType('metal')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      offeringType === 'metal'
                        ? 'bg-amber-500 text-slate-950 font-black border-amber-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Precious Metal</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOfferingType('service')}
                    className={`py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      offeringType === 'service'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Service Offering</span>
                  </button>
                </div>
              </div>

              {/* Title & Khmer Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g., 24K Cast Gold Bar or Organic Kampot Pepper"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Title (Khmer ខ្មែរ)
                  </label>
                  <input
                    type="text"
                    value={titleKm}
                    onChange={e => setTitleKm(e.target.value)}
                    placeholder="ឈ្មោះមុខទំនិញជាភាសាខ្មែរ"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Subtitle / Highlight Tagline
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  placeholder="Short tagline displayed in cards"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              {/* Price, Stock, Category, SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Price ($ USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={priceUsd}
                    onChange={e => setPriceUsd(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                {offeringType !== 'service' && (
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                      Initial Stock *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={inventoryCount}
                      onChange={e => setInventoryCount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-emerald-600 dark:text-emerald-400 font-bold"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={e => setSku(e.target.value)}
                    placeholder="Auto-generated if blank"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Metal specific section */}
              {offeringType === 'metal' && (
                <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
                  <div className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gold & Precious Metal Specifications</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">Purity</label>
                      <input
                        type="text"
                        value={purity}
                        onChange={e => setPurity(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">Weight (Grams)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={metalWeightGrams}
                        onChange={e => {
                          const g = parseFloat(e.target.value) || 0;
                          setMetalWeightGrams(g);
                          setMetalWeightChi(+(g / 3.75).toFixed(2));
                        }}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 dark:text-slate-400 mb-1">Weight (Chi ជី)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={metalWeightChi}
                        onChange={e => {
                          const chi = parseFloat(e.target.value) || 0;
                          setMetalWeightChi(chi);
                          setMetalWeightGrams(+(chi * 3.75).toFixed(2));
                        }}
                        className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Service specific section */}
              {offeringType === 'service' && (
                <div className="p-3.5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-2">
                  <div className="font-black text-blue-800 dark:text-blue-300">Service Duration</div>
                  <input
                    type="text"
                    value={serviceDuration}
                    onChange={e => setServiceDuration(e.target.value)}
                    placeholder="e.g. 3-5 Business Days"
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>
              )}

              {/* Image URL / Upload */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Product Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="Paste URL or leave empty for curated preset"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-[11px]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Description & Specifications
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Detail specifications, warranty, or delivery policies..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-xs"
                >
                  Publish Listing
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODALS                                                */}
      {/* ======================================================== */}
      {/* Edit Shop Modal */}
      <EditShopModal
        vendor={activeVendor}
        isOpen={isEditShopOpen}
        onClose={() => setIsEditShopOpen(false)}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        item={editingProduct}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
      />

      {/* Dispatch Order Modal */}
      <DispatchOrderModal
        order={dispatchOrder}
        isOpen={!!dispatchOrder}
        onClose={() => setDispatchOrder(null)}
      />

      {/* Vendor Payout Modal */}
      <VendorPayoutModal
        vendor={activeVendor}
        availableBalanceUsd={availablePayoutBalance}
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
      />

    </div>
  );
};
