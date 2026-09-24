import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Truck, 
  Search, 
  MapPin, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  Navigation, 
  Package, 
  Sparkles, 
  Lock, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { Order, DeliveryStatus } from '../types';

export const DeliveryTrackingView: React.FC = () => {
  const { 
    orders, 
    activeTrackingOrder, 
    setActiveTrackingOrder, 
    trackOrderByNumber, 
    advanceDeliveryStatus, 
    language, 
    t, 
    addToast 
  } = useApp();

  const [inputTrackNum, setInputTrackNum] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputTrackNum.trim()) return;
    const found = trackOrderByNumber(inputTrackNum);
    if (!found) {
      addToast(`Tracking number "${inputTrackNum}" not found. Try SNL-TRK-882910`, 'error');
    } else {
      addToast(`Found order #${found.orderNumber}!`, 'success');
    }
  };

  const currentOrder = activeTrackingOrder || orders[0];

  const hasMetal = currentOrder?.items.some(i => i.type === 'metal');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Truck className="w-6 h-6 text-blue-600" />
            <span>{t.trackingTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.trackingSubtitle}
          </p>
        </div>

        {/* Tracking Input Search */}
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={inputTrackNum}
              onChange={e => setInputTrackNum(e.target.value)}
              placeholder={t.enterTrackingPlaceholder}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#161922] border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-900 dark:text-white font-mono placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-2xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all shrink-0"
          >
            {t.trackButton}
          </button>
        </form>
      </div>

      {/* If no order selected */}
      {!currentOrder ? (
        <div className="p-12 text-center bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Truck className="w-12 h-12 text-slate-400 mx-auto opacity-40" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Tracking Record Active</h3>
          <p className="text-xs text-slate-500">Please place an order or search for an active tracking number.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (2 Cols): Interactive Map Simulation & Timeline */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live GPS Route Visualizer Simulation */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-xl relative text-white">
              
              {/* Map Canvas Simulated Header */}
              <div className="p-4 px-6 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-mono font-bold">{currentOrder.trackingNumber}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-300 font-semibold">{currentOrder.courierName}</span>
                </div>

                <div className="flex items-center gap-2">
                  {hasMetal ? (
                    <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Armored Transport</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                      Standard Express
                    </span>
                  )}
                </div>
              </div>

              {/* Graphical Simulated Route Map */}
              <div className="p-6 relative h-64 flex flex-col justify-between overflow-hidden bg-radial from-slate-800/40 to-slate-950">
                {/* SVG Route Grid */}
                <div className="absolute inset-0 opacity-15 pointer-events-none">
                  <svg width="100%" height="100%">
                    <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#gridPattern)" />
                  </svg>
                </div>

                {/* Animated Route Line */}
                <div className="relative z-10 flex items-center justify-between w-full my-auto px-4 sm:px-12">
                  {/* Origin */}
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400 text-blue-300 flex items-center justify-center mx-auto shadow-md">
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="text-[11px] font-bold text-white">Central Hub</div>
                    <div className="text-[9px] text-slate-400">Phnom Penh Vault</div>
                  </div>

                  {/* Route Dash & Moving Vehicle */}
                  <div className="flex-1 mx-4 relative flex items-center">
                    <div className="w-full h-1 bg-slate-700 rounded-full relative overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-700" 
                        style={{
                          width: currentOrder.deliveryStatus === 'delivered' ? '100%' 
                               : currentOrder.deliveryStatus === 'out_for_delivery' ? '85%'
                               : currentOrder.deliveryStatus === 'in_transit' ? '55%'
                               : currentOrder.deliveryStatus === 'picked_up_courier' ? '30%'
                               : '10%'
                        }}
                      />
                    </div>

                    {/* Vehicle Marker */}
                    <div 
                      className="absolute -top-3.5 transition-all duration-700 p-1.5 rounded-full bg-white text-slate-900 shadow-lg border-2 border-blue-500 flex items-center justify-center"
                      style={{
                        left: currentOrder.deliveryStatus === 'delivered' ? '95%' 
                             : currentOrder.deliveryStatus === 'out_for_delivery' ? '80%'
                             : currentOrder.deliveryStatus === 'in_transit' ? '50%'
                             : currentOrder.deliveryStatus === 'picked_up_courier' ? '25%'
                             : '5%'
                      }}
                    >
                      <Truck className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="text-center space-y-1">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400 text-emerald-300 flex items-center justify-center mx-auto shadow-md">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-[11px] font-bold text-white">Destination</div>
                    <div className="text-[9px] text-slate-400">{currentOrder.shippingCity}</div>
                  </div>
                </div>

                {/* Bottom Route Status Banner */}
                <div className="relative z-10 flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Estimated Arrival: <strong className="text-white">{currentOrder.estimatedDeliveryDate}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">Driver Phone:</span>
                    <a href={`tel:${currentOrder.courierPhone}`} className="font-mono text-emerald-400 font-bold flex items-center gap-1 hover:underline">
                      <Phone className="w-3 h-3" />
                      <span>{currentOrder.courierPhone}</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* Simulation Demo Controller */}
              <div className="p-3.5 px-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-slate-400 text-[11px]">
                  Simulate live courier dispatch updates for demonstration:
                </div>

                <button
                  onClick={() => advanceDeliveryStatus(currentOrder.id)}
                  disabled={currentOrder.deliveryStatus === 'delivered'}
                  className={`px-4 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 text-xs shadow-xs ${
                    currentOrder.deliveryStatus === 'delivered'
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{currentOrder.deliveryStatus === 'delivered' ? 'Order Completed' : 'Advance Next Milestone'}</span>
                </button>
              </div>

            </div>

            {/* Step-by-Step Logistics Timeline */}
            <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                {t.trackingTimeline}
              </h3>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                {currentOrder.milestones.map((m, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Status Circle */}
                    <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                      m.completed
                        ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                        : m.current
                        ? 'bg-blue-600 border-blue-600 text-white animate-pulse'
                        : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}>
                      {m.completed ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <span className="text-[10px] font-mono font-bold">{idx + 1}</span>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 pt-0.5 space-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                        <span className={`font-bold ${m.completed || m.current ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                          {language === 'km' ? m.labelKm : m.label}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 shrink-0">
                          {m.timestamp}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {m.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Customer Info */}
          <div className="space-y-6">
            
            {/* Order Card */}
            <div className="bg-white dark:bg-[#161922] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Order Information</div>
                <div className="text-base font-black text-slate-900 dark:text-white font-mono">
                  {currentOrder.orderNumber}
                </div>
                <div className="text-xs text-slate-500">{currentOrder.createdAt}</div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300">Ordered Items</div>
                {currentOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover bg-white dark:bg-slate-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400">{item.vendorName} · Qty: {item.quantity}</div>
                      <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        ${item.totalPriceUsd.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Details */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Delivery Destination</div>
                <div className="font-bold text-slate-900 dark:text-white">{currentOrder.customerName}</div>
                <div className="text-slate-500">{currentOrder.customerPhone}</div>
                <div className="text-slate-500 leading-relaxed">{currentOrder.shippingAddress}, {currentOrder.shippingCity}</div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">${currentOrder.subtotalUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Shipping ({hasMetal ? 'Armored Vault' : 'Standard'}):</span>
                  <span className="font-mono text-slate-900 dark:text-white">${currentOrder.shippingFeeUsd.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Paid:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">${currentOrder.totalUsd.toFixed(2)} USD</span>
                </div>
                <div className="text-[10px] text-right text-slate-400 font-mono">
                  {currentOrder.totalKhr.toLocaleString()} ៛ KHR
                </div>
              </div>

            </div>

            {/* Other Recent Orders Switcher */}
            {orders.length > 1 && (
              <div className="p-4 bg-white dark:bg-[#161922] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Other Orders</div>
                <div className="space-y-1.5">
                  {orders.filter(o => o.id !== currentOrder.id).map(o => (
                    <button
                      key={o.id}
                      onClick={() => setActiveTrackingOrder(o)}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between transition-colors"
                    >
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{o.trackingNumber}</span>
                      <span className="text-[10px] text-blue-600 font-semibold capitalize">{o.deliveryStatus.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
