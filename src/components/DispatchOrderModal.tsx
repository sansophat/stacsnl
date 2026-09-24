import React, { useState, useEffect } from 'react';
import { Order, DeliveryStatus } from '../types';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Truck, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Calendar, 
  Save, 
  CheckCircle2, 
  Clock, 
  PackageCheck,
  Building2,
  Navigation,
  ArrowRight
} from 'lucide-react';

interface DispatchOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const COURIER_OPTIONS = [
  { name: 'Armored Vault Logistics', phone: '+855 23 881 990', type: 'Armored / High Security' },
  { name: 'SNL Express Courier Network', phone: '+855 23 889 100', type: 'Standard Express' },
  { name: 'Kerry Logistics Cambodia', phone: '+855 23 999 180', type: 'Nationwide Freight' },
  { name: 'J&T Express Cambodia', phone: '+855 23 900 888', type: 'Next-Day Delivery' },
  { name: 'Grab Express Cambodia', phone: '+855 23 880 777', type: 'Same-Day City Dispatch' }
];

const DELIVERY_STAGES: { stage: DeliveryStatus; label: string; desc: string }[] = [
  { stage: 'order_confirmed', label: 'Order Confirmed', desc: 'Payment settled & order approved' },
  { stage: 'preparing_dispatch', label: 'Packaging & Inspection', desc: 'Vault or warehouse sealing' },
  { stage: 'picked_up_courier', label: 'Handover to Courier', desc: 'Driver picked up package' },
  { stage: 'in_transit', label: 'In Transit', desc: 'En route along transport corridor' },
  { stage: 'out_for_delivery', label: 'Out for Delivery', desc: 'Final mile delivery approaching' },
  { stage: 'delivered', label: 'Delivered', desc: 'Customer signed & verified receipt' }
];

export const DispatchOrderModal: React.FC<DispatchOrderModalProps> = ({ order, isOpen, onClose }) => {
  const { updateOrderDelivery } = useApp();

  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>('order_confirmed');
  const [courierName, setCourierName] = useState('');
  const [courierPhone, setCourierPhone] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [locationNote, setLocationNote] = useState('');

  useEffect(() => {
    if (order) {
      setDeliveryStatus(order.deliveryStatus);
      setCourierName(order.courierName || COURIER_OPTIONS[0].name);
      setCourierPhone(order.courierPhone || COURIER_OPTIONS[0].phone);
      setTrackingNumber(order.trackingNumber || `SNL-TRK-${order.orderNumber.replace('SNL-ORD-', '')}`);
      setEstimatedDeliveryDate(order.estimatedDeliveryDate || 'Within 24 Hours');
      setLocationNote(order.milestones.find(m => m.current)?.location || 'Central Distribution Hub');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleCourierSelect = (c: typeof COURIER_OPTIONS[0]) => {
    setCourierName(c.name);
    setCourierPhone(c.phone);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateOrderDelivery(order.id, {
      deliveryStatus,
      courierName,
      courierPhone,
      trackingNumber,
      estimatedDeliveryDate,
      locationNote
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#151922] w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600 text-white">
              <Truck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Dispatch & Delivery Management
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Order {order.orderNumber} · Customer: {order.customerName}
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

        {/* Scrollable Body */}
        <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
          
          {/* Customer & Destination Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{order.customerName}</span>
                <span className="text-slate-400 font-mono">({order.customerPhone})</span>
              </div>
              <div className="text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{order.shippingAddress}, {order.shippingCity}</span>
              </div>
            </div>

            <div className="font-mono font-black text-sm text-slate-900 dark:text-white sm:text-right shrink-0">
              ${order.totalUsd.toFixed(2)}
              <div className="text-[10px] text-slate-400 font-normal">
                {order.items.length} items to fulfill
              </div>
            </div>
          </div>

          {/* Delivery Stage Progress Selector */}
          <div className="space-y-2">
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              1. Advance Delivery Milestone Stage *
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DELIVERY_STAGES.map((s, idx) => {
                const isSelected = deliveryStatus === s.stage;
                const isPassed = DELIVERY_STAGES.findIndex(x => x.stage === deliveryStatus) >= idx;

                return (
                  <button
                    key={s.stage}
                    type="button"
                    onClick={() => setDeliveryStatus(s.stage)}
                    className={`p-3 rounded-2xl text-left border transition-all relative ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30'
                        : isPassed
                        ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60 text-slate-800 dark:text-slate-200'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] font-bold opacity-75">
                        Step {idx + 1}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <div className="font-bold text-xs">{s.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5 truncate">{s.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Courier Assignment */}
          <div className="space-y-3">
            <label className="block text-slate-700 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider">
              2. Courier & Logistics Carrier *
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {COURIER_OPTIONS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCourierSelect(c)}
                  className={`p-2.5 rounded-xl text-left border flex items-center justify-between transition-colors ${
                    courierName === c.name
                      ? 'bg-slate-100 dark:bg-slate-800 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  <div>
                    <div className="font-bold">{c.name}</div>
                    <div className="text-[10px] text-slate-400">{c.type} · {c.phone}</div>
                  </div>
                  {courierName === c.name && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Carrier / Driver Contact Phone
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={courierPhone}
                    onChange={e => setCourierPhone(e.target.value)}
                    className="w-full bg-transparent text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  Carrier Tracking Code / Waybill #
                </label>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                  <Navigation className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={e => setTrackingNumber(e.target.value)}
                    className="w-full bg-transparent text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Timing and Location Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Estimated Delivery Handover
              </label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={estimatedDeliveryDate}
                  onChange={e => setEstimatedDeliveryDate(e.target.value)}
                  placeholder="e.g. Today by 4:30 PM"
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                Current Checkpoint Location Note
              </label>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={locationNote}
                  onChange={e => setLocationNote(e.target.value)}
                  placeholder="e.g., Preah Monivong Corridor / Sorting Terminal"
                  className="w-full bg-transparent text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>
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
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Update Dispatch Status</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
