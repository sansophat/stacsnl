import React from 'react';
import { ListingItem } from '../types';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  Package, 
  Briefcase, 
  Layers, 
  Star,
  Lock
} from 'lucide-react';

interface ProductCardProps {
  item: ListingItem;
  onViewDetails: (item: ListingItem) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ item, onViewDetails }) => {
  const { formatPrice, addToCart, language, t } = useApp();

  const handleAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1);
  };

  const isMetal = item.type === 'metal';
  const isService = item.type === 'service';
  const isProduct = item.type === 'product';

  return (
    <div 
      onClick={() => onViewDetails(item)}
      className="group relative bg-white dark:bg-[#161922] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/50 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Visual Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Offering Type Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isMetal && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500/90 text-slate-950 font-bold text-[10px] tracking-wider uppercase backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <Sparkles className="w-3 h-3" />
              <span>{item.purity || 'Precious Metal'}</span>
            </span>
          )}
          {isService && (
            <span className="px-2 py-0.5 rounded-md bg-blue-600/90 text-white font-bold text-[10px] tracking-wider uppercase backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <Briefcase className="w-3 h-3" />
              <span>Professional Service</span>
            </span>
          )}
          {isProduct && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-600/90 text-white font-bold text-[10px] tracking-wider uppercase backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <Package className="w-3 h-3" />
              <span>Physical Product</span>
            </span>
          )}
        </div>

        {/* Metal Vault / Assay Guarantee Tag */}
        {isMetal && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] bg-slate-950/80 backdrop-blur-md text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700/60 font-medium">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Assay Verified</span>
            </span>
            <span className="text-amber-300 font-mono font-bold">
              {item.metalWeightDamloeng ? `${item.metalWeightDamloeng} Damloeng` : `${item.metalWeightGrams}g`}
            </span>
          </div>
        )}

        {/* Service Delivery Timeframe Tag */}
        {isService && item.serviceDuration && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 text-[10px] bg-slate-950/80 backdrop-blur-md text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700/60 font-medium">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>Delivery: {item.serviceDuration}</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        {/* Vendor & Category Header */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span className="truncate font-medium flex items-center gap-1">
              <span>{language === 'km' ? item.vendorNameKm : item.vendorName}</span>
              {item.vendorVerified && <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />}
            </span>
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">
              {language === 'km' ? item.categoryKm : item.category}
            </span>
          </div>

          {/* Item Title */}
          <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {language === 'km' ? item.titleKm : item.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {language === 'km' ? item.subtitleKm : item.subtitle}
          </p>
        </div>

        {/* Specific Attributes Strip */}
        {isMetal && (
          <div className="grid grid-cols-2 gap-1.5 p-2 rounded-lg bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 text-[11px]">
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Weight Unit</div>
              <div className="font-bold text-slate-800 dark:text-amber-200 font-mono">
                {item.metalWeightChi ? `${item.metalWeightChi} Chi (${item.metalWeightGrams}g)` : `${item.metalWeightGrams}g`}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Logistics</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                <span>Armored Vault</span>
              </div>
            </div>
          </div>
        )}

        {/* Rating & Stock */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold text-slate-900 dark:text-white">{item.rating.toFixed(1)}</span>
            <span className="text-slate-400">({item.reviewCount})</span>
          </div>

          {isProduct && item.inventoryCount !== undefined && (
            <span className="text-[10px] text-slate-500">
              {item.inventoryCount > 0 ? `${item.inventoryCount} in stock` : 'Out of stock'}
            </span>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {formatPrice(item.priceUsd)}
            </div>
            {item.originalPriceUsd && (
              <div className="text-[11px] text-slate-400 line-through font-mono">
                {formatPrice(item.originalPriceUsd)}
              </div>
            )}
          </div>

          <button
            onClick={handleAction}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-xs shrink-0 ${
              isMetal
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                : isService
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900'
            }`}
          >
            {isMetal ? t.buyMetal : isService ? t.bookService : t.addToCart}
          </button>
        </div>

      </div>
    </div>
  );
};
