import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  QrCode, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  CreditCard,
  Download,
  Upload
} from 'lucide-react';

export const WalletView: React.FC = () => {
  const { 
    walletBalanceUsd, 
    walletBalanceKhr, 
    walletTransactions, 
    depositToWallet, 
    withdrawFromWallet, 
    currentUser, 
    formatPrice,
    language, 
    t, 
    addToast 
  } = useApp();

  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState<number>(100);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(50);
  const [withdrawBank, setWithdrawBank] = useState<string>('ABA Bank');
  const [withdrawAccount, setWithdrawAccount] = useState<string>('000 882 192');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;
    depositToWallet(depositAmount, 'Bakong KHQR (NBC Gateway)');
    setDepositModalOpen(false);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;
    const success = withdrawFromWallet(withdrawAmount, withdrawBank, withdrawAccount);
    if (success) {
      setWithdrawModalOpen(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Wallet className="w-6 h-6 text-emerald-600" />
          <span>{t.walletTitle}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.walletSubtitle}
        </p>
      </div>

      {/* 1. MAIN WALLET CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Balance Card */}
        <div className="md:col-span-2 rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>NBC Bakong Verified Liquidity Node</span>
              </span>
              <span className="text-xs font-mono text-slate-400">Account: {currentUser?.name}</span>
            </div>

            <div>
              <div className="text-xs text-slate-400">Available Settlement Balance</div>
              <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1">
                ${walletBalanceUsd.toFixed(2)} <span className="text-sm font-normal text-slate-400">USD</span>
              </div>
              <div className="text-sm font-mono text-emerald-400 font-bold mt-0.5">
                ≈ {walletBalanceKhr.toLocaleString()} ៛ KHR
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setDepositModalOpen(true)}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>{t.depositViaKhqr}</span>
              </button>

              <button
                onClick={() => setWithdrawModalOpen(true)}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs rounded-xl backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>{t.withdrawToBank}</span>
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mb-20" />
        </div>

        {/* Local Banking Network Partners Card */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Integrated Local Banks</span>
            </h3>
            <p className="text-xs text-slate-500">Instant interbank clearing via NBC Bakong standard</p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="font-bold text-slate-900 dark:text-white">ABA Bank</div>
              <span className="text-[10px] text-emerald-600 font-bold">KHQR Instant</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="font-bold text-slate-900 dark:text-white">Wing Bank</div>
              <span className="text-[10px] text-emerald-600 font-bold">WingPay + Agent</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="font-bold text-slate-900 dark:text-white">ACLEDA Bank</div>
              <span className="text-[10px] text-emerald-600 font-bold">ToanChet API</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center">
            0% fee on in-ecosystem vendor transactions
          </div>
        </div>

      </div>

      {/* 2. TRANSACTION HISTORY LEDGER */}
      <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
            {t.transactionHistory}
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {walletTransactions.length} recorded entries
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {walletTransactions.map(tx => (
            <div key={tx.id} className="py-3 flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.amountUsd > 0
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {tx.amountUsd > 0 ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>

                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    {tx.description}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{tx.timestamp}</span>
                    <span>·</span>
                    <span className="font-mono">{tx.reference}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className={`font-mono font-bold text-sm ${
                  tx.amountUsd > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                }`}>
                  {tx.amountUsd > 0 ? '+' : ''}${Math.abs(tx.amountUsd).toFixed(2)}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {Math.abs(tx.amountKhr).toLocaleString()} ៛
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DEPOSIT MODAL */}
      {depositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161922] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t.depositViaKhqr}
            </h3>
            <p className="text-xs text-slate-500">
              Enter amount to top-up instantly into your local bank balance:
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">{t.depositAmount}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">$</span>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={depositAmount}
                    onChange={e => setDepositAmount(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-sm"
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 font-mono">
                  ≈ {(Math.round(depositAmount * 4100)).toLocaleString()} ៛ KHR
                </div>
              </div>

              {/* Preset buttons */}
              <div className="flex gap-2">
                {[50, 100, 250, 500].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setDepositAmount(amt)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-mono font-semibold"
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-md"
                >
                  Top Up Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#161922] w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {t.withdrawToBank}
            </h3>
            <p className="text-xs text-slate-500">
              Payout directly to your registered local bank account:
            </p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Destination Bank</label>
                <select
                  value={withdrawBank}
                  onChange={e => setWithdrawBank(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white"
                >
                  <option value="ABA Bank">ABA Bank (Advanced Bank of Asia)</option>
                  <option value="Wing Bank">Wing Bank (Specialized Bank)</option>
                  <option value="ACLEDA Bank">ACLEDA Bank Plc.</option>
                  <option value="Canadia Bank">Canadia Bank Plc.</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Account Number</label>
                <input
                  type="text"
                  required
                  value={withdrawAccount}
                  onChange={e => setWithdrawAccount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Withdrawal Amount (USD)</label>
                <input
                  type="number"
                  min="1"
                  max={walletBalanceUsd}
                  value={withdrawAmount}
                  onChange={e => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                />
                <div className="text-[10px] text-slate-400 mt-1">
                  Max available: ${walletBalanceUsd.toFixed(2)}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setWithdrawModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md"
                >
                  Confirm Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
