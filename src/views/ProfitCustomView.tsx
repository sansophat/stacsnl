import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  TrendingUp, 
  Coins, 
  Percent, 
  DollarSign, 
  Building2, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Save, 
  Calculator,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

export const ProfitCustomView: React.FC = () => {
  const { 
    currentUser, 
    profitSettings, 
    updateProfitSettings, 
    formatPrice,
    platformSettings,
    language 
  } = useApp();

  const role = currentUser?.role || 'customer';

  // Local form state
  const [bullionApy, setBullionApy] = useState(profitSettings.bullionVaultYieldApy);
  const [cashbackPercent, setCashbackPercent] = useState(profitSettings.cashbackRewardPercent);
  const [referralPercent, setReferralPercent] = useState(profitSettings.referralCommissionPercent);
  const [autoReinvest, setAutoReinvest] = useState(profitSettings.autoReinvestDividends);

  const [vendorMargin, setVendorMargin] = useState(profitSettings.vendorTargetProfitMarginPercent);
  const [goldMarkup, setGoldMarkup] = useState(profitSettings.goldSpotMarkupPercent);
  const [silverMarkup, setSilverMarkup] = useState(profitSettings.silverSpotMarkupPercent);
  const [instantPayoutThreshold, setInstantPayoutThreshold] = useState(profitSettings.instantPayoutThresholdUsd);

  // Profit Simulator Calculator state
  const [simHoldingsUsd, setSimHoldingsUsd] = useState(5000);
  const [simSalesVolumeUsd, setSimSalesVolumeUsd] = useState(15000);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfitSettings({
      bullionVaultYieldApy: bullionApy,
      cashbackRewardPercent: cashbackPercent,
      referralCommissionPercent: referralPercent,
      autoReinvestDividends: autoReinvest,
      vendorTargetProfitMarginPercent: vendorMargin,
      goldSpotMarkupPercent: goldMarkup,
      silverSpotMarkupPercent: silverMarkup,
      instantPayoutThresholdUsd: instantPayoutThreshold
    });
  };

  // Calculations for simulator
  const simAnnualYield = +(simHoldingsUsd * (bullionApy / 100)).toFixed(2);
  const simMonthlyYield = +(simAnnualYield / 12).toFixed(2);
  const simVendorProfit = +(simSalesVolumeUsd * (vendorMargin / 100)).toFixed(2);
  const simCashbackReturn = +(simHoldingsUsd * (cashbackPercent / 100)).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-900/90 via-slate-900 to-amber-950 p-6 sm:p-8 rounded-3xl border border-amber-800/60 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Coins className="w-4 h-4" />
            <span>Yield & Custom Margins Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            Profit Custom & Yield Configuration
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Configure dynamic earnings, bullion staking yields, cashback percentages, and merchant margin spreads.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center shrink-0">
          <div className="text-[10px] text-amber-300 uppercase font-bold">Staking Yield Benchmark</div>
          <div className="text-2xl font-black text-white font-mono mt-0.5">
            {bullionApy}% APY
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold mt-1">
            Zero Liquidity Lockup
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Settings (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
              <Sliders className="w-4 h-4 text-blue-500" />
              <span>Earnings & Margin Parameters</span>
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              Role: {role.toUpperCase()}
            </span>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* 1. Bullion Staking Yield */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-500" />
                  <span>Gold Bullion Vault Yield (APY %)</span>
                </label>
                <span className="text-blue-600 dark:text-blue-400 font-mono text-sm">{bullionApy}%</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={bullionApy}
                onChange={e => setBullionApy(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <p className="text-[11px] text-slate-400">
                Annual compound yield paid on physical 24K gold bars stored in authorized depository vaults.
              </p>
            </div>

            {/* 2. Bakong KHQR Cashback */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Bakong KHQR Cashback Return (%)</span>
                </label>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono text-sm">{cashbackPercent}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="5.0"
                step="0.1"
                value={cashbackPercent}
                onChange={e => setCashbackPercent(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-[11px] text-slate-400">
                Direct cashback credited back to your SNL Local Wallet for every checkout.
              </p>
            </div>

            {/* 3. Referral Commission Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <label className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-500" />
                  <span>Referral & Affiliate Commission (%)</span>
                </label>
                <span className="text-purple-600 dark:text-purple-400 font-mono text-sm">{referralPercent}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6.0"
                step="0.5"
                value={referralPercent}
                onChange={e => setReferralPercent(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
            </div>

            {/* Vendor Specific Controls (Available to all for testing or merchants) */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Merchant Profit Margin Controls
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-600 dark:text-amber-400">
                  Vendor Mode
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Target Gross Margin (%)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    value={vendorMargin}
                    onChange={e => setVendorMargin(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    24K Gold Spot Markup (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    step="0.1"
                    value={goldMarkup}
                    onChange={e => setGoldMarkup(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Auto Reinvest Toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Auto-Compound Gold Dividends
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Automatically buy fractional 24K gold grams with accrued staking yields.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoReinvest(prev => !prev)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  autoReinvest ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoReinvest ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Profit Settings</span>
            </button>

          </form>
        </div>

        {/* Right Column: Profit Simulator & Projection (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-gradient-to-br from-slate-900 via-[#101726] to-slate-950 rounded-3xl p-6 border border-slate-800 text-white space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Calculator className="w-4 h-4 text-emerald-400" />
                <span>Yield Simulator Calculator</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-md bg-emerald-500/20">
                Real-Time Preview
              </span>
            </div>

            {/* Input 1: Holdings */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Sample Bullion Holdings:</span>
                <span className="font-mono font-bold text-white">${simHoldingsUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={simHoldingsUsd}
                onChange={e => setSimHoldingsUsd(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Output Cards */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Annual Staking Dividend</div>
                  <div className="text-lg font-black text-emerald-400 font-mono">
                    +${simAnnualYield} USD
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  ≈ {(simAnnualYield * platformSettings.usdToKhrRate).toLocaleString()} KHR
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Monthly Compounded Payout</div>
                  <div className="text-base font-black text-amber-400 font-mono">
                    +${simMonthlyYield} USD / month
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  {bullionApy}% APY
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Estimated Cashback Rewards</div>
                  <div className="text-base font-black text-blue-400 font-mono">
                    +${simCashbackReturn} USD
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-400 font-mono">
                  {cashbackPercent}% Rate
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-3 leading-relaxed">
              * Yields are audited by the National Bank of Cambodia liquidity node and distributed directly to the SNL Local Bank Wallet.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
