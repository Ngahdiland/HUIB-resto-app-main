"use client";
import React, { useState, useEffect } from 'react';
import { FaSave, FaCog, FaBell, FaShieldAlt, FaCreditCard, FaTruck, FaEnvelope, FaGlobe, FaUser, FaLock, FaPalette, FaDatabase } from 'react-icons/fa';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    business: {
      name: 'HuibApp Food Delivery',
      email: 'admin@huibapp.com',
      phone: '+1234567890',
      address: 'Buea',
      currency: 'FCFA',
      timezone: 'DOUALA',
      language: 'English'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      orderAlerts: true,
      paymentAlerts: true,
      systemAlerts: true,
      marketingEmails: false
    },
    payment: {
      mtnEnabled: true,
      orangeEnabled: true,
      mtnName: 'Fonyuy Diland',
      mtnNumber: '677828170',
      orangeName: 'Fonyuy Diland',
      orangeNumber: '693276652',
    },
    delivery: {
      deliveryFee: 2.99,
      freeDeliveryThreshold: 25.00,
      maxDeliveryDistance: 10,
      deliveryTime: '30-45 minutes',
      allowPickup: true,
      allowDelivery: true
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      failedLoginAttempts: 5,
      ipWhitelist: '',
      sslEnabled: true
    }
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (Object.keys(data).length > 0) {
            setSettings(data);
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Failed to save settings');
      // Optionally show a success message here
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: <FaCog /> },
    { id: 'notifications', name: 'Notifications', icon: <FaBell /> },
    { id: 'payment', name: 'Payment', icon: <FaCreditCard /> },
    { id: 'delivery', name: 'Delivery', icon: <FaTruck /> },
    { id: 'security', name: 'Security', icon: <FaShieldAlt /> },
    // Removed appearance tab
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <div className="text-lg text-gray-600">Loading settings...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-600">Configure your application settings</p>
        </div>
        <button 
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          onClick={handleSaveSettings}
          disabled={saving}
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <FaSave />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input
                      type="text"
                      value={settings.business.name}
                      onChange={(e) => handleSettingChange('business', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.business.email}
                      onChange={(e) => handleSettingChange('business', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={settings.business.phone}
                      onChange={(e) => handleSettingChange('business', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={settings.business.currency}
                      onChange={(e) => handleSettingChange('business', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    >
                      <option value="FCFA">FCFA</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select
                      value={settings.business.timezone}
                      onChange={(e) => handleSettingChange('business', 'timezone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={settings.business.language}
                      onChange={(e) => handleSettingChange('business', 'language', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={settings.business.address}
                    onChange={(e) => handleSettingChange('business', 'address', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Email Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.emailNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">SMS Notifications</h4>
                      <p className="text-sm text-gray-600">Receive notifications via SMS</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Push Notifications</h4>
                      <p className="text-sm text-gray-600">Receive push notifications</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Methods</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">MTN Mobile Money</h4>
                      <p className="text-sm text-gray-600">Enable MTN Mobile Money payments and set the number to receive payments.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.payment.mtnEnabled}
                      onChange={(e) => handleSettingChange('payment', 'mtnEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
                      disabled={saving}
                    />
                  </div>
                  {settings.payment.mtnEnabled && (
                    <div className="flex flex-col gap-2 ml-8">
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium text-gray-700">MTN Name:</label>
                        <input
                          type="text"
                          value={settings.payment.mtnName}
                          onChange={e => handleSettingChange('payment', 'mtnName', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          disabled={saving}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium text-gray-700">MTN Number:</label>
                        <input
                          type="tel"
                          value={settings.payment.mtnNumber}
                          onChange={e => handleSettingChange('payment', 'mtnNumber', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                          disabled={saving}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Orange Money</h4>
                      <p className="text-sm text-gray-600">Enable Orange Money payments and set the number to receive payments.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.payment.orangeEnabled}
                      onChange={(e) => handleSettingChange('payment', 'orangeEnabled', e.target.checked)}
                      className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                      disabled={saving}
                    />
                  </div>
                  {settings.payment.orangeEnabled && (
                    <div className="flex flex-col gap-2 ml-8">
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium text-gray-700">Orange Name:</label>
                        <input
                          type="text"
                          value={settings.payment.orangeName}
                          onChange={e => handleSettingChange('payment', 'orangeName', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={saving}
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <label className="block text-sm font-medium text-gray-700">Orange Number:</label>
                        <input
                          type="tel"
                          value={settings.payment.orangeNumber}
                          onChange={e => handleSettingChange('payment', 'orangeNumber', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          disabled={saving}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Delivery Settings */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Delivery Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Fee (FCFA)</label>
                    <input
                      type="number"
                      value={settings.delivery.deliveryFee}
                      onChange={(e) => handleSettingChange('delivery', 'deliveryFee', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Free Delivery Threshold (FCFA)</label>
                    <input
                      type="number"
                      value={settings.delivery.freeDeliveryThreshold}
                      onChange={(e) => handleSettingChange('delivery', 'freeDeliveryThreshold', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Delivery Distance (km)</label>
                    <input
                      type="number"
                      value={settings.delivery.maxDeliveryDistance}
                      onChange={(e) => handleSettingChange('delivery', 'maxDeliveryDistance', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Time</label>
                    <input
                      type="text"
                      value={settings.delivery.deliveryTime}
                      onChange={(e) => handleSettingChange('delivery', 'deliveryTime', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Allow Pickup</h4>
                      <p className="text-sm text-gray-600">Allow customers to pick up orders</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.delivery.allowPickup}
                      onChange={(e) => handleSettingChange('delivery', 'allowPickup', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={saving}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Allow Delivery</h4>
                      <p className="text-sm text-gray-600">Allow delivery to customer addresses</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.delivery.allowDelivery}
                      onChange={(e) => handleSettingChange('delivery', 'allowDelivery', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-800">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactorAuth}
                      onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
                    <input
                      type="number"
                      value={settings.security.passwordExpiry}
                      onChange={(e) => handleSettingChange('security', 'passwordExpiry', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Failed Login Attempts</label>
                    <input
                      type="number"
                      value={settings.security.failedLoginAttempts}
                      onChange={(e) => handleSettingChange('security', 'failedLoginAttempts', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && null}
        </div>
      </div>
    </div>
  );
};

export default Settings;
