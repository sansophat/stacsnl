import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Wallet, 
  QrCode, 
  Truck, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  ChevronRight
} from 'lucide-react';
import { LocalPaymentMethod } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { 
    cart, 
    cartTotalUsd, 
    cartSubtotalUsd, 
    cartDeliveryFeeUsd, 
    formatPrice, 
    currentUser, 
    walletBalanceUsd, 
    createOrder,
    setIsCartOpen,
    t 
  } = useApp();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [shippingAddress, setShippingAddress] = useState('#88, Preah Monivong Blvd, Sangkat BKK1');
  const [shippingCity, setShippingCity] = useState('Phnom Penh');
  const [paymentMethod, setPaymentMethod] = useState<LocalPaymentMethod>('khqr');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const hasMetal = cart.some(ci => ci.item.type === 'metal');
  const hasService = cart.some(ci => ci.item.type === 'service');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order = createOrder({
        customerName,
        customerPhone,
        customerEmail,
        shippingAddress,
        shippingCity,
        paymentMethod,
        notes,
      });

      setIsSubmitting(false);
      if (order) {
        onClose();
        setIsCartOpen(false);
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#161922] w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t.checkoutTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
          
          {/* Section 1: Customer & Delivery Info */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>{t.deliveryAddress}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">{t.fullName} *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">{t.phoneNumber} *</label>
                <input
                  type="text"
                  required
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-600 dark:text-slate-400 mb-1">{t.streetAddress} *</label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={e => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">{t.cityProvince} *</label>
                <select
                  value={shippingCity}
                  onChange={e => setShippingCity(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="Phnom Penh">Phnom Penh (ភ្នំពេញ)</option>
                  <option value="Siem Reap">Siem Reap (សៀមរាប)</option>
                  <option value="Battambang">Battambang (បាត់ដំបង)</option>
                  <option value="Sihanoukville">Sihanoukville (ព្រះសីហនុ)</option>
                  <option value="Kampot">Kampot (កំពត)</option>
                  <option value="Takeo">Takeo (តាកែវ)</option>
                  <option value="Kandal">Kandal (កណ្តាល)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">{t.notes}</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="E.g. Call before arrival, leave at security desk"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Section 2: Payment Gateways */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <span>{t.paymentMethodTitle}</span>
            </h4>

            <div className="space-y-2">
              
              {/* Option 1: In-App Wallet */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'wallet' 
                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Wallet className="w-4 h-4 text-emerald-500" />
                      <span>{t.payWithWallet}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Balance: <span className="font-mono font-bold text-emerald-600">${walletBalanceUsd.toFixed(2)}</span> ({(Math.round(walletBalanceUsd * 4100)).toLocaleString()} ៛)
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Instant
                </span>
              </label>

              {/* Option 2: Bakong KHQR */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'khqr' 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="khqr"
                    checked={paymentMethod === 'khqr'}
                    onChange={() => setPaymentMethod('khqr')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-rose-500" />
                      <span>{t.payWithKhqr}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      National Bank of Cambodia Universal QR Standard
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">
                  KHQR Official
                </span>
              </label>

              {/* Option 3: ABA PAY */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'aba' 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="aba"
                    checked={paymentMethod === 'aba'}
                    onChange={() => setPaymentMethod('aba')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t.payWithAba}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ABA Mobile App direct payment & deep link
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                  ABA Direct
                </span>
              </label>

              {/* Option 4: Wing Bank */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'wing' 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wing"
                    checked={paymentMethod === 'wing'}
                    onChange={() => setPaymentMethod('wing')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t.payWithWing}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      WingPay QR and agent cash settlement
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-lime-100 dark:bg-lime-950 text-lime-700 dark:text-lime-300">
                  WingPay
                </span>
              </label>

              {/* Option 5: ACLEDA ToanChet */}
              <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                paymentMethod === 'acleda' 
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30' 
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="acleda"
                    checked={paymentMethod === 'acleda'}
                    onChange={() => setPaymentMethod('acleda')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {t.payWithAcleda}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      ACLEDA ToanChet mobile QR and account transfer
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  ACLEDA
                </span>
              </label>

            </div>
          </div>

          {/* Section 3: Summary & Submit */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
            <div className="flex justify-between text-slate-500">
              <span>Items Total ({cart.length} items):</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">{formatPrice(cartSubtotalUsd)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Delivery Logistics ({hasMetal ? 'Armored Vault' : 'Standard'}):</span>
              <span className="font-mono text-slate-900 dark:text-white">
                {cartDeliveryFeeUsd === 0 ? 'FREE' : formatPrice(cartDeliveryFeeUsd)}
              </span>
            </div>
            <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Final Settlement Total:</span>
              <div className="text-right">
                <div className="font-mono text-base text-blue-600 dark:text-blue-400">{formatPrice(cartTotalUsd)}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  ≈ {(Math.round(cartTotalUsd * 4100)).toLocaleString()} ៛ KHR
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span>Preparing Local Bank Settlement Voucher...</span>
            ) : (
              <span>{t.payNowButton}</span>
            )}
            <ChevronRight className="w-4 h-4" />
          </button>

        </form>
      </div>
    </div>
  );
};
