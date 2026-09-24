import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SnlLogo } from './SnlLogo';
import { 
  X, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Copy, 
  Download,
  ArrowRight
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose }) => {
  const { 
    activePaymentModalOrder, 
    setActivePaymentModalOrder, 
    confirmPaymentForOrder, 
    formatPrice, 
    addToast,
    t 
  } = useApp();

  const [timeLeft, setTimeLeft] = useState(180);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(180);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !activePaymentModalOrder) return null;

  const order = activePaymentModalOrder;
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleSimulateScan = () => {
    setIsProcessing(true);
    setTimeout(() => {
      confirmPaymentForOrder(order.id);
      setIsProcessing(false);
    }, 900);
  };

  const copyOrderRef = () => {
    navigator.clipboard.writeText(order.orderNumber);
    addToast('Order reference copied!', 'info');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div 
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-[#161922] w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-8"
      >
        {/* Modal Top Bar */}
        <div className="p-4 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SnlLogo size={24} />
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
              {t.khqrModalTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-center">
          
          {/* Official NBC Bakong KHQR Container */}
          <div className="mx-auto w-64 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 bg-white">
            {/* Red Bakong Header Banner */}
            <div className="bg-[#E1251B] text-white p-2.5 flex items-center justify-between px-3">
              <span className="font-black tracking-widest text-xs">KHQR</span>
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">NBC BAKONG</span>
            </div>

            {/* Merchant Info */}
            <div className="p-3 bg-slate-50 border-b border-slate-100 text-left">
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Merchant Name</div>
              <div className="text-xs font-bold text-slate-900 truncate">SNL RICH ECO LTD.</div>
            </div>

            {/* QR Graphic */}
            <div className="p-4 bg-white flex flex-col items-center justify-center relative">
              <div className="w-48 h-48 bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-center shadow-inner relative">
                <QrCode className="w-40 h-40 text-slate-900" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-md border border-slate-200 flex items-center justify-center">
                    <SnlLogo size={28} />
                  </div>
                </div>
              </div>
            </div>

            {/* Amount Bar */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs px-4">
              <span className="text-slate-500 font-medium">Pay Exact:</span>
              <span className="font-mono font-black text-slate-900 text-sm">
                ${order.totalUsd.toFixed(2)} USD
              </span>
            </div>
          </div>

          {/* Amount and Timer */}
          <div className="space-y-1">
            <div className="text-lg font-black text-slate-900 dark:text-white font-mono">
              {order.totalKhr.toLocaleString()} ៛ KHR
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>
                QR expires in: <span className="font-mono font-bold text-amber-500">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
              </span>
            </div>
          </div>

          {/* Supported Local Banks */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 space-y-1">
            <p className="font-medium text-slate-700 dark:text-slate-300">
              {t.scanWithAnyApp}
            </p>
            <p className="text-[10px] text-slate-400">
              Supported: ABA Mobile · Wing Bank · ACLEDA ToanChet · Canadia Bank · Sathapana
            </p>
          </div>

          {/* Reference copy */}
          <div className="flex items-center justify-between p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl text-xs font-mono text-slate-600 dark:text-slate-400">
            <span>Ref: {order.orderNumber}</span>
            <button onClick={copyOrderRef} className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Simulator */}
          <button
            onClick={handleSimulateScan}
            disabled={isProcessing}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <span>Verifying National Bank Settlement...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.simulatePaymentScan}</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
};
