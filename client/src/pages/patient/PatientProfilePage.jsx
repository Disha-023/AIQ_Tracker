import React, { useState, useEffect } from 'react';
import { User, Sparkles } from 'lucide-react';
import { patientService } from '../../services/patientService';
import { useAuth } from '../../context/AuthContext';

export default function PatientProfilePage() {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
      <div className="flex items-center gap-4 border-b border-slate-200 pb-6">
        <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-xs">
          {patient.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
          <p className="text-xs text-slate-500 font-semibold">Patient ID: {patient.patientId}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Mobile Number</span>
          <p className="font-semibold text-slate-800 text-sm">{patient.mobile}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
          <p className="font-semibold text-slate-800 text-sm">{patient.email}</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Age</span>
          <p className="font-semibold text-slate-800 text-sm">{patient.age} years</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Group</span>
          <p className="font-semibold text-slate-800 text-sm">{patient.bloodGroup}</p>
        </div>
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Profile Management Placeholder</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Medical history editing, emergency contact settings, and insurance details will be enabled in subsequent phases.
        </p>
      </div>
    </div>
  );
}
