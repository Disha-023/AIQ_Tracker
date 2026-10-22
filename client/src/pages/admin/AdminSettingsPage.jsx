import React, { useState } from 'react';
import { Settings, Building2, Sliders, Bell, ShieldCheck, Save, CheckCircle2, Clock, MapPin, Mail, Phone } from 'lucide-react';
import { adminMockData } from '../../data/adminMockData';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(adminMockData.settings);
  const [savedMessage, setSavedMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    setSavedMessage('Hospital system settings and operational parameters saved successfully.');
    setTimeout(() => setSavedMessage(''), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/60 text-teal-800 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-teal-600" />
            System Administration
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Hospital System Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Configure facility profile, OPD hours, queue dispatch rules, and automated patient communications.</p>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* HOSPITAL PROFILE & BRANDING */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Hospital Profile & Facility Identification</h2>
              <p className="text-xs text-slate-500">Public clinic details displayed on tokens, SMS alerts, and patient GPS arrival cards.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" /> Hospital Name
              </label>
              <input
                type="text"
                value={settings.hospitalName}
                onChange={(e) => setSettings({ ...settings, hospitalName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" /> Address / Location
              </label>
              <input
                type="text"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Official Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Phone
              </label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
              />
            </div>
          </div>
        </div>

        {/* OPD & QUEUE CONFIGURATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">OPD & Queue Operational Schedule</h2>
              <p className="text-xs text-slate-500">Configure clinic shift timings and token serialization format.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> OPD Shift Start Time
              </label>
              <input
                type="text"
                value={settings.opdStartTime}
                onChange={(e) => setSettings({ ...settings, opdStartTime: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> OPD Shift End Time
              </label>
              <input
                type="text"
                value={settings.opdEndTime}
                onChange={(e) => setSettings({ ...settings, opdEndTime: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-medium text-slate-800 transition-all"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Token Code Prefix</label>
              <input
                type="text"
                value={settings.tokenPrefix}
                onChange={(e) => setSettings({ ...settings, tokenPrefix: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 font-mono font-bold text-slate-800 transition-all"
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATION & AUTOMATION POLICIES */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Automation & Notification Policies</h2>
              <p className="text-xs text-slate-500">Enable or toggle automated routing and patient notification channels.</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            <label className="flex items-start sm:items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoAssignTokens}
                onChange={(e) => setSettings({ ...settings, autoAssignTokens: e.target.checked })}
                className="rounded-lg text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5 sm:mt-0 accent-teal-600 cursor-pointer"
              />
              <div>
                <span className="font-bold text-slate-800 block">Auto-assign tokens to available OPD doctor consultation rooms</span>
                <span className="text-xs text-slate-500 font-medium">Dynamically distributes walk-in patients when a room's active patient count reaches zero.</span>
              </div>
            </label>

            <label className="flex items-start sm:items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="rounded-lg text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5 sm:mt-0 accent-teal-600 cursor-pointer"
              />
              <div>
                <span className="font-bold text-slate-800 block">Enable automated email notifications to patients</span>
                <span className="text-xs text-slate-500 font-medium">Sends appointment confirmations, rescheduled time alerts, and digital token slips.</span>
              </div>
            </label>

            <label className="flex items-start sm:items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:bg-slate-100/60 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={settings.smsAlerts}
                onChange={(e) => setSettings({ ...settings, smsAlerts: e.target.checked })}
                className="rounded-lg text-teal-600 focus:ring-teal-500 w-4 h-4 mt-0.5 sm:mt-0 accent-teal-600 cursor-pointer"
              />
              <div>
                <span className="font-bold text-slate-800 block">Enable real-time SMS alerts for queue calls</span>
                <span className="text-xs text-slate-500 font-medium">Dispatches instant text message to patient mobile when their token is next in line.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xs transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save System Settings
          </button>
        </div>
      </form>
    </div>
  );
}
