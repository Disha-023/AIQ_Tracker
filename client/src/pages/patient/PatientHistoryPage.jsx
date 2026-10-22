import React, { useState, useEffect } from 'react';
import { History, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
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
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200/90 shadow-xs max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center gap-3.5 border-b border-slate-100 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 flex items-center justify-center shadow-2xs">
          <History className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Clinical Consultation History</h1>
          <p className="text-xs text-slate-500 mt-0.5">Comprehensive digital logs of your past hospital appointments & consultations</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {loading && visits.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs">
            Loading clinical history...
          </div>
        ) : error ? (
          <div className="text-center py-10 text-rose-600 font-semibold bg-rose-50 border border-rose-200 rounded-2xl text-xs">
            {error}
          </div>
        ) : visits.length === 0 ? (
          <div className="text-center py-10 text-slate-400 font-medium bg-slate-50/70 border border-slate-200/70 rounded-2xl text-xs">
            No past consultations or medical visits found.
          </div>
        ) : (
          visits.map((visit) => (
            <div key={visit.id} className="p-4.5 rounded-2xl bg-slate-50/80 hover:bg-teal-50/30 border border-slate-200/70 transition-all flex flex-col sm:flex-row justify-between sm:items-center gap-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{visit.date} &bull; {visit.id}</span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{visit.doctor}</h4>
                <p className="text-xs text-teal-700 font-semibold">{visit.specialization}</p>
                {visit.notes && <p className="text-xs text-slate-500 italic mt-1 bg-white/80 p-2 rounded-lg border border-slate-100">{visit.notes}</p>}
              </div>
              <span className="self-start sm:self-center px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 shadow-2xs">
                {visit.status}
              </span>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70 text-center space-y-2">
        <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-200/70 shadow-2xs">
          <FileText className="w-4 h-4" />
        </div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Digital Prescription & Records Vault</h4>
        <p className="text-[11.5px] text-slate-500 max-w-md mx-auto leading-relaxed">
          Official hospital discharge summaries, prescription PDF downloads, and physician remarks are archived permanently for your clinical reference.
        </p>
      </div>
    </div>
  );
}
