import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  Camera, 
  Upload, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CreditCard, 
  Lock, 
  Save, 
  CheckCircle2, 
  Sparkles,
  RefreshCw,
  Trash2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '../types';

export const CAMBODIA_PROVINCES = [
  'Phnom Penh (រាជធានីភ្នំពេញ)',
  'Siem Reap (ខេត្តសៀមរាប)',
  'Battambang (ខេត្តបាត់ដំបង)',
  'Preah Sihanouk (ខេត្តព្រះសីហនុ)',
  'Kampot (ខេត្តកំពត)',
  'Kandal (ខេត្តកណ្តាល)',
  'Kampong Cham (ខេត្តកំពង់ចាម)',
  'Kampong Speu (ខេត្តកំពង់ស្ពឺ)',
  'Kampong Chhnang (ខេត្តកំពង់ឆ្នាំង)',
  'Kampong Thom (ខេត្តកំពង់ធំ)',
  'Banteay Meanchey (ខេត្តបន្ទាយមានជ័យ)',
  'Koh Kong (ខេត្តកោះកុង)',
  'Kep (ខេត្តកែប)',
  'Pailin (ខេត្តប៉ៃលិន)',
  'Preah Vihear (ខេត្តព្រះវិហារ)',
  'Pursat (ខេត្តពោធិ៍សាត់)',
  'Prey Veng (ខេត្តព្រៃវែង)',
  'Ratanakiri (ខេត្តរតនគិរី)',
  'Mondulkiri (ខេត្តមណ្ឌលគិរី)',
  'Stung Treng (ខេត្តស្ទឹងត្រែង)',
  'Svay Rieng (ខេត្តស្វាយរៀង)',
  'Takeo (ខេត្តតាកែវ)',
  'Oddar Meanchey (ខេត្តឧត្តរមានជ័យ)',
  'Tboung Khmum (ខេត្តត្បូងឃ្មុំ)',
  'Kratie (ខេត្តក្រចេះ)'
];

export const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80'
];

