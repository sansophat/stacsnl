import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Vendor, OfferingType } from '../types';
import { 
  X, 
  Store, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Truck, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Eye,
  Edit3,
  Coins,
  Package,
  Briefcase
} from 'lucide-react';

interface EditShopModalProps {
  vendor: Vendor;
  isOpen: boolean;
  onClose: () => void;
}

// Preset cover images suitable for Cambodian commerce & bullion
const PRESET_COVERS = [
  {
    name: 'Royal Bullion Vault',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Solar Tech & Engineering',
    url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Handwoven Khmer Silk',
    url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Cyber & FinTech Innovation',
    url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Phnom Penh Commercial Center',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80'
  },
  {
    name: 'Luxury Gold & Jewelry',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80'
  }
];

// Preset logos
const PRESET_LOGOS = [
  {
    name: 'Golden Crest',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Eco Green',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Heritage Silk',
    url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Cyber Shield',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80'
  },
  {
    name: 'Modern Tech Monogram',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80'
  }
];

export const EditShopModal: React.FC<EditShopModalProps> = ({ vendor, isOpen, onClose }) => {
  const { updateVendorProfile, language, t } = useApp();

  // Active view tab: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form states initialized with vendor data
  const [name, setName] = useState(vendor.name || '');
  const [nameKm, setNameKm] = useState(vendor.nameKm || '');
  const [tagline, setTagline] = useState(vendor.tagline || '');
  const [taglineKm, setTaglineKm] = useState(vendor.taglineKm || '');
  const [description, setDescription] = useState(vendor.description || '');
  const [descriptionKm, setDescriptionKm] = useState(vendor.descriptionKm || '');
  const [logo, setLogo] = useState(vendor.logo || '');
  const [coverImage, setCoverImage] = useState(vendor.coverImage || '');
  const [location, setLocation] = useState(vendor.location || '');
  const [address, setAddress] = useState(vendor.address || '');
  const [phone, setPhone] = useState(vendor.phone || '');
  const [email, setEmail] = useState(vendor.email || '');
  const [website, setWebsite] = useState(vendor.website || '');
  const [operatingHours, setOperatingHours] = useState(vendor.operatingHours || 'Mon - Sat: 8:00 AM - 5:30 PM');
  const [deliveryPromise, setDeliveryPromise] = useState(vendor.deliveryPromise || 'Express delivery across Cambodia');
  
  // Compliance & Banking
  const [mocLicenseNumber, setMocLicenseNumber] = useState(vendor.mocLicenseNumber || '');
  const [patentTaxNumber, setPatentTaxNumber] = useState(vendor.patentTaxNumber || '');
  const [bankName, setBankName] = useState(vendor.bankAccount?.bankName || 'ABA Bank');
  const [accountNumber, setAccountNumber] = useState(vendor.bankAccount?.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(vendor.bankAccount?.accountHolder || '');
  const [bakongAccountId, setBakongAccountId] = useState(vendor.bankAccount?.bakongAccountId || '');

  // Categories
  const [categories, setCategories] = useState<OfferingType[]>(vendor.categories || ['product']);

  // Direct file upload handlers
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image file size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCoverImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Logo file size should be under 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setLogo(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleCategory = (cat: OfferingType) => {
    setCategories(prev => 
      prev.includes(cat) 
        ? prev.length > 1 ? prev.filter(c => c !== cat) : prev 
        : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateVendorProfile(vendor.id, {
      name: name.trim(),
      nameKm: nameKm.trim() || name.trim(),
      tagline: tagline.trim(),
      taglineKm: taglineKm.trim() || tagline.trim(),
      description: description.trim(),
      descriptionKm: descriptionKm.trim() || description.trim(),
      logo,
      coverImage,
      location: location.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      website: website.trim(),
      operatingHours: operatingHours.trim(),
      deliveryPromise: deliveryPromise.trim(),
      categories,
      mocLicenseNumber: mocLicenseNumber.trim(),
      patentTaxNumber: patentTaxNumber.trim(),
      bankAccount: {
        bankName,
        accountNumber: accountNumber.trim(),
        accountHolder: accountHolder.trim().toUpperCase(),
        bakongAccountId: bakongAccountId.trim().toLowerCase()
      }
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-[#151922] w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Edit Merchant Storefront & Images</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  ID: {vendor.id}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update store logo, hero banner, contacts, location, and official credentials
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Tabs */}
            <div className="hidden sm:flex items-center bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'edit'
                    ? 'bg-white dark:bg-[#151922] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-[#151922] text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Storefront Preview</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        {activeTab === 'preview' ? (
          /* LIVE PREVIEW VIEW */
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-md">
              {/* Cover Banner */}
              <div className="h-48 sm:h-56 w-full bg-slate-900 relative">
                <img
                  src={coverImage || vendor.coverImage}
                  alt={name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-mono border border-white/20">
                    Live Customer Preview
                  </span>
                </div>
              </div>

              {/* Logo & Store Identity */}
              <div className="p-6 relative -mt-14 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                <div className="flex items-end gap-4">
                  <img
                    src={logo || vendor.logo}
                    alt={name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-[#161922] shadow-xl bg-white shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                        {language === 'km' ? (nameKm || name) : name}
                      </h2>
                      {vendor.verified && (
                        <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" title="Verified Merchant">
                          <ShieldCheck className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl font-medium">
                      {language === 'km' ? (taglineKm || tagline) : tagline}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-blue-500" />
                        <span>{location || 'Cambodia'}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{operatingHours}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Back to Editor
                  </button>
                </div>
              </div>

              {/* Description & Details Grid */}
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    About Our Store & Operations
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {language === 'km' ? (descriptionKm || description) : description}
                  </p>

                  {deliveryPromise && (
                    <div className="p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 flex items-center gap-3 text-xs">
                      <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">Delivery Promise: </span>
                        <span className="text-slate-600 dark:text-slate-400">{deliveryPromise}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Store Contacts & Compliance
                  </h3>
                  {phone && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{phone}</span>
                    </div>
                  )}
                  {email && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono truncate">{email}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{website}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{address}</span>
                    </div>
                  )}
                  {bakongAccountId && (
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-[10px] text-slate-400 font-bold uppercase">NBC Bakong Settlement</div>
                      <div className="font-mono text-xs font-bold text-slate-900 dark:text-white">{bakongAccountId}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* FORM EDITOR */
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* SECTION 1: STORE IMAGES (HERO BANNER & LOGO) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-blue-500" />
                  <span>Shop Visual Branding & Images</span>
                </h3>
                <span className="text-[11px] text-slate-400">Supports direct upload or curated presets</span>
              </div>

              {/* Combined Banner + Logo Live Card */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-100 dark:bg-slate-900 relative">
                {/* Banner container */}
                <div className="h-40 sm:h-48 w-full bg-slate-800 relative group overflow-hidden">
                  <img
                    src={coverImage || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80'}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <label className="px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs cursor-pointer shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Upload Banner Image</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleCoverUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Logo container */}
                <div className="p-4 relative flex items-end gap-4 -mt-10 sm:-mt-12 bg-white/90 dark:bg-[#161B26]/90 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50">
                  <div className="relative group shrink-0">
                    <img
                      src={logo || 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=200&q=80'}
                      alt="Logo preview"
                      className="w-20 h-20 rounded-2xl object-cover border-3 border-white dark:border-slate-800 shadow-md bg-white"
                    />
                    <label className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-white text-[10px] font-bold text-center p-1">
                      <Upload className="w-3.5 h-3.5 mb-1" />
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleLogoUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-blue-500" />
                        <span>Change Shop Logo</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleLogoUpload} 
                          className="hidden" 
                        />
                      </label>

                      <label className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Change Cover Banner</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleCoverUpload} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Recommended: 1200×400px for cover banner, 400×400px square for shop logo.
                    </p>
                  </div>
                </div>
              </div>

              {/* Cover Image Presets or Custom URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Cover Banner Preset Themes
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_COVERS.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setCoverImage(preset.url)}
                        className={`group relative rounded-xl overflow-hidden h-14 border transition-all text-left ${
                          coverImage === preset.url
                            ? 'ring-2 ring-blue-500 border-transparent shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-0 bg-black/50 group-hover:bg-black/40 flex items-end p-1 text-[9px] font-bold text-white leading-tight">
                          {preset.name}
                        </span>
                        {coverImage === preset.url && (
                          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Shop Logo Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_LOGOS.map(preset => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => setLogo(preset.url)}
                        className={`relative rounded-xl overflow-hidden w-14 h-14 border transition-all ${
                          logo === preset.url
                            ? 'ring-2 ring-blue-500 border-transparent shadow-xs'
                            : 'border-slate-200 dark:border-slate-700 opacity-75 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        {logo === preset.url && (
                          <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Direct Image URL Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Cover Banner Image URL
                  </label>
                  <input
                    type="url"
                    value={coverImage}
                    onChange={e => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Shop Logo URL
                  </label>
                  <input
                    type="url"
                    value={logo}
                    onChange={e => setLogo(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: SHOP BASIC IDENTITY & LOCALIZATION */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-500" />
                <span>Shop Identity & Bilingual Descriptions</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Shop Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Angkor Royal Bullion & Vault Custody"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Shop Name (Khmer - ឈ្មោះហាង)
                  </label>
                  <input
                    type="text"
                    value={nameKm}
                    onChange={e => setNameKm(e.target.value)}
                    placeholder="ឧ. អង្គរ រ៉ូយ៉ាល់ ដុំមាស និងឃ្លាំងសុវត្ថិភាព"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Tagline / Slogan (English)
                  </label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="e.g. Licensed Physical Precious Metals Dealer in Cambodia"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Tagline (Khmer - ពាក្យស្លោក)
                  </label>
                  <input
                    type="text"
                    value={taglineKm}
                    onChange={e => setTaglineKm(e.target.value)}
                    placeholder="ឧ. ក្រុមហ៊ុនពាណិជ្ជកម្មលោហធាតុមានតម្លៃស្របច្បាប់"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Description / About Us (English)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide details about your products, quality assurance, certifications, physical store operations, etc."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Description (Khmer - ព័ត៌មានលម្អិតអំពីហាង)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionKm}
                    onChange={e => setDescriptionKm(e.target.value)}
                    placeholder="ព័ត៌មានលម្អិតអំពីផលិតផល ការធានាគុណភាព និងការប្រតិបត្តិការ..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Offerings Categories */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Offered Categories
                </label>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleCategory('product')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                      categories.includes('product')
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span>Physical Products</span>
                    {categories.includes('product') && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCategory('metal')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                      categories.includes('metal')
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>24K Bullion & Precious Metals</span>
                    {categories.includes('metal') && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleCategory('service')}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all ${
                      categories.includes('service')
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                        : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Professional Services</span>
                    {categories.includes('service') && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 3: LOCATION & CONTACT DETAILS */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Store Location & Customer Service Contacts</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    City / Province & District
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="e.g. Norodom Blvd, Daun Penh, Phnom Penh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Detailed Physical Address / Building
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="e.g. #88 Preah Norodom Blvd, Sangkat Tonle Bassac"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Phone (+855)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+855 12 778 899"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Store Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="contact@angkorbullion.kh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Official Website / Social Link
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={e => setWebsite(e.target.value)}
                    placeholder="https://angkorbullion.com.kh"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={e => setOperatingHours(e.target.value)}
                    placeholder="e.g. Mon - Sat: 8:00 AM - 5:30 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Delivery / Fulfilment Guarantee
                  </label>
                  <input
                    type="text"
                    value={deliveryPromise}
                    onChange={e => setDeliveryPromise(e.target.value)}
                    placeholder="e.g. Same-day armored courier in Phnom Penh, 24h insured courier to 25 provinces"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-medium outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: SETTLEMENT BANK & COMPLIANCE */}
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-500" />
                <span>Commercial Bank Settlement & NBC Bakong KHQR</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Settlement Bank
                  </label>
                  <select
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ABA Bank">ABA Bank (Advanced Bank of Asia)</option>
                    <option value="Wing Bank">Wing Bank (Specialized Bank)</option>
                    <option value="ACLEDA Bank">ACLEDA Bank Plc</option>
                    <option value="Canadia Bank">Canadia Bank</option>
                    <option value="Sathapana Bank">Sathapana Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={e => setAccountNumber(e.target.value)}
                    placeholder="000 882 192"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Beneficiary Name (Uppercase)
                  </label>
                  <input
                    type="text"
                    value={accountHolder}
                    onChange={e => setAccountHolder(e.target.value.toUpperCase())}
                    placeholder="ANGKOR ROYAL BULLION CO LTD"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono uppercase font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NBC Bakong KHQR Account ID
                  </label>
                  <input
                    type="text"
                    value={bakongAccountId}
                    onChange={e => setBakongAccountId(e.target.value)}
                    placeholder="angkor_bullion@aba"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    MOC Registration License #
                  </label>
                  <input
                    type="text"
                    value={mocLicenseNumber}
                    onChange={e => setMocLicenseNumber(e.target.value)}
                    placeholder="MOC-REG-84729"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    GDT Patent Tax Identification #
                  </label>
                  <input
                    type="text"
                    value={patentTaxNumber}
                    onChange={e => setPatentTaxNumber(e.target.value)}
                    placeholder="TAX-PAT-38291"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-mono outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-4 h-4 text-blue-500" />
                <span>Preview Storefront</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Store Changes</span>
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
