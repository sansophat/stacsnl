import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BannerAdv, OfferingType } from '../types';
import { BannerSlideshow } from './BannerSlideshow';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Sliders, 
  Save, 
  X,
  ExternalLink,
  Upload,
  RefreshCw,
  FolderOpen
} from 'lucide-react';

// Preset high-res image options for quick selection
const IMAGE_PRESETS = [
  {
    name: '24K Gold Bullion Bars',
    url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=80',
    category: 'metal'
  },
  {
    name: 'Cambodian Silk & Handcrafts',
    url: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1600&q=80',
    category: 'product'
  },
  {
    name: 'Solar AgriTech Farm',
    url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80',
    category: 'product'
  },
  {
    name: 'FinTech Cyber Security',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    category: 'service'
  },
  {
    name: 'Phnom Penh Armored Logistics',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
    category: 'service'
  },
  {
    name: 'Precious Gemstones & Jewelry',
    url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=80',
    category: 'metal'
  }
];

export const AdminBannerManager: React.FC = () => {
  const { 
    banners, 
    addBanner, 
    updateBanner, 
    deleteBanner, 
    toggleBannerActive, 
    reorderBanners,
    language 
  } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerAdv | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [subtitleKm, setSubtitleKm] = useState('');
  const [badge, setBadge] = useState('');
  const [badgeKm, setBadgeKm] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ctaText, setCtaText] = useState('Shop Now');
  const [ctaTextKm, setCtaTextKm] = useState('ទិញឥឡូវនេះ');
  const [ctaCategory, setCtaCategory] = useState<OfferingType | 'all'>('all');
  const [ctaLinkTab, setCtaLinkTab] = useState('marketplace');
  const [isActive, setIsActive] = useState(true);
  const [order, setOrder] = useState(banners.length + 1);

  // Reset form or open for edit
  const handleOpenAdd = () => {
    setEditingBanner(null);
    setTitle('');
    setTitleKm('');
    setSubtitle('');
    setSubtitleKm('');
    setBadge('⚡ SPECIAL PROMOTION · 0% BAKONG FEE');
    setBadgeKm('⚡ ការផ្តល់ជូនពិសេស · ឥតគិតថ្លៃសេវា');
    setImageUrl(IMAGE_PRESETS[0].url);
    setCtaText('Explore Collection');
    setCtaTextKm('ស្វែងយល់ការប្រមូល');
    setCtaCategory('all');
    setCtaLinkTab('marketplace');
    setIsActive(true);
    setOrder(banners.length + 1);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (banner: BannerAdv) => {
    setEditingBanner(banner);
    setTitle(banner.title);
    setTitleKm(banner.titleKm || '');
    setSubtitle(banner.subtitle);
    setSubtitleKm(banner.subtitleKm || '');
    setBadge(banner.badge || '');
    setBadgeKm(banner.badgeKm || '');
    setImageUrl(banner.imageUrl);
    setCtaText(banner.ctaText);
    setCtaTextKm(banner.ctaTextKm || '');
    setCtaCategory(banner.ctaCategory || 'all');
    setCtaLinkTab(banner.ctaLinkTab || 'marketplace');
    setIsActive(banner.isActive);
    setOrder(banner.order);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    if (editingBanner) {
      updateBanner(editingBanner.id, {
        title,
        titleKm,
        subtitle,
        subtitleKm,
        badge,
        badgeKm,
        imageUrl,
        ctaText,
        ctaTextKm,
        ctaCategory,
        ctaLinkTab,
        isActive,
        order
      });
    } else {
      addBanner({
        title,
        titleKm,
        subtitle,
        subtitleKm,
        badge,
        badgeKm,
        imageUrl,
        ctaText,
        ctaTextKm,
        ctaCategory,
        ctaLinkTab,
        isActive,
        order
      });
    }

    setIsModalOpen(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    const temp = sorted[index];
    sorted[index] = sorted[index - 1];
    sorted[index - 1] = temp;
    reorderBanners(sorted.map(b => b.id));
  };

  const handleMoveDown = (index: number) => {
    const sorted = [...banners].sort((a, b) => a.order - b.order);
    if (index >= sorted.length - 1) return;
    const temp = sorted[index];
    sorted[index] = sorted[index + 1];
    sorted[index + 1] = temp;
    reorderBanners(sorted.map(b => b.id));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sortedBanners = [...banners].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header Card */}
      <div className="p-6 bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Homepage Advertising Banner Slideshow Manager
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Control the high-impact promotional carousel on the guest and customer homepage. Create new advertising slides with custom images, bilingual text (English & Khmer), badges, and direct category jump links.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner Slide</span>
          </button>
        </div>
      </div>

      {/* Real-time Interactive Preview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Eye className="w-4 h-4 text-purple-500" />
            <span>Live Slideshow Preview (As seen by Visitors & Guests)</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {banners.filter(b => b.isActive).length} active of {banners.length} total slides
          </span>
        </div>

        <div className="rounded-3xl border border-purple-500/30 ring-4 ring-purple-500/10 overflow-hidden shadow-xl">
          <BannerSlideshow />
        </div>
      </div>

      {/* Banners List / Management Table */}
      <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Configured Slides ({banners.length})</span>
          </h3>
          <span className="text-xs text-slate-400">
            Use arrows to re-order the carousel sequence
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {sortedBanners.map((banner, index) => (
            <div 
              key={banner.id}
              className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                !banner.isActive ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/30' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-center gap-4 min-w-0">
                
                {/* Order Index */}
                <div className="flex flex-col items-center justify-center w-8 shrink-0">
                  <span className="text-xs font-black font-mono text-purple-600 dark:text-purple-400">
                    #{index + 1}
                  </span>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-purple-600 disabled:opacity-20 transition-colors"
                      title="Move slide up"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === sortedBanners.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-purple-600 disabled:opacity-20 transition-colors"
                      title="Move slide down"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative w-28 h-16 sm:w-36 sm:h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-700/60 shrink-0">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <span className="absolute bottom-1 left-1.5 text-[9px] font-mono text-white/90 truncate max-w-[90%] font-bold">
                    {banner.ctaCategory ? banner.ctaCategory.toUpperCase() : 'ALL'}
                  </span>
                </div>

                {/* Text Info */}
                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-900 dark:text-white truncate max-w-md">
                      {banner.title}
                    </span>
                    {banner.badge && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-[10px] font-bold">
                        {banner.badge}
                      </span>
                    )}
                  </div>
                  {banner.titleKm && (
                    <div className="text-[11px] text-slate-400 truncate max-w-md font-medium">
                      ខ្មែរ: {banner.titleKm}
                    </div>
                  )}
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-lg">
                    {banner.subtitle}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-0.5">
                    <span>CTA Button: <strong className="text-slate-700 dark:text-slate-300 font-bold">"{banner.ctaText}"</strong></span>
                    <span>·</span>
                    <span>Target: <strong className="text-purple-600 dark:text-purple-400 font-mono">{banner.ctaCategory || 'all'}</strong></span>
                  </div>
                </div>

              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
                
                {/* Active Toggle */}
                <button
                  onClick={() => toggleBannerActive(banner.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    banner.isActive
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {banner.isActive ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Live Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Disabled</span>
                    </>
                  )}
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEdit(banner)}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                  title="Edit slide content"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    if (window.confirm(`Delete banner "${banner.title}"?`)) {
                      deleteBanner(banner.id);
                    }
                  }}
                  className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 transition-colors"
                  title="Delete banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* ADD / EDIT BANNER MODAL                                  */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base sm:text-lg font-black text-white">
                  {editingBanner ? 'Edit Promotional Banner Slide' : 'Create New Promotional Banner Slide'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
              
              {/* Title (EN & KM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Banner Title (English) *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Royal 24K Khmer Bullion"
                    required
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ចំណងជើង (ភាសាខ្មែរ)
                  </label>
                  <input
                    type="text"
                    value={titleKm}
                    onChange={e => setTitleKm(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ មាសសុទ្ធ ២៤ ការ៉ាត់ អង្គរ រ៉ូយ៉ាល់"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Subtitle / Description (EN & KM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Description / Subtitle (English)
                  </label>
                  <textarea
                    rows={2}
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder="Short promotional highlight describing the offer..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ការពិពណ៌នាសង្ខេប (ភាសាខ្មែរ)
                  </label>
                  <textarea
                    rows={2}
                    value={subtitleKm}
                    onChange={e => setSubtitleKm(e.target.value)}
                    placeholder="ការបញ្ជាក់លម្អិតអំពីការបញ្ចុះតម្លៃ ឬទំនិញ..."
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Badge Tag (EN & KM) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Promotional Tag Badge (EN)
                  </label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    placeholder="e.g. 🏆 NBC BAKONG APPROVED · 99.99% GOLD"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ផ្លាកសញ្ញាបញ្ជាក់ (ភាសាខ្មែរ)
                  </label>
                  <input
                    type="text"
                    value={badgeKm}
                    onChange={e => setBadgeKm(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ 🏆 ទូទាត់តាមបាគងឥតគិតថ្លៃ"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Background Image URL & Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Background Image URL *
                  </label>
                  <label className="text-[11px] text-purple-600 hover:text-purple-500 font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                />

                {/* Preset Chips */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono">Quick Preset Images:</span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {IMAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(p.url);
                          if (!editingBanner && p.category) setCtaCategory(p.category as any);
                        }}
                        className={`relative rounded-lg overflow-hidden border aspect-video transition-all ${
                          imageUrl === p.url ? 'ring-2 ring-purple-500 border-purple-500' : 'border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/70 text-[8px] text-white p-0.5 truncate text-center">
                          {p.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Button Text (English)
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={e => setCtaText(e.target.value)}
                    placeholder="e.g. Shop Now"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    អក្សរលើប៊ូតុង (ខ្មែរ)
                  </label>
                  <input
                    type="text"
                    value={ctaTextKm}
                    onChange={e => setCtaTextKm(e.target.value)}
                    placeholder="ឧទាហរណ៍៖ ទិញឥឡូវនេះ"
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Filter Category
                  </label>
                  <select
                    value={ctaCategory}
                    onChange={e => setCtaCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  >
                    <option value="all">All Offerings</option>
                    <option value="metal">24K Bullion Metals</option>
                    <option value="product">Physical Merchandise</option>
                    <option value="service">Professional Services</option>
                  </select>
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Display Priority Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={order}
                    onChange={e => setOrder(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={e => setIsActive(e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                    />
                    <span>Active in Slideshow</span>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingBanner ? 'Save Changes' : 'Create Banner'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
