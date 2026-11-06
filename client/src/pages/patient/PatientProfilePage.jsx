import React, { useState, useEffect } from 'react';
import { User, Sparkles, Edit3, ShieldCheck, Mail, Phone, MapPin, HeartPulse, CheckCircle2 } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfilePage() {
  const { user, updateUser } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    age: '',
    gender: 'Male',
    bloodGroup: '',
    address: '',
    pincode: '',
    emergencyContact: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const data = await patientService.getById(user.id);
        setPatient(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load profile.');
        // Fallback to local auth state
        setPatient({
          name: user.name,
          patientId: user.id,
          email: user.email,
          mobile: user.mobile,
          age: 'N/A',
          bloodGroup: 'N/A'
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleStartEdit = () => {
    if (!patient) return;
    setFormData({
      name: patient.name || '',
      mobile: patient.mobile || '',
      email: patient.email || '',
      age: patient.age !== 'N/A' ? patient.age || '' : '',
      gender: patient.gender || 'Male',
      bloodGroup: patient.bloodGroup !== 'N/A' ? patient.bloodGroup || '' : '',
      address: patient.address || '',
      pincode: patient.pincode || '',
      emergencyContact: patient.emergencyContact || ''
    });
    setIsEditing(true);
    setSaveSuccess('');
    setError('');
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!formData.mobile.trim()) {
      setError('Mobile Number is required.');
      return;
    }

    setSaveLoading(true);
    setError('');
    setSaveSuccess('');
    try {
      const payload = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        age: formData.age ? parseInt(formData.age, 10) : null,
        gender: formData.gender,
        blood_group: formData.bloodGroup,
        address: formData.address.trim(),
        pincode: formData.pincode.trim(),
        emergency_contact: formData.emergencyContact.trim()
      };

      const updated = await patientService.update(user.id, payload);
      setPatient(updated);
      
      // Update global context session values
      updateUser({
        name: updated.name,
        email: updated.email,
        mobile: updated.mobile,
        bloodGroup: updated.bloodGroup
      });

      setIsEditing(false);
      setSaveSuccess('Profile details saved successfully.');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-10 border border-slate-200/90 shadow-xs max-w-4xl mx-auto text-center font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-teal-600 border-t-transparent animate-spin mx-auto mb-3"></div>
        <p className="text-xs font-semibold text-slate-500">Loading patient profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Header Profile Identity Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-5 border-b border-slate-100 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white font-extrabold text-xl flex items-center justify-center shadow-xs">
            {patient?.name?.charAt(0) || 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">{patient?.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200 shadow-2xs">
                Active Patient
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Medical ID: <span className="font-mono text-teal-700 font-bold">{patient?.patientId || user?.id}</span> &bull; Kole Hospital Sangli
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold shadow-2xs">
          {error}
        </div>
      )}

      {isEditing ? (
        /* EDITABLE FORM VIEW */
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Full Legal Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Mobile Number *</label>
              <input
                type="tel"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Age (Years)</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>AB+</option>
                <option>AB-</option>
                <option>O+</option>
                <option>O-</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Residential Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Emergency Contact Phone</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saveLoading}
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saveLoading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* READ-ONLY VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary Mobile</span>
              <p className="font-extrabold text-slate-900 text-sm">{patient.mobile || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
              <p className="font-extrabold text-slate-900 text-sm truncate">{patient.email || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Age</span>
              <p className="font-extrabold text-slate-900 text-sm">{patient.age ? `${patient.age} years` : 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Blood Group</span>
              <p className="font-extrabold text-slate-900 text-sm">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 font-bold border border-rose-200 text-xs">
                  {patient.bloodGroup || 'N/A'}
                </span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</span>
              <p className="font-extrabold text-slate-900 text-sm">{patient.gender || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Postal Pincode</span>
              <p className="font-extrabold text-slate-900 text-sm">{patient.pincode || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 sm:col-span-2 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Address</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.address || 'Sangli, Maharashtra'}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 space-y-1 sm:col-span-2 shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency Contact</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.emergencyContact || '9876543210'}</p>
            </div>
          </div>

          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 text-center space-y-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200/70 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Encrypted Patient Information</h4>
            <p className="text-[11.5px] text-slate-500 max-w-md mx-auto leading-relaxed">
              Medical history, queue priority, and clinical logs are strictly protected under healthcare privacy standards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
