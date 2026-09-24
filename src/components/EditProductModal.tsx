import React, { useState, useEffect } from 'react';
import { ListingItem, MetalType, OfferingType } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Save, 
  Upload, 
  Package, 
  Sparkles, 
  Briefcase, 
  Trash2, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface EditProductModalProps {
  item: ListingItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_IMAGES = [
  { label: '24K Cast Gold Bar', url: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80' },
  { label: 'Fine Silver Ingot', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cambodian Silk Krama', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Solar & Agri Sensors', url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80' },
  { label: 'High-Tech Hardware', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { label: 'Handcrafted Jewelry', url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80' },
  { label: 'Legal & Tech Consulting', url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80' }
];

export const EditProductModal: React.FC<EditProductModalProps> = ({ item, isOpen, onClose }) => {
  const { updateListing, deleteListing } = useApp();

  const [title, setTitle] = useState('');
  const [titleKm, setTitleKm] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceUsd, setPriceUsd] = useState<number>(0);
  const [originalPriceUsd, setOriginalPriceUsd] = useState<number | undefined>(undefined);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [sku, setSku] = useState('');

  // Metal specific
  const [metalType, setMetalType] = useState<MetalType>('gold');
  const [purity, setPurity] = useState('');
  const [metalWeightGrams, setMetalWeightGrams] = useState<number>(0);
  const [metalWeightChi, setMetalWeightChi] = useState<number>(0);
  const [assayCertified, setAssayCertified] = useState(true);

  // Service specific
  const [serviceDuration, setServiceDuration] = useState('');

  // Confirm delete state
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setTitleKm(item.titleKm || '');
      setSubtitle(item.subtitle || '');
      setDescription(item.description || '');
      setPriceUsd(item.priceUsd || 0);
      setOriginalPriceUsd(item.originalPriceUsd);
      setCategory(item.category || '');
      setImage(item.image || '');
      setInventoryCount(item.inventoryCount !== undefined ? item.inventoryCount : 20);
      setSku(item.sku || `SKU-${Math.floor(10000 + Math.random() * 90000)}`);

      setMetalType(item.metalType || 'gold');
      setPurity(item.purity || '99.99% (24K Gold)');
      setMetalWeightGrams(item.metalWeightGrams || 37.5);
      setMetalWeightChi(item.metalWeightChi || 10);
      setAssayCertified(item.assayCertified ?? true);

      setServiceDuration(item.serviceDuration || '3-5 Business Days');
      setShowConfirmDelete(false);
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateListing(item.id, {
      title,
      titleKm: titleKm || title,
      subtitle,
      description,
      priceUsd,
      originalPriceUsd: originalPriceUsd || undefined,
      category,
      image,
      inventoryCount: item.type === 'service' ? undefined : inventoryCount,
      sku,
      ...(item.type === 'metal' && {
        metalType,
        purity,
        metalWeightGrams,
        metalWeightChi,
        assayCertified
      }),
      ...(item.type === 'service' && {
        serviceDuration
      })
    });

    onClose();
  };

  const handleDelete = () => {
    deleteListing(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#151922] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl text-white ${
              item.type === 'metal' ? 'bg-amber-500 text-slate-950' : item.type === 'service' ? 'bg-blue-600' : 'bg-emerald-600'
            }`}>
              {item.type === 'metal' ? <Sparkles className="w-4 h-4" /> : item.type === 'service' ? <Briefcase className="w-4 h-4" /> : <Package className="w-4 h-4" />}
            </span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Edit {item.type === 'metal' ? 'Bullion / Metal' : item.type === 'service' ? 'Service Offering' : 'Product'}
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                ID: {item.id} · SKU: {sku}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto text-xs flex-1">
          
          {/* Main Title & Khmer Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Item Title (English) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Item Title (Khmer ខ្មែរ)
              </label>
              <input
                type="text"
                value={titleKm}
                onChange={e => setTitleKm(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Subtitle / Highlight Note
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={e => setSubtitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          {/* Price, Original Price, Stock, Category */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Selling Price ($) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={priceUsd}
                onChange={e => setPriceUsd(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Original Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Optional"
                value={originalPriceUsd || ''}
                onChange={e => setOriginalPriceUsd(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
              />
            </div>

            {item.type !== 'service' && (
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                  Inventory Stock Units *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={inventoryCount}
                  onChange={e => setInventoryCount(parseInt(e.target.value) || 0)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-emerald-600 dark:text-emerald-400"
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
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* SKU */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Store SKU / Batch Serial
            </label>
            <input
              type="text"
              value={sku}
              onChange={e => setSku(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
            />
          </div>

          {/* Metal specific section */}
          {item.type === 'metal' && (
            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-black">
                <Sparkles className="w-4 h-4" />
                <span>Precious Metal Certification & Weight Units</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Metal Type</label>
                  <select
                    value={metalType}
                    onChange={e => setMetalType(e.target.value as MetalType)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold"
                  >
                    <option value="gold">Gold (មាស)</option>
                    <option value="silver">Silver (ប្រាក់)</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">Purity Grade</label>
                  <input
                    type="text"
                    value={purity}
                    onChange={e => setPurity(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
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
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Service specific section */}
          {item.type === 'service' && (
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 space-y-3">
              <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-black">
                <Briefcase className="w-4 h-4" />
                <span>Service Execution & Duration</span>
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Expected Delivery Duration</label>
                <input
                  type="text"
                  value={serviceDuration}
                  onChange={e => setServiceDuration(e.target.value)}
                  placeholder="e.g., 3-5 Business Days"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>
            </div>
          )}

          {/* Image Management */}
          <div className="space-y-2.5">
            <label className="block text-slate-700 dark:text-slate-300 font-bold">
              Product Image
            </label>
            
            <div className="flex items-start gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shrink-0 relative">
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <input
                  type="text"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="Or paste public image URL..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-mono"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="pt-2">
              <div className="text-[10px] text-slate-400 font-semibold mb-1">Cambodian Product Image Presets:</div>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImage(preset.url)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-medium transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
              Detailed Description & Specifications
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
            />
          </div>

          {/* Delete confirmation section */}
          {showConfirmDelete ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>Permanently remove this item from your store catalog?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmDelete(true)}
                className="text-rose-600 dark:text-rose-400 hover:text-rose-700 font-bold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Product</span>
              </button>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
