import React, { useState, useEffect } from 'react';
import { User, Sparkles } from 'lucide-react';
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
        mobile: updated.mobile
      });
      
      setSaveSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update patient:', err);
      setError(err.message || 'Failed to save changes.');
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto text-center font-bold text-xs text-slate-500">
        Loading profile record...
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto text-center font-bold text-xs text-red-500">
        {error || 'Patient profile not found.'}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-xs">
            {patient.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
            <p className="text-xs text-slate-500 font-semibold">Patient ID: {patient.patientId}</p>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Update My Info
          </button>
        )}
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {saveSuccess}
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* EDIT MODE */}
      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
            
            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Mobile Number *</label>
              <input
                type="text"
                required
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Blood Group</label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
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

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-[10px] uppercase text-slate-400">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[10px] uppercase text-slate-400">Emergency Contact</label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              />
            </div>

          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
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
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saveLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        /* READ-ONLY VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.mobile || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.email || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Age</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.age ? `${patient.age} years` : 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.bloodGroup || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Gender</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.gender || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Pincode</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.pincode || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Address</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.address || 'N/A'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Emergency Contact</span>
              <p className="font-semibold text-slate-800 text-sm">{patient.emergencyContact || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center space-y-3">
            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Profile Management Portal</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Medical history records, clinic consultation archives, and insurance documents are securely stored inside your PostgreSQL profile.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
