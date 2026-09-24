import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Store, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  FileText,
  DollarSign,
  AlertTriangle,
  Sliders,
  Settings,
  Coins,
  Building2,
  Lock,
  Layers,
  Sparkles,
  Save,
  RotateCcw,
  Search,
  Eye,
  UserCheck,
  UserX,
  CreditCard,
  FileCheck,
  Edit3
} from 'lucide-react';
import { KycStatus, KycTier, PlatformBrandingSettings, Vendor } from '../types';
import { EditShopModal } from '../components/EditShopModal';
import { AdminBannerManager } from '../components/AdminBannerManager';

export const AdminHubView: React.FC = () => {
  const { 
    vendors, 
    orders, 
    listings, 
    allUsers,
    updateUserStatus,
    updateUserKyc,
    toggleVendorVerification, 
    updateVendorCommission,
    updateVendorStatus,
    platformSettings,
    updatePlatformSettings,
    metalSpotPrices,
    updateMetalSpotPrice,
    formatPrice, 
    language, 
    t 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'branding' | 'banners' | 'users' | 'vendors' | 'spot_rates'>('overview');
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  // 1. Branding Settings State
  const [platformName, setPlatformName] = useState(platformSettings.platformName);
  const [platformTagline, setPlatformTagline] = useState(platformSettings.platformTagline);
  const [platformTaglineKm, setPlatformTaglineKm] = useState(platformSettings.platformTaglineKm);
  const [usdToKhrRate, setUsdToKhrRate] = useState(platformSettings.usdToKhrRate);
  const [defaultCommission, setDefaultCommission] = useState(platformSettings.defaultCommissionPercent);
  const [vatTax, setVatTax] = useState(platformSettings.vatTaxPercent);
  const [armoredFee, setArmoredFee] = useState(platformSettings.armoredTransportBaseFeeUsd);
  const [bakongMerchantId, setBakongMerchantId] = useState(platformSettings.bakongMerchantId);
  const [maintenanceMode, setMaintenanceMode] = useState(platformSettings.maintenanceMode);
  const [kycRequired, setKycRequired] = useState(platformSettings.kycRequiredForBullion);

  // 2. User Search / Filter
  const [userSearch, setUserSearch] = useState('');
  const [userFilterRole, setUserFilterRole] = useState<'all' | 'customer' | 'vendor' | 'admin'>('all');

  // 3. Spot Rates Form
  const [goldRate, setGoldRate] = useState(metalSpotPrices.find(m => m.metal === 'gold')?.pricePerGramUsd || 84.20);
  const [silverRate, setSilverRate] = useState(metalSpotPrices.find(m => m.metal === 'silver')?.pricePerGramUsd || 1.15);

  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlatformSettings({
      platformName,
      platformTagline,
      platformTaglineKm,
      usdToKhrRate,
      defaultCommissionPercent: defaultCommission,
      vatTaxPercent: vatTax,
      armoredTransportBaseFeeUsd: armoredFee,
      bakongMerchantId,
      maintenanceMode,
      kycRequiredForBullion: kycRequired
    });
  };

  // Metrics
  const totalPlatformGmv = orders.reduce((acc, o) => acc + o.totalUsd, 0) + 128400;
  const netCommissionRevenue = totalPlatformGmv * (platformSettings.defaultCommissionPercent / 100);
  const verifiedVendors = vendors.filter(v => v.verified).length;
  const pendingKycCount = allUsers.filter(u => u.kycStatus === 'pending').length;

  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
                          u.phone.includes(userSearch);
    const matchesRole = userFilterRole === 'all' || u.role === userFilterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Platform Governance & Control Center</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Complete administrative control over branding, user verification (KYC), merchant licenses, and live metal spot rates.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'branding'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Branding & Config
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'banners'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Banner Ads & Slideshow</span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>User Management</span>
            {pendingKycCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center">
                {pendingKycCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'vendors'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Merchants & KYB
          </button>
          <button
            onClick={() => setActiveTab('spot_rates')}
            className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'spot_rates'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Metal Spot Engine
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: EXECUTIVE GOVERNANCE OVERVIEW                     */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Gross Platform GMV</div>
              <div className="text-2xl font-black text-purple-600 font-mono">
                {formatPrice(totalPlatformGmv)}
              </div>
              <div className="text-[10px] text-slate-400">All 25 Cambodian provinces</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Platform Net Revenue</div>
              <div className="text-2xl font-black text-emerald-600 font-mono">
                {formatPrice(netCommissionRevenue)}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">{platformSettings.defaultCommissionPercent}% Take Rate via Bakong</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">24K Bullion Vault Reserve</div>
              <div className="text-2xl font-black text-amber-500 font-mono">
                4,287.5g
              </div>
              <div className="text-[10px] text-slate-400">≈ 114.3 Damloeng in Custody</div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#121622] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">KYC Compliance Audit</div>
              <div className="text-2xl font-black text-blue-600 font-mono">
                98.4%
              </div>
              <div className="text-[10px] text-slate-400">{allUsers.length} total users enrolled</div>
            </div>

          </div>

          {/* Platform Performance Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Performance */}
            <div className="lg:col-span-6 bg-white dark:bg-[#121622] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Turnover Distribution by Sector</span>
              </h2>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-amber-500">24K Precious Metals & Bullion</span>
                    <span className="font-mono text-slate-900 dark:text-white">64.5% ($82,818)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '64.5%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-blue-500">Consulting & High-Tech Services</span>
                    <span className="font-mono text-slate-900 dark:text-white">21.0% ($26,964)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '21.0%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-emerald-500">Agritech, Textiles & Physical Goods</span>
                    <span className="font-mono text-slate-900 dark:text-white">14.5% ($18,618)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '14.5%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Live Security & Audit Trail */}
            <div className="lg:col-span-6 bg-white dark:bg-[#121622] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Security & Compliance Audit Trail</span>
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Live
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Bakong KHQR Universal Clearing Node</div>
                    <div className="text-[10px] text-slate-400">Settlement Batch #8812 - 0 errors</div>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-mono">10:42 AM</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">Armored Van AT-09 Handover Confirmed</div>
                    <div className="text-[10px] text-slate-400">BKK1 Phnom Penh Secure Courier Route</div>
                  </div>
                  <span className="text-[10px] text-blue-500 font-mono">09:15 AM</span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 dark:text-slate-200">MOC Precious Metals Assay Certified</div>
                    <div className="text-[10px] text-slate-400">Angkor Royal Bullion Batch 999.9</div>
                  </div>
                  <span className="text-[10px] text-amber-500 font-mono">Yesterday</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: BRANDING & PLATFORM GOVERNANCE SETTINGS           */}
      {/* ======================================================== */}
      {activeTab === 'branding' && (
        <form onSubmit={handleSaveBranding} className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Platform Branding, Currency Peg & Governance
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Customize platform identity, official NBC exchange rates, take rate commissions, and compliance rules.
              </p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Platform Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform Brand Name
              </label>
              <input
                type="text"
                value={platformName}
                onChange={e => setPlatformName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
              />
            </div>

            {/* Official USD/KHR Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                National Bank of Cambodia Peg Rate (KHR per 1 USD)
              </label>
              <input
                type="number"
                value={usdToKhrRate}
                onChange={e => setUsdToKhrRate(parseInt(e.target.value) || 4100)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            {/* Platform Tagline (EN) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform Tagline (English)
              </label>
              <input
                type="text"
                value={platformTagline}
                onChange={e => setPlatformTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Platform Tagline (KM) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform Tagline (Khmer ខ្មែរ)
              </label>
              <input
                type="text"
                value={platformTaglineKm}
                onChange={e => setPlatformTaglineKm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            {/* Default Commission % */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Platform Default Commission Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={defaultCommission}
                onChange={e => setDefaultCommission(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            {/* Armored Base Delivery Fee */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Armored Vault Logistics Base Fee ($ USD)
              </label>
              <input
                type="number"
                step="1"
                value={armoredFee}
                onChange={e => setArmoredFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            {/* Bakong Merchant ID */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Universal NBC Bakong Merchant Account ID
              </label>
              <input
                type="text"
                value={bakongMerchantId}
                onChange={e => setBakongMerchantId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono"
              />
            </div>

            {/* Compliance Toggles */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Require KYC Tier 2 for Bullion
                </span>
                <input
                  type="checkbox"
                  checked={kycRequired}
                  onChange={e => setKycRequired(e.target.checked)}
                  className="w-4 h-4 accent-purple-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-rose-600">
                  Emergency Maintenance Mode
                </span>
                <input
                  type="checkbox"
                  checked={maintenanceMode}
                  onChange={e => setMaintenanceMode(e.target.checked)}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
              </div>
            </div>

          </div>
        </form>
      )}

      {/* ======================================================== */}
      {/* TAB: BANNER ADS & SLIDESHOW MANAGER                      */}
      {/* ======================================================== */}
      {activeTab === 'banners' && (
        <AdminBannerManager />
      )}

      {/* ======================================================== */}
      {/* TAB 3: USER MANAGEMENT & KYC AUDITING                   */}
      {/* ======================================================== */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                <span>User Directory & KYC Verification Center</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit registered buyers, merchants, and staff; verify submitted KYC documents and control access.
              </p>
            </div>

            {/* Search and Role Filter */}
            <div className="flex items-center gap-2">
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search name, email, phone..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <select
                value={userFilterRole}
                onChange={e => setUserFilterRole(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-bold"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customer</option>
                <option value="vendor">Vendor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 font-bold">User Name & Contact</th>
                  <th className="py-2.5 font-bold">Role</th>
                  <th className="py-2.5 font-bold">KYC Status & Tier</th>
                  <th className="py-2.5 font-bold">Wallet USD</th>
                  <th className="py-2.5 font-bold">Account Status</th>
                  <th className="py-2.5 font-bold text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                          alt={user.name}
                          className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{user.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email} · {user.phone}</div>
                          {user.address && (
                            <div className="text-[10px] text-slate-400 truncate max-w-xs">
                              {user.address.khan}, {user.address.province}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        user.role === 'admin'
                          ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                          : user.role === 'vendor'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          user.kycStatus === 'verified'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : user.kycStatus === 'pending'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}>
                          {user.kycStatus}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{user.kycTier?.split(' ')[0]}</span>
                      </div>
                    </td>

                    <td className="py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      ${user.walletBalanceUsd.toFixed(2)}
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        user.accountStatus === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}>
                        {user.accountStatus}
                      </span>
                    </td>

                    <td className="py-3.5 text-right space-x-1.5">
                      {user.kycStatus !== 'verified' && (
                        <button
                          onClick={() => updateUserKyc(user.id, 'verified', 'Tier 2 ($50,000)')}
                          className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10px] transition-colors"
                        >
                          Approve KYC
                        </button>
                      )}

                      {user.accountStatus === 'active' ? (
                        <button
                          onClick={() => updateUserStatus(user.id, 'suspended')}
                          className="px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 font-bold text-[10px] transition-colors"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUserStatus(user.id, 'active')}
                          className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 font-bold text-[10px] transition-colors"
                        >
                          Reactivate
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: VENDOR AUDIT & KYB LICENSING                     */}
      {/* ======================================================== */}
      {activeTab === 'vendors' && (
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-500" />
                <span>Merchant Oversight, KYB & Commission Rates</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Manage commercial licenses, Ministry of Commerce patents, and tailor commission take-rates per vendor.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-400">
              {vendors.length} Registered Merchants
            </span>
          </div>

          <div className="space-y-4">
            {vendors.map(vendor => (
              <div 
                key={vendor.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">{vendor.name}</span>
                      {vendor.verified ? (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>KYB Verified</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                          Pending Audit
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Patent: {vendor.patentTaxNumber} · MOC: {vendor.mocLicenseNumber}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Take Rate</div>
                    <div className="text-sm font-black text-purple-600 font-mono">
                      {vendor.commissionRatePercent || 3.5}%
                    </div>
                  </div>

                  <button
                    onClick={() => setEditingVendor(vendor)}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-500" />
                    <span>Edit Store</span>
                  </button>

                  <button
                    onClick={() => toggleVendorVerification(vendor.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                      vendor.verified
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 border border-amber-200 dark:border-amber-800'
                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
                    }`}
                  >
                    {vendor.verified ? 'Revoke License' : 'Approve License'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: METAL SPOT RATE ENGINE                           */}
      {/* ======================================================== */}
      {activeTab === 'spot_rates' && (
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Coins className="w-5 h-5 text-amber-500" />
              <span>Real-Time Precious Metals Spot Rate Engine</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Override or update live spot prices per gram, chi, and ounce across all listings and vault calculations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Gold 24K */}
            <div className="p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-amber-700 dark:text-amber-300">
                  Gold 24K (99.99% Purity)
                </span>
                <span className="text-xs font-mono font-bold text-amber-600">
                  ≈ ${(goldRate * 3.75).toFixed(2)}/Chi
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Spot Price Per Gram ($ USD)
                </label>
                <input
                  type="number"
                  step="0.05"
                  value={goldRate}
                  onChange={e => setGoldRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={() => updateMetalSpotPrice('gold', goldRate)}
                className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Broadcast Gold Spot Rate
              </button>
            </div>

            {/* Silver 999 */}
            <div className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-800 dark:text-slate-200">
                  Silver 999 Fine
                </span>
                <span className="text-xs font-mono font-bold text-slate-500">
                  ≈ ${(silverRate * 31.1035).toFixed(2)}/oz
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Spot Price Per Gram ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={silverRate}
                  onChange={e => setSilverRate(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white"
                />
              </div>

              <button
                onClick={() => updateMetalSpotPrice('silver', silverRate)}
                className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                Broadcast Silver Spot Rate
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Edit Shop Modal for Admin */}
      {editingVendor && (
        <EditShopModal
          vendor={editingVendor}
          isOpen={!!editingVendor}
          onClose={() => setEditingVendor(null)}
        />
      )}

    </div>
  );
};
