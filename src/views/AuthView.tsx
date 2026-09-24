import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SnlLogo } from '../components/SnlLogo';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Store, 
  Sparkles, 
  Truck, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { UserRole } from '../types';

export const AuthView: React.FC = () => {
  const { login, loginAsDemo, register, language, t } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Sign In State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('customer');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter your email address');
      return;
    }
    setErrorMsg('');
    login(email, password);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim()) {
      setErrorMsg('Please fill in required fields');
      return;
    }
    setErrorMsg('');
    register({
      name: signupName.trim(),
      email: signupEmail.trim(),
      phone: signupPhone.trim() || '+855 12 000 000',
      role: signupRole
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-br from-amber-500/10 via-blue-600/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand & Value Proposition (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <SnlLogo size={48} />
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                <span>SNL RICH</span>
                <span className="text-emerald-400 font-extrabold">Eco</span>
              </div>
              <div className="text-[10px] tracking-wider uppercase text-amber-400 font-bold">
                Kingdom of Cambodia
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {language === 'km' ? 'ផ្សារពាណិជ្ជកម្មពហុអាជីវករ & មាសសុទ្ធ' : 'Multi-Vendor Trade & Bullion Custody'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t.authSubtitle}
            </p>
          </div>

          {/* Core Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white">NBC Bakong KHQR Settlement:</strong> Instant universal clearing across ABA, Wing, ACLEDA and all local banks.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white">Precious Metals & Services:</strong> 24K certified gold bullion (Chi/Damloeng), agritech, and specialized consulting.
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs text-slate-300">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-white">Armored & Courier Logistics:</strong> Real-time parcel GPS milestones with 25-province dispatch.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Auth Card (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-950/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          
          {/* Sign In / Sign Up Tabs */}
          <div className="flex rounded-2xl bg-slate-900 p-1 border border-slate-800 text-xs font-bold">
            <button
              onClick={() => { setTab('signin'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                tab === 'signin'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.signIn}
            </button>

            <button
              onClick={() => { setTab('signup'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                tab === 'signup'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.signUp}
            </button>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {tab === 'signin' ? (
            <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="E.g. admin@snlrich.eco or your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-400 font-semibold">{t.password}</label>
                  <span className="text-[10px] text-slate-500">Any password works for demo</span>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>{t.signIn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* SIGN UP FORM */
            <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.name} *</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={e => setSignupName(e.target.value)}
                    placeholder="E.g. Sophath San"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.email} *</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="user@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">{t.phone}</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={signupPhone}
                      onChange={e => setSignupPhone(e.target.value)}
                      placeholder="+855 12 889 912"
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Account Purpose Selector */}
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.accountType}</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignupRole('customer')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      signupRole === 'customer'
                        ? 'border-blue-500 bg-blue-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <User className="w-3.5 h-3.5 text-blue-400" />
                      <span>Customer</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Shop goods, services & metals</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignupRole('vendor')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      signupRole === 'vendor'
                        ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                      <Store className="w-3.5 h-3.5 text-amber-400" />
                      <span>Merchant</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Sell products, services & bullion</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">{t.password}</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    placeholder="Create a secure password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all text-xs flex items-center justify-center gap-2"
              >
                <span>{t.signUp}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* 1-CLICK INSTANT DEMO LOGINS */}
          <div className="pt-4 border-t border-slate-800/80 space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{t.demoAccountsTitle}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">1-Click Switch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              
              {/* Admin Button */}
              <button
                type="button"
                onClick={() => loginAsDemo('admin')}
                className="p-3 rounded-2xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-800/50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-purple-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  admin@snlrich.eco
                </div>
                <div className="text-[9px] text-purple-400/80 mt-0.5">
                  Governance & KYB
                </div>
              </button>

              {/* Vendor Button */}
              <button
                type="button"
                onClick={() => loginAsDemo('vendor')}
                className="p-3 rounded-2xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Store className="w-3.5 h-3.5" />
                  <span>Merchant</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  Angkor Bullion
                </div>
                <div className="text-[9px] text-amber-400/80 mt-0.5">
                  Listings & Orders
                </div>
              </button>

              {/* Customer Button */}
              <button
                type="button"
                onClick={() => loginAsDemo('customer')}
                className="p-3 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 font-bold text-blue-300">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                  Sophath San
                </div>
                <div className="text-[9px] text-blue-400/80 mt-0.5">
                  Shop & Bakong
                </div>
              </button>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
