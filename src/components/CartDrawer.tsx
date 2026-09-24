import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  Lock, 
  ArrowRight, 
  ShoppingBag,
  Package,
  Briefcase,
  Sparkles
} from 'lucide-react';
import { CheckoutModal } from './CheckoutModal';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotalUsd, 
    cartDeliveryFeeUsd, 
    cartTotalUsd, 
    formatPrice,
    t 
  } = useApp();

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  if (!isCartOpen) return null;

  const hasMetal = cart.some(ci => ci.item.type === 'metal');

  const handleProceedToCheckout = () => {
    setCheckoutModalOpen(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={() => setIsCartOpen(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white dark:bg-[#161922] shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
            
            {/* Drawer Header */}
            <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {t.cartTitle}
                </h3>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {cart.length}
                </span>
              </div>

              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {t.emptyCart}
                  </p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Browse physical products, book professional services, or acquire physical gold & silver bullion.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(ci => (
                    <div
                      key={ci.item.id}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex gap-3 items-center"
                    >
                      <img
                        src={ci.item.image}
                        alt={ci.item.title}
                        className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-slate-800 shrink-0"
                      />

                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {ci.item.type === 'metal' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase">
                              Metal
                            </span>
                          )}
                          {ci.item.type === 'service' && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase">
                              Service
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 truncate">{ci.item.vendorName}</span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {ci.item.title}
                        </h4>

                        <div className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {formatPrice(ci.item.priceUsd)}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => updateCartQuantity(ci.item.id, ci.quantity - 1)}
                              className="w-6 h-6 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs w-5 text-center font-bold">{ci.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(ci.item.id, ci.quantity + 1)}
                              className="w-6 h-6 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(ci.item.id)}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Special Armored Transport Notification if Metal */}
                  {hasMetal && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Precious Metals Armored Logistics</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Contains investment-grade bullion. Dispatched via licensed armored vehicle with biometric custody receipt.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>{t.subtotal}</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(cartSubtotalUsd)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>{t.deliveryFee}</span>
                    </span>
                    <span className="font-mono text-slate-900 dark:text-white">
                      {cartDeliveryFeeUsd === 0 ? t.freeDelivery : formatPrice(cartDeliveryFeeUsd)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>{t.total}</span>
                    <span className="font-mono text-base text-blue-600 dark:text-blue-400">{formatPrice(cartTotalUsd)}</span>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{t.proceedCheckout}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
      />
    </>
  );
};
