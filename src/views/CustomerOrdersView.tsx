import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  Briefcase
} from 'lucide-react';

export const CustomerOrdersView: React.FC = () => {
  const { 
    orders, 
    setActiveTrackingOrder, 
    setActiveTab, 
    formatPrice, 
    language, 
    t 
  } = useApp();

  const handleTrack = (order: typeof orders[0]) => {
    setActiveTrackingOrder(order);
    setActiveTab('tracking');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
          <Package className="w-6 h-6 text-blue-600" />
          <span>{t.navOrders}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review your purchase history, booked consultations, bullion dispatches, and invoices
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-3 bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
          <Package className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover physical products, book professional services, or acquire certified gold bullion from our marketplace.
          </p>
          <button
            onClick={() => setActiveTab('marketplace')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            Explore Marketplace
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const hasMetal = order.items.some(i => i.type === 'metal');
            const hasService = order.items.some(i => i.type === 'service');

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{order.orderNumber}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{order.createdAt}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-400">Tracking: {order.trackingNumber}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      order.paymentStatus === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {order.paymentStatus} ({order.paymentMethod.toUpperCase()})
                    </span>

                    <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase">
                      {order.deliveryStatus.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-14 h-14 rounded-xl object-cover bg-white dark:bg-slate-800 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {item.type === 'metal' && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] font-bold uppercase">
                              Metal
                            </span>
                          )}
                          {item.type === 'service' && (
                            <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase">
                              Service
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 truncate">{item.vendorName}</span>
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white truncate">{item.title}</div>
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          ${item.totalPriceUsd.toFixed(2)} (Qty: {item.quantity})
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Logistics & CTA */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div className="space-y-0.5">
                    <div className="text-slate-500 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Carrier: <strong>{order.courierName}</strong></span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Destination: {order.shippingAddress}, {order.shippingCity}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="text-right">
                      <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                        ${order.totalUsd.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {order.totalKhr.toLocaleString()} ៛
                      </div>
                    </div>

                    <button
                      onClick={() => handleTrack(order)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>{t.trackButton}</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
