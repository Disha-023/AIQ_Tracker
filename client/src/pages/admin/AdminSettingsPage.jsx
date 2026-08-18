import React, { useState } from 'react';
import { Settings, Building2, Sliders, Bell, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(adminMockData.settings);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('Hospital system settings saved successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospital System Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">Configure hospital information, OPD parameters, queue algorithms, and security policies.</p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* HOSPITAL INFORMATION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-sm font-bold text-slate-900">
            <Building2 className="w-5 h-5 text-purple-600" />
            Hospital Profile & Branding
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Hospital Name</label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Address / Location</label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Official Contact Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* OPD & QUEUE CONFIGURATION */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-sm font-bold text-slate-900">
            <Sliders className="w-5 h-5 text-purple-600" />
            OPD & Queue Configuration
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">OPD Start Time</label>
              <input
                type="text"
                value={settings.opdStartTime}
                onChange={(e) => setSettings({ ...settings, opdStartTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">OPD End Time</label>
              <input
                type="text"
                value={settings.opdEndTime}
                onChange={(e) => setSettings({ ...settings, opdEndTime: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Token Code Prefix</label>
              <input
                type="text"
                value={settings.tokenPrefix}
                onChange={(e) => setSettings({ ...settings, tokenPrefix: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATION & SECURITY SETTINGS */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-200 text-sm font-bold text-slate-900">
            <ShieldCheck className="w-5 h-5 text-purple-600" />
            Security & Notification Controls
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAssignTokens}
                onChange={(e) => setSettings({ ...settings, autoAssignTokens: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-800">Auto-assign tokens to available OPD doctor rooms</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-800">Enable automated email notifications to patients</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsAlerts}
                onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span className="font-semibold text-slate-800">Enable real-time SMS alerts for queue calls</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          Save System Settings
        </button>

      </form>

    </div>
  );
}
