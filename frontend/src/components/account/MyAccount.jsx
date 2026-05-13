import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import OrdersTab from './OrdersTab';
import AccountSettingsTab from './AccountSettingsTab';
import NotificationsTab from './NotificationsTab';
import ScentProfileTab from './ScentProfileTab';
import MaterialIcon from '../common/MaterialIcon';

const MyAccount = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['orders', 'notifications', 'settings', 'scent-profile'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/account?tab=${tabId}`, { replace: true });
  };

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: '📦' },
    { id: 'scent-profile', label: 'Scent Profile', icon: '🌸' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'settings', label: 'Account Settings', icon: '⚙️' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-heading2 font-display font-bold hidden lg:block mb-8">My Account</h1>

      {/* Mobile View */}
      <div className="flex items-center gap-3 mb-2 lg:hidden">

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2"
        >
          {/* Simple hamburger */}
          <MaterialIcon icon="dehaze" />
        </button>
        <h1 className="text-heading2 font-display font-semibold">My Account</h1>
      </div>

      {menuOpen && (
        <div className="px-2 mb-6 overflow-hidden lg:hidden ">
          <nav className="flex flex-col text-body2 bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  handleTabChange(tab.id);
                  setMenuOpen(false); // close after click
                }}
                className={`w-full text-left px-1 py-3 border-b ${
                  activeTab === tab.id
                    ? 'text-black font-medium'
                    : 'text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-6">

        {/* Sidebar (desktop only) */}
        <div className="hidden lg:block lg:col-span-1">
          <nav className="flex flex-col text-body2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`w-full text-left py-4 border-b transition-colors ${
                  activeTab === tab.id
                    ? 'text-black font-medium'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 px-2 my-layout-xl">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'scent-profile' && <ScentProfileTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'settings' && <AccountSettingsTab />}
        </div>

      </div>
    </div>
  );
};

export default MyAccount;

