/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { UserTopBar } from './components/UserTopBar';
import { AuthView } from './views/AuthView';
import { CustomerDashboardView } from './views/CustomerDashboardView';
import { MarketplaceView } from './views/MarketplaceView';
import { VendorsView } from './views/VendorsView';
import { DeliveryTrackingView } from './views/DeliveryTrackingView';
import { WalletView } from './views/WalletView';
import { CustomerOrdersView } from './views/CustomerOrdersView';
import { VendorHubView } from './views/VendorHubView';
import { AdminHubView } from './views/AdminHubView';
import { KycView } from './views/KycView';
import { ProfitCustomView } from './views/ProfitCustomView';
import { ProfileSettingsView } from './views/ProfileSettingsView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { ToastContainer } from './components/ToastContainer';
import { SnlLogo } from './components/SnlLogo';

const MainLayout: React.FC = () => {
  const { 
    isAuthenticated,
    currentUser,
    activeTab, 
    selectedItem, 
    setSelectedItem, 
    activePaymentModalOrder, 
    setActivePaymentModalOrder,
    isSidebarCollapsed,
    platformSettings
  } = useApp();

  // If not authenticated, render Login & Sign Up page
  if (!isAuthenticated) {
    return (
      <>
        <AuthView />
        <ToastContainer />
      </>
    );
  }

  const role = currentUser?.role || 'customer';

  // Dynamic Content View Router
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CustomerDashboardView />;

      case 'kyc':
        return <KycView />;

      case 'profile':
        return <ProfileSettingsView />;

      case 'profit_custom':
        return <ProfitCustomView />;

      case 'wallet':
        return <WalletView />;

      case 'tracking':
        return <DeliveryTrackingView />;

      case 'orders':
        return <CustomerOrdersView />;

      case 'marketplace':
        return <MarketplaceView onViewItem={item => setSelectedItem(item)} />;

      case 'vendors':
        return <VendorsView onViewItem={item => setSelectedItem(item)} />;

      case 'vendor_hub':
        return <VendorHubView />;

      case 'admin_hub':
        return <AdminHubView />;

      default:
        if (role === 'admin') return <AdminHubView />;
        if (role === 'vendor') return <VendorHubView />;
        return <CustomerDashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0B0D13] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* 1. Left Sidebar Navigation */}
      <Sidebar />

      {/* 2. Main Content Wrapper */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        
        {/* Top Header with Live Spot Ticker */}
        <Header />

        {/* User Portal Top Menu Bar with Notifications, Quick Links & KYC Status */}
        <UserTopBar />

        {/* Dynamic Route View */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {renderCurrentView()}
        </main>

        {/* Product Detail Modal */}
        <ProductDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />

        {/* Cart Drawer */}
        <CartDrawer />

        {/* NBC Bakong KHQR Payment Modal */}
        <PaymentModal
          isOpen={Boolean(activePaymentModalOrder)}
          onClose={() => setActivePaymentModalOrder(null)}
        />

        {/* Global Toast Alerts */}
        <ToastContainer />

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0E1118] py-8 transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div className="flex items-center gap-2">
              <SnlLogo size={22} />
              <span className="font-bold text-slate-700 dark:text-slate-300">
                {platformSettings.platformName || 'SNL RICH Eco'}
              </span>
              <span>· Kingdom of Cambodia Multi-Vendor Ecosystem</span>
            </div>

            <div className="flex items-center gap-4 text-[11px]">
              <span>NBC Bakong Verified</span>
              <span>·</span>
              <span>24K Bullion Vault</span>
              <span>·</span>
              <span>25 Provinces Dispatch</span>
            </div>
          </div>
        </footer>

      </div>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
