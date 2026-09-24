import React, { useState } from 'react';
import { ListingItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Package, 
  Briefcase, 
  Lock, 
  Truck, 
  Star,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ProductDetailModalProps {
  item: ListingItem | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ item, onClose }) => {
  const { formatPrice, addToCart, language, t, setIsCartOpen } = useApp();
  const [qty, setQty] = useState(1);
  const [selectedDelivery, setSelectedDelivery] = useState<'standard_courier' | 'armored_vault_delivery'>('standard_courier');

  if (!item) return null;

  const isMetal = item.type === 'metal';
  const isService = item.type === 'service';
  const isProduct = item.type === 'product';

  const handleAddToCart = () => {
    addToCart(item, qty, selectedDelivery);
    onClose();
  };

  const handleBuyNow = () => {
    addToCart(item, qty, selectedDelivery);
    onClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#161922] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {isMetal && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Precious Metal</span>
              </span>
            )}
            {isService && (
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Professional Service</span>
              </span>
            )}
            {isProduct && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase flex items-center gap-1">
                <Package className="w-3.5 h-3.5" />
                <span>Physical Product</span>
              </span>
            )}
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500">{language === 'km' ? item.categoryKm : item.category}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left: Image & Trust Marks */}
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {isMetal && (
                  <div className="absolute bottom-3 left-3 right-3 p-2 bg-slate-950/85 backdrop-blur-md rounded-xl text-[11px] text-amber-200 border border-amber-500/30 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>{item.purity}</span>
                    </span>
                    <span className="font-mono font-bold">Assay Card #SNL-{item.id.slice(-4).toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* Vendor Card */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Merchant Partner</div>
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
                    <span>{language === 'km' ? item.vendorNameKm : item.vendorName}</span>
                    {item.vendorVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                  </div>
                  <div className="text-slate-500 text-[11px]">{item.vendorLocation}</div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end font-bold text-slate-900 dark:text-white">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Verified Seller</span>
                </div>
              </div>
            </div>

            {/* Right: Title, Specs & Price */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white leading-snug">
                  {language === 'km' ? item.titleKm : item.title}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {language === 'km' ? item.subtitleKm : item.subtitle}
                </p>
              </div>

              {/* Price Tag */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                <div className="text-xs text-slate-400">Price Settlement</div>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {formatPrice(item.priceUsd)}
                </div>
                {item.originalPriceUsd && (
                  <div className="text-xs text-slate-400 line-through font-mono">
                    Original: {formatPrice(item.originalPriceUsd)}
                  </div>
                )}
              </div>

              {/* Metal Detailed Specifications */}
              {isMetal && (
                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    Metal Metallurgy & Custody
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="text-[10px] text-slate-400">Certified Purity</div>
                      <div className="font-bold text-amber-600 dark:text-amber-300 font-mono">{item.purity}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <div className="text-[10px] text-slate-400">Weight (Grams)</div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">{item.metalWeightGrams} grams</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <div className="text-[10px] text-slate-400">Weight (Cambodian Chi)</div>
                      <div className="font-bold text-slate-900 dark:text-white font-mono">
                        {item.metalWeightChi ? `${item.metalWeightChi} Chi` : 'N/A'}
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <div className="text-[10px] text-slate-400">Assay Card</div>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Service Specifications */}
              {isService && (
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs space-y-1">
                  <div className="font-semibold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Service Turnaround: {item.serviceDuration}</span>
                  </div>
                  <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
                    Includes dedicated account manager, milestone deliverables, and formal escrow handover.
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <h4 className="font-bold text-slate-900 dark:text-white">Overview</h4>
                <p className="leading-relaxed">
                  {language === 'km' ? item.descriptionKm : item.description}
                </p>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold text-sm w-6 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-end gap-3">
          <button
            onClick={handleAddToCart}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            {t.addToCart}
          </button>

          <button
            onClick={handleBuyNow}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              isMetal
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isMetal ? 'Acquire Metal & Proceed' : isService ? 'Book Service Now' : 'Buy Now'}
          </button>
        </div>

      </div>
    </div>
  );
};
