import React, { useState, useEffect } from 'react';
import { History, Sparkles } from 'lucide-react';
import { consultationService } from '../../services/consultationService';
import { useAuth } from '../../context/AuthContext';

export default function PatientHistoryPage() {
  const { user } = useAuth();
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user?.id) return;
      try {
        const data = await consultationService.getAll({ patientId: user.id });
        setVisits(data);
      } catch (err) {
        setError(err.message || 'Failed to load consultation history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  return (
    <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
        <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Visit History</h1>
          <p className="text-sm text-slate-500">Comprehensive digital records of past hospital consultations</p>
        </div>
      </div>

      <div className="space-y-3">
        {loading && visits.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold bg-slate-50 border border-slate-200 rounded-xl">
            Loading clinical history...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 font-semibold bg-slate-50 border border-slate-200 rounded-xl">
            {error}
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-8 text-slate-500 font-semibold bg-slate-50 border border-slate-200 rounded-xl">
            No past consultations or visits found.
          </div>
        ) : (
          visits.map((visit) => (
          <div key={visit.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{visit.date} &bull; {visit.id}</span>
              <h4 className="font-bold text-slate-900 text-sm mt-0.5">{visit.doctor}</h4>
              <p className="text-xs text-slate-600">{visit.specialization}</p>
              <p className="text-xs text-slate-500 italic mt-1">{visit.notes}</p>
            </div>
            <span className="self-start sm:self-center px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              {visit.status}
            </span>
          </div>
        ))
       )}
      </div>

      <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center space-y-3">
        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200">
          <Sparkles className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">EHR & Prescription Download Placeholder</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Digital prescription PDFs, lab report attachments, and doctor notes will be connected in future phases.
        </p>
      </div>
    </div>
  );
}