export const ProfileSettingsView: React.FC = () => {
  const { currentUser, updateUserProfile, setActiveTab, t } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatarUrl || PRESET_AVATARS[0]);
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>(currentUser?.gender || 'male');
  const [dob, setDob] = useState(currentUser?.dob || '1995-04-12');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [companyName, setCompanyName] = useState(currentUser?.companyName || '');
  const [taxId, setTaxId] = useState(currentUser?.taxIdentificationNumber || '');

  // Address states
  const [street, setStreet] = useState(currentUser?.address?.street || '#42, Street 214');
  const [sangkat, setSangkat] = useState(currentUser?.address?.sangkat || 'Boeung Reang');
  const [khan, setKhan] = useState(currentUser?.address?.khan || 'Daun Penh');
  const [province, setProvince] = useState(currentUser?.address?.province || 'Phnom Penh');
  const [postalCode, setPostalCode] = useState(currentUser?.address?.postalCode || '120204');

  // Bank states
  const [bankName, setBankName] = useState<'ABA' | 'Wing' | 'ACLEDA' | 'Canadia' | 'Sathapana'>(
    (currentUser?.bankAccount?.bankName as any) || 'ABA'
  );
  const [accountNumber, setAccountNumber] = useState(currentUser?.bankAccount?.accountNumber || '000 882 192');
  const [accountHolder, setAccountHolder] = useState(currentUser?.bankAccount?.accountHolder || currentUser?.name.toUpperCase() || 'SOPHATH SAN');
  const [bakongAccountId, setBakongAccountId] = useState(currentUser?.bankAccount?.bakongAccountId || 'sophath_san@aba');

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState(currentUser?.emergencyContact?.name || 'Sophea San');
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser?.emergencyContact?.phone || '+855 12 998 877');
  const [emergencyRelation, setEmergencyRelation] = useState(currentUser?.emergencyContact?.relationship || 'Sister');

  // Security
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(currentUser?.twoFactorEnabled ?? true);
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateUserProfile({
      name,
      email,
      phone,
      avatarUrl,
      gender,
      dob,
      bio,
      companyName: currentUser?.role === 'vendor' ? companyName : undefined,
      taxIdentificationNumber: currentUser?.role === 'vendor' ? taxId : undefined,
      address: {
        street,
        sangkat,
        khan,
        province,
        postalCode
      },
      bankAccount: {
        bankName,
        accountNumber,
        accountHolder: accountHolder.toUpperCase(),
        bakongAccountId
      },
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relationship: emergencyRelation
      },
      twoFactorEnabled
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-blue-800/60 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>SNL RICH Eco · Member Profile & Security</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            My Profile & Account Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Manage your personal credentials, profile photo, Cambodian delivery addresses, and NBC Bakong bank accounts.
          </p>
        </div>

        {/* Quick Role & KYC Badge */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-blue-200">Account Role</div>
          <div className="text-lg font-black text-white uppercase mt-0.5">
            {currentUser?.role}
          </div>
          <div className="text-xs text-amber-300 font-mono mt-1 font-semibold">
            {currentUser?.kycTier || 'Tier 1'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. PROFILE PHOTO & AVATAR SECTION */}
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-500" />
              <span>Profile Image & Avatar</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload a profile picture from your device or select from verified system avatars.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            
            {/* Current Avatar Preview */}
            <div className="relative group">
              <img
                src={avatarUrl}
                alt="Profile Avatar"
                className="w-28 h-28 rounded-3xl object-cover border-4 border-slate-100 dark:border-slate-800 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload Photo"
                className="absolute -bottom-2 -right-2 p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-transform group-hover:scale-110"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>

            {/* Hidden native file input for actual photo upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Action Buttons & Preset Avatars */}
            <div className="space-y-3 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors flex items-center gap-2 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image from Computer / Phone</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPresetPicker(prev => !prev)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Choose Preset Avatar</span>
                </button>
              </div>

              {/* Preset Avatar Gallery */}
              {showPresetPicker && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 overflow-x-auto">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(url);
                        setShowPresetPicker(false);
                      }}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        avatarUrl === url ? 'border-blue-600 scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-12 h-12 object-cover" />
                      {avatarUrl === url && (
                        <div className="absolute inset-0 bg-blue-600/30 flex items-center justify-center text-white">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              <p className="text-[11px] text-slate-400">
                Accepts JPG, PNG, GIF, WebP. Recommended square aspect ratio 1:1, up to 10MB.
              </p>
            </div>

          </div>
        </div>

        {/* 2. PERSONAL CREDENTIALS & IDENTITY */}
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-purple-500" />
              <span>Personal Credentials & Contact</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Legal contact identity for invoice generation, courier delivery handovers, and compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Phone Number (Cambodia) *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+855 12 889 912"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Gender & Date of Birth
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                >
                  <option value="male">Male (ប្រុស)</option>
                  <option value="female">Female (ស្រី)</option>
                  <option value="other">Other</option>
                </select>

                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Vendor / Entity Fields */}
            {currentUser?.role === 'vendor' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Registered Company / Store Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="E.g. Angkor Royal Bullion Co., Ltd."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tax Identification / Patent Number
                  </label>
                  <input
                    type="text"
                    value={taxId}
                    onChange={e => setTaxId(e.target.value)}
                    placeholder="E.g. K002-901882194"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Bio / Profile Description
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="A short description of yourself, trading profile, or business focus..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

          </div>
        </div>

        {/* 3. CAMBODIA DELIVERY & LOGISTICS ADDRESS */}
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              <span>Official Delivery Address (Cambodia 25 Provinces)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Default shipping address for armored bullion handovers and courier parcel delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Street Address, House No. & Building *
              </label>
              <input
                type="text"
                required
                value={street}
                onChange={e => setStreet(e.target.value)}
                placeholder="E.g. #42, Street 214 (Samdech Pan), Borey Peng Huoth"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Sangkat (Commune) *
              </label>
              <input
                type="text"
                required
                value={sangkat}
                onChange={e => setSangkat(e.target.value)}
                placeholder="E.g. Boeung Reang / Tonle Bassac"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Khan (District) *
              </label>
              <input
                type="text"
                required
                value={khan}
                onChange={e => setKhan(e.target.value)}
                placeholder="E.g. Daun Penh / Chamkar Mon"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Province / Capital City *
              </label>
              <select
                value={province}
                onChange={e => setProvince(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                {CAMBODIA_PROVINCES.map((prov, i) => (
                  <option key={i} value={prov.split(' ')[0]}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Postal Code
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={e => setPostalCode(e.target.value)}
                placeholder="120204"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

          </div>
        </div>

        {/* 4. NBC BAKONG & LOCAL BANKING CONFIGURATION */}
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500" />
              <span>National Bank of Cambodia & Bakong Settlement Account</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Used for instant zero-fee withdrawals, payouts, and automated KHQR QR receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Commercial Bank
              </label>
              <select
                value={bankName}
                onChange={e => setBankName(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              >
                <option value="ABA">ABA Bank (Advanced Bank of Asia)</option>
                <option value="Wing">Wing Bank Specialized</option>
                <option value="ACLEDA">ACLEDA Bank Plc</option>
                <option value="Canadia">Canadia Bank Plc</option>
                <option value="Sathapana">Sathapana Bank Plc</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="E.g. 000 882 192"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Holder Name (English Upper Case) *
              </label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={e => setAccountHolder(e.target.value.toUpperCase())}
                placeholder="SOPHATH SAN"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Universal NBC Bakong Account ID *
              </label>
              <input
                type="text"
                required
                value={bakongAccountId}
                onChange={e => setBakongAccountId(e.target.value)}
                placeholder="sophath_san@aba"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

          </div>
        </div>

        {/* 5. EMERGENCY CONTACT & SECURITY */}
        <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-500" />
              <span>Emergency Contact & Two-Factor Security</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              High-value bullion depository access verification and multi-factor security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                placeholder="E.g. Sophea San"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Emergency Phone Number
              </label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                placeholder="+855 12 998 877"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Relationship
              </label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={e => setEmergencyRelation(e.target.value)}
                placeholder="Sister / Spouse / Business Partner"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* 2FA Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Two-Factor Authentication (2FA)</span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  Recommended
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Enforce SMS/Authenticator OTP code before authorizing physical bullion releases.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTwoFactorEnabled(prev => !prev)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                twoFactorEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                twoFactorEnabled ? 'translate-x-6' : 'translate-x-0'
              }`} />
            </button>
          </div>

        </div>

        {/* SUBMIT BUTTON */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Profile updates are encrypted and synchronized instantly across your account.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Address Details</span>
          </button>
        </div>

      </form>

    </div>
  );
};
