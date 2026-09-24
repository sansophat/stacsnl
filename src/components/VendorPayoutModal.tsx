import React, { useState } from 'react';
import { Vendor } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Building2, 
  DollarSign, 
  ArrowUpRight, 
  CheckCircle2, 
  ShieldCheck, 
  Wallet,
  Coins
} from 'lucide-react';

interface VendorPayoutModalProps {
  vendor: Vendor;
  availableBalanceUsd: number;
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_BANKS = [
  { id: 'aba', name: 'ABA Bank', icon: '🏦', speed: 'Instant via PayWay / KHQR' },
  { id: 'acleda', name: 'ACLEDA Bank Plc', icon: '🏛️', speed: 'Same Day Settlement' },
  { id: 'wing', name: 'Wing Bank', icon: '⚡', speed: 'Instant 24/7' },
  { id: 'bakong', name: 'NBC Bakong KHQR', icon: '🇰🇭', speed: 'Zero-Fee National Switch' }
];

export const VendorPayoutModal: React.FC<VendorPayoutModalProps> = ({ 
  vendor, 
  availableBalanceUsd, 
  isOpen, 
  onClose 
}) => {
  const { requestVendorPayout, platformSettings, formatPrice } = useApp();

  const [selectedBank, setSelectedBank] = useState(vendor.bankAccount.bankName || 'ABA Bank');
  const [accountNumber, setAccountNumber] = useState(vendor.bankAccount.accountNumber || '');
  const [accountHolder, setAccountHolder] = useState(vendor.bankAccount.accountHolder || vendor.name);
  const [bakongId, setBakongId] = useState(vendor.bankAccount.bakongAccountId || '');
  const [amountUsd, setAmountUsd] = useState<number>(Math.min(availableBalanceUsd, 500));
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePercentageSelect = (percent: number) => {
    const calculated = +(availableBalanceUsd * (percent / 100)).toFixed(2);
    setAmountUsd(calculated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountUsd <= 0 || amountUsd > availableBalanceUsd) return;

    setIsSubmitting(true);
    setTimeout(() => {
      requestVendorPayout(vendor.id, amountUsd, {
        bankName: selectedBank,
        accountNumber,
        accountHolder,
        bakongId: bakongId || undefined
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  const amountKhr = Math.round(amountUsd * platformSettings.usdToKhrRate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#151922] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-emerald-600 text-white">
              <Building2 className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Request Merchant Bank Payout
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {vendor.name}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Available Balance Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-700 dark:text-emerald-300 uppercase font-bold tracking-wider">
                Available Merchant Net Earnings
              </div>
              <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300 font-mono">
                ${availableBalanceUsd.toFixed(2)}
              </div>
              <div className="text-[10px] text-emerald-600/80 font-mono">
                ≈ {(availableBalanceUsd * platformSettings.usdToKhrRate).toLocaleString()} KHR
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-slate-700 dark:text-slate-300 font-bold">
              Payout Withdrawal Amount ($ USD) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold">
                $
              </div>
              <input
                type="number"
                step="0.01"
                min="10"
                max={availableBalanceUsd}
                required
                value={amountUsd || ''}
                onChange={e => setAmountUsd(parseFloat(e.target.value) || 0)}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-base font-mono font-black text-slate-900 dark:text-white"
              />
            </div>

            {/* Quick Percentage Pills */}
            <div className="flex items-center gap-2 pt-1">
              {[25, 50, 75, 100].map(pct => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handlePercentageSelect(pct)}
                  className="flex-1 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-[10px] transition-colors"
                >
                  {pct === 100 ? 'Max (100%)' : `${pct}%`}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 pt-0.5">
              Settlement in Khmer Riel: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{amountKhr.toLocaleString()} KHR</span>
            </div>
          </div>

          {/* Bank Selection */}
          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold">
              Destination Commercial Bank / Network *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {LOCAL_BANKS.map(b => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBank(b.name)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedBank === b.name
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-700 dark:text-blue-300 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                  </div>
                  <div className="text-[10px] opacity-75 mt-0.5">{b.speed}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Account Number *
              </label>
              <input
                type="text"
                required
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-600 dark:text-slate-400 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                required
                value={accountHolder}
                onChange={e => setAccountHolder(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold uppercase text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Bakong KHQR Account ID */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 mb-1">
              Bakong KHQR ID (Optional for instant QR settlement)
            </label>
            <input
              type="text"
              value={bakongId}
              onChange={e => setBakongId(e.target.value)}
              placeholder="e.g. angkor_bullion@aba"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-mono text-blue-600 dark:text-blue-400"
            />
          </div>

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
              disabled={isSubmitting || amountUsd <= 0 || amountUsd > availableBalanceUsd}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Confirm & Transfer Payout</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
