import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Upload, 
  User, 
  CreditCard, 
  Building2, 
  Lock, 
  Sparkles,
  ArrowRight,
  Camera
} from 'lucide-react';
import { KycDocument } from '../types';

export const KycView: React.FC = () => {
  const { currentUser, submitKycVerification, updateUserKyc, language, t } = useApp();

  const [idType, setIdType] = useState<'national_id' | 'passport' | 'business_license'>('national_id');
  const [idNumber, setIdNumber] = useState(currentUser?.kycDoc?.idNumber || '010 889 201 99');
  const [fullName, setFullName] = useState(currentUser?.name || 'Sophath San');
  const [dob, setDob] = useState(currentUser?.kycDoc?.dob || '1995-04-12');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const kycStatus = currentUser?.kycStatus || 'unverified';
  const kycTier = currentUser?.kycTier || 'Tier 1 ($1,000)';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const doc: KycDocument = {
      idType,
      idNumber,
      fullName,
      dob,
      frontDocUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
      backDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      selfieUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      submittedAt: new Date().toLocaleDateString()
    };

    setTimeout(() => {
      submitKycVerification(doc);
      setIsSubmitting(false);
    }, 600);
  };

  // Instant simulator for quick testing
  const handleInstantApprove = () => {
    if (!currentUser) return;
    updateUserKyc(currentUser.id, 'verified', 'Tier 2 ($50,000)');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-blue-800/60 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-300 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Kingdom of Cambodia Compliance Standard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            KYC Identity & Bullion Custody Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            National Bank of Cambodia & Ministry of Commerce Anti-Money Laundering (AML) verified tiered limits.
          </p>
        </div>

        {/* Current Tier Badge */}
        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center shrink-0">
          <div className="text-[10px] uppercase font-bold text-blue-200">Current Status</div>
          <div className="text-lg font-black text-white mt-0.5 capitalize">
            {kycStatus}
          </div>
          <div className="text-xs text-amber-300 font-mono mt-1 font-semibold">
            {kycTier}
          </div>
        </div>
      </div>

      {/* Tier Limit Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1 */}
        <div className={`p-5 rounded-2xl border transition-all ${
          kycTier.includes('Tier 1')
            ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-500 shadow-sm'
            : 'bg-white dark:bg-[#121622] border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tier 1: Starter</span>
            {kycTier.includes('Tier 1') && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500 text-white">Active</span>
            )}
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            $1,000 <span className="text-xs font-normal text-slate-400">/ day</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Automated verification via SMS OTP and valid phone number. Standard products & services.
          </p>
        </div>

        {/* Tier 2 */}
        <div className={`p-5 rounded-2xl border transition-all ${
          kycTier.includes('Tier 2')
            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
            : 'bg-white dark:bg-[#121622] border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Tier 2: Standard</span>
            {kycTier.includes('Tier 2') && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white">Active</span>
            )}
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            $50,000 <span className="text-xs font-normal text-slate-400">/ day</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            National ID / Passport verified. Full access to 24K Gold Bullion (Chi & Damloeng) and armored transport.
          </p>
        </div>

        {/* Tier 3 */}
        <div className={`p-5 rounded-2xl border transition-all ${
          kycTier.includes('Tier 3')
            ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500 shadow-sm'
            : 'bg-white dark:bg-[#121622] border-slate-200 dark:border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">Tier 3: Institutional</span>
            {kycTier.includes('Tier 3') && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500 text-white">Active</span>
            )}
          </div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-2 font-mono">
            Unlimited <span className="text-xs font-normal text-slate-400">Trading</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Commercial enterprise entity, patent tax certificate, bulk bullion import/export license.
          </p>
        </div>

      </div>

      {/* Verification Submission Form */}
      <div className="bg-white dark:bg-[#121622] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800/80 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white">
              Identity Verification Submission
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your government-issued identification document to unlock Tier 2 ($50,000/day limit).
            </p>
          </div>

          {/* Quick Demo Simulator Button */}
          <button
            type="button"
            onClick={handleInstantApprove}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Demo Verify</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Document Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Identification Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setIdType('national_id')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  idType === 'national_id'
                    ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <CreditCard className="w-4 h-4 text-blue-500 mb-1" />
                <div className="font-bold text-xs">Cambodian National ID</div>
                <div className="text-[10px] text-slate-400">អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ</div>
              </button>

              <button
                type="button"
                onClick={() => setIdType('passport')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  idType === 'passport'
                    ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <User className="w-4 h-4 text-blue-500 mb-1" />
                <div className="font-bold text-xs">International Passport</div>
                <div className="text-[10px] text-slate-400">លិខិតឆ្លងដែនអន្តរជាតិ</div>
              </button>

              <button
                type="button"
                onClick={() => setIdType('business_license')}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  idType === 'business_license'
                    ? 'border-blue-600 bg-blue-500/10 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <Building2 className="w-4 h-4 text-blue-500 mb-1" />
                <div className="font-bold text-xs">MOC Business License</div>
                <div className="text-[10px] text-slate-400">វិញ្ញាបនបត្រចុះបញ្ជីពាណិជ្ជកម្ម</div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name (As on Document) *
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Document Number *
              </label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                placeholder="E.g. 010 889 201 99"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={e => setDob(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              />
            </div>
          </div>

          {/* Document Upload Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-blue-500/50 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Front Document Photo</div>
              <div className="text-[10px] text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</div>
              <div className="mt-3 inline-block px-2.5 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">
                Uploaded (Front.jpg)
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-blue-500/50 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Back Document Photo</div>
              <div className="text-[10px] text-slate-400 mt-1">PNG, JPG, PDF up to 10MB</div>
              <div className="mt-3 inline-block px-2.5 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400">
                Uploaded (Back.jpg)
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-center hover:border-blue-500/50 transition-colors bg-slate-50/50 dark:bg-slate-900/30">
              <Camera className="w-6 h-6 text-slate-400 mx-auto mb-2" />
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Biometric Live Selfie</div>
              <div className="text-[10px] text-slate-400 mt-1">Face matching AI verification</div>
              <div className="mt-3 inline-block px-2.5 py-1 bg-white dark:bg-slate-800 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 text-emerald-600 dark:text-emerald-400">
                Verified (Selfie.jpg)
              </div>
            </div>

          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>256-bit encrypted data vault in compliance with Cambodia Data Privacy regulations.</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Uploading & Encrypting...' : 'Submit Verification Request'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
