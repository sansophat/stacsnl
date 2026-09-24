import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Vendor, ListingItem } from '../types';
import { 
  ShieldCheck, 
  Store, 
  MapPin, 
  Star, 
  Sparkles, 
  Briefcase, 
  Package,
  Building2,
  ExternalLink,
  ChevronRight,
  Edit3,
  Clock,
  Phone,
  Mail,
  Globe,
  Truck
} from 'lucide-react';
import { EditShopModal } from '../components/EditShopModal';

interface VendorsViewProps {
  onViewItem: (item: ListingItem) => void;
}

export const VendorsView: React.FC<VendorsViewProps> = ({ onViewItem }) => {
  const { currentUser, vendors, listings, language, t } = useApp();
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [isEditShopOpen, setIsEditShopOpen] = useState(false);

  const selectedVendor = vendors.find(v => v.id === selectedVendorId) || null;
  const vendorItems = selectedVendor 
    ? listings.filter(item => item.vendorId === selectedVendor.id)
    : [];

  const canEdit = selectedVendor && (
    (currentUser?.role === 'vendor' && (currentUser.vendorId === selectedVendor.id || currentUser.id === selectedVendor.id)) ||
    currentUser?.role === 'admin'
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          {t.navVendors}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Accredited Cambodian merchant partners, bullion vaults, and certified service cooperatives
        </p>
      </div>

      {/* Selected Vendor Storefront View */}
      {selectedVendor ? (
        <div className="space-y-6">
          {/* Back Button */}
          <button
            onClick={() => setSelectedVendorId(null)}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            ← Back to All Merchants
          </button>

          {/* Storefront Hero */}
          <div className="rounded-3xl overflow-hidden bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-md">
            <div className="h-44 sm:h-52 w-full bg-slate-900 relative">
              <img
                src={selectedVendor.coverImage}
                alt={selectedVendor.name}
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
              
              {canEdit && (
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => setIsEditShopOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md text-white font-bold text-xs border border-white/20 shadow-md flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Edit Shop & Images</span>
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 relative -mt-12 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 min-w-0">
                <img
                  src={selectedVendor.logo}
                  alt={selectedVendor.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white dark:border-[#161922] shadow-md bg-white shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                      {language === 'km' && selectedVendor.nameKm ? selectedVendor.nameKm : selectedVendor.name}
                    </h2>
                    {selectedVendor.verified && (
                      <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400" title="Verified Merchant">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl font-medium">
                    {language === 'km' && selectedVendor.taglineKm ? selectedVendor.taglineKm : selectedVendor.tagline}
                  </p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-500" />
                      <span>{selectedVendor.location}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-300">{selectedVendor.rating.toFixed(2)}</span>
                    </span>
                    {selectedVendor.operatingHours && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{selectedVendor.operatingHours}</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Settlement Bank & Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0 w-full sm:w-auto">
                {canEdit && (
                  <button
                    onClick={() => setIsEditShopOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-500/30 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Shop Info</span>
                  </button>
                )}

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Settlement Account</div>
                  <div className="font-mono font-bold text-slate-900 dark:text-white">
                    {selectedVendor.bankAccount.bankName} · {selectedVendor.bankAccount.accountNumber}
                  </div>
                  {selectedVendor.bankAccount.bakongAccountId && (
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                      KHQR: {selectedVendor.bankAccount.bakongAccountId}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Contact Details */}
            {(selectedVendor.description || selectedVendor.phone || selectedVendor.address) && (
              <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">About This Merchant</h4>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {language === 'km' && selectedVendor.descriptionKm ? selectedVendor.descriptionKm : (selectedVendor.description || selectedVendor.tagline)}
                  </p>
                  {selectedVendor.deliveryPromise && (
                    <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-900/30 flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                      <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                      <span><strong>Dispatch Promise:</strong> {selectedVendor.deliveryPromise}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 text-xs">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Direct Contacts</h4>
                  {selectedVendor.phone && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">{selectedVendor.phone}</span>
                    </div>
                  )}
                  {selectedVendor.email && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono truncate">{selectedVendor.email}</span>
                    </div>
                  )}
                  {selectedVendor.website && (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{selectedVendor.website}</span>
                    </div>
                  )}
                  {selectedVendor.address && (
                    <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{selectedVendor.address}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Vendor Catalog Items */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Catalog from this Merchant ({vendorItems.length} items)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {vendorItems.map(item => (
                <ProductCard
                  key={item.id}
                  item={item}
                  onViewDetails={onViewItem}
                />
              ))}
            </div>
          </div>

          {/* Modal if open */}
          {canEdit && (
            <EditShopModal
              vendor={selectedVendor}
              isOpen={isEditShopOpen}
              onClose={() => setIsEditShopOpen(false)}
            />
          )}
        </div>
      ) : (
        /* Vendors List Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.map(vendor => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendorId(vendor.id)}
              className="group bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500/40 transition-all cursor-pointer space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={vendor.logo}
                    alt={vendor.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                        {language === 'km' ? vendor.nameKm : vendor.name}
                      </h3>
                      {vendor.verified && (
                        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{vendor.location.split(',')[0]}</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{vendor.rating.toFixed(2)}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {language === 'km' ? vendor.taglineKm : vendor.tagline}
              </p>

              {/* Categories supported badges */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                <div className="flex items-center gap-1.5">
                  {vendor.categories.map(c => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 capitalize"
                    >
                      {c === 'metal' ? 'Precious Metals' : c === 'service' ? 'Services' : 'Products'}
                    </span>
                  ))}
                </div>

                <span className="text-[11px] text-slate-400 font-mono font-semibold">
                  {vendor.totalSales} orders completed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
