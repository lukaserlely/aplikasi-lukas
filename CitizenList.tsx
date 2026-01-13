
import React, { useState, useEffect } from 'react';
import { Citizen, PovertyStatus } from '../types';
import { 
  Search, 
  Plus, 
  Trash2, 
  Filter, 
  X, 
  BrainCircuit, 
  ChevronDown, 
  User, 
  Activity,
  Zap,
  Cpu,
  Layers,
  Download,
  Calendar,
  Database,
  Info,
  ChevronRight,
  Target,
  TrendingDown,
  Home,
  Users as UsersIcon,
  FileDown,
  ShieldCheck,
  ClipboardCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Circle,
  UserRound,
  UserRoundCheck,
  Wallet,
  Briefcase,
  Users,
  Fingerprint,
  Coins,
  Baby,
  Stethoscope,
  BadgeCheck
} from 'lucide-react';

interface Props {
  citizens: Citizen[];
  onAdd: (citizen: Omit<Citizen, 'id' | 'status' | 'classificationReason'>) => void;
  onDelete: (id: string) => void;
}

const HighlightMatch: React.FC<{ text: string; match: string }> = ({ text, match }) => {
  if (!match.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${match})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => 
        part.toLowerCase() === match.toLowerCase() ? (
          <mark key={i} className="bg-indigo-100 text-indigo-700 font-bold rounded-sm px-0.5 border-b border-indigo-300">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

const CitizenList: React.FC<Props> = ({ citizens, onAdd, onDelete }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCitizen, setSelectedCitizen] = useState<Citizen | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');
  const [yearFilter, setYearFilter] = useState<string>('Semua');
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [toast, setToast] = useState<{ visible: boolean, message: string, title?: string, type?: 'success' | 'warning' | 'error' }>({ 
    visible: false, 
    message: '', 
    title: 'Sistem Wiratan AI',
    type: 'success' 
  });
  
  const MASTER_CSV_URL = "https://docs.google.com/spreadsheets/d/1qQHaowvFFDXHSJCsn76TZXdb74_aXUJU1lU1EbRejmo/export?format=csv";

  const [newCitizen, setNewCitizen] = useState<Partial<Citizen>>({
    name: '',
    nik: '',
    gender: 'Laki-laki',
    income: 0,
    dependents: 0,
    houseType: 'Permanen',
    floorType: 'Ubin',
    occupation: '',
    healthIssues: false,
    year: 2026
  });

  const availableYears = Array.from({ length: 10 }, (_, i) => 2026 + i);

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 6000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const filtered = citizens.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.nik.includes(searchTerm);
    const matchesStatus = statusFilter === 'Semua' || c.status === statusFilter;
    const matchesYear = yearFilter === 'Semua' || c.year === Number(yearFilter);
    return matchesSearch && matchesStatus && matchesYear;
  });

  const handleExportCSV = () => {
    if (filtered.length === 0) {
      setToast({ visible: true, message: 'Tidak ada data hasil filter untuk diekspor.', title: 'Peringatan', type: 'warning' });
      return;
    }

    const headers = ["ID", "Nama", "NIK", "Gender", "Tahun", "Penghasilan", "Tanggungan", "Pekerjaan", "Tipe Rumah", "Tipe Lantai", "Status AI", "Alasan"];
    const csvRows = [
      headers.join(','), 
      ...filtered.map(c => [c.id, `"${c.name}"`, `'${c.nik}`, c.gender, c.year, c.income, c.dependents, `"${c.occupation}"`, `"${c.houseType}"`, `"${c.floorType}"`, `"${c.status}"`, `"${c.classificationReason.replace(/"/g, '""')}"`].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `DATA_FILTER_WIRATAN_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setToast({ visible: true, message: `Berhasil mengekspor ${filtered.length} data terpilih.`, title: 'Ekspor Berhasil', type: 'success' });
  };

  const handleSyncMaster = async () => {
    setIsSyncing(true);
    try {
      const response = await fetch(`${MASTER_CSV_URL}&cache_bust=${Date.now()}`);
      if (!response.ok) throw new Error('Network Error');
      const csvText = await response.text();
      const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== '');
      
      let addedCount = 0;
      let duplicateCount = 0;
      let errorCount = 0;
      const currentYear = yearFilter === 'Semua' ? 2026 : Number(yearFilter);

      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (cols.length >= 5) {
          const name = cols[1]?.trim().replace(/^"|"$/g, '');
          const nik = cols[2]?.trim().replace(/^"|"$/g, '').replace(/'/g, '');
          
          if (!name || !nik) {
            errorCount++;
            continue;
          }

          const isDuplicate = citizens.some(c => (c.nik === nik || c.name.toLowerCase() === name.toLowerCase()) && c.year === currentYear);
          
          if (!isDuplicate) {
            onAdd({
              name, nik, 
              gender: 'Laki-laki', 
              income: parseInt(cols[3]?.replace(/[^\d]/g, '')) || 0, 
              dependents: parseInt(cols[4]?.replace(/[^\d]/g, '')) || 0, 
              occupation: (cols[5] || '').trim().replace(/^"|"$/g, ''),
              houseType: 'Permanen', floorType: 'Ubin', healthIssues: false, year: currentYear
            });
            addedCount++;
          } else {
            duplicateCount++;
          }
        } else {
          errorCount++;
        }
      }
      
      setToast({ 
        visible: true, 
        title: 'Laporan Sinkronisasi',
        message: `Berhasil: ${addedCount} | Duplikat: ${duplicateCount} | Bermasalah: ${errorCount}`, 
        type: addedCount > 0 ? 'success' : 'warning' 
      });
    } catch (error) {
      setToast({ visible: true, title: 'Kegagalan Sistem', message: 'Koneksi database terputus atau format CSV tidak valid.', type: 'error' });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCitizen.name || !newCitizen.nik) return;
    onAdd(newCitizen as Omit<Citizen, 'id' | 'status' | 'classificationReason'>);
    setShowAddModal(false);
    setToast({ visible: true, title: 'Data Tersimpan', message: `${newCitizen.name} berhasil didaftarkan ke sistem.`, type: 'success' });
  };

  const getStatusIcon = (status: PovertyStatus) => {
    switch (status) {
      case PovertyStatus.MISKIN:
        return (
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 bg-red-400 rounded-full animate-ping opacity-20 scale-150"></div>
            <AlertCircle size={16} className="shrink-0 relative z-10 animate-pulse text-red-600" />
          </div>
        );
      case PovertyStatus.RENTAN_MISKIN:
        return <AlertTriangle size={16} className="shrink-0 text-amber-600" />;
      case PovertyStatus.TIDAK_MISKIN:
        return <CheckCircle size={16} className="shrink-0 text-emerald-600" />;
      default:
        return <Circle size={16} className="shrink-0" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dynamic Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-[100] transition-all duration-500 transform ${toast.visible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`bg-white/90 backdrop-blur-xl border-l-4 ${
          toast.type === 'error' ? 'border-red-500' : toast.type === 'warning' ? 'border-amber-500' : 'border-indigo-600'
        } rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-6 flex items-center gap-5 min-w-[380px] border border-white/20`}>
          <div className={`${
            toast.type === 'error' ? 'bg-red-50 text-red-500' : toast.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-indigo-50 text-indigo-600'
          } p-4 rounded-2xl shadow-inner`}>
            {toast.type === 'error' ? <AlertCircle size={28} /> : toast.type === 'warning' ? <Info size={28} /> : <ClipboardCheck size={28} className="animate-bounce" />}
          </div>
          <div className="flex-1">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1.5">{toast.title}</p>
            <p className="text-sm font-bold text-slate-800 leading-tight">{toast.message}</p>
          </div>
        </div>
      </div>

      {/* COMMAND CENTER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
        
        <div className={`relative flex-grow transition-all duration-500 ease-out group ${isSearchFocused ? 'xl:flex-[1.5]' : 'xl:flex-1'}`}>
          <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 ${isSearchFocused ? 'text-indigo-600 scale-110' : 'text-slate-400'}`}>
            <Search size={22} />
          </div>
          <input 
            type="text" 
            placeholder="Cari nama warga atau nomor NIK..." 
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-full pl-14 pr-16 py-5 rounded-2xl border-2 bg-slate-50/50 text-base font-semibold text-slate-900 outline-none transition-all duration-300 shadow-inner ${
              isSearchFocused 
              ? 'border-indigo-500 bg-white ring-8 ring-indigo-500/5 shadow-2xl' 
              : 'border-slate-100 hover:border-slate-200 hover:bg-white'
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 transition-colors">
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <div className="flex bg-slate-100 p-1 rounded-2xl gap-1 border border-slate-200 shadow-inner">
             <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)} className="pl-4 pr-10 py-3 rounded-xl border-none text-xs bg-transparent font-black text-slate-600 appearance-none cursor-pointer focus:ring-0">
                <option value="Semua">TAHUN</option>
                {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
             </select>
             <div className="w-px h-6 bg-slate-200 my-auto"></div>
             <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="pl-4 pr-10 py-3 rounded-xl border-none text-xs bg-transparent font-black text-slate-600 appearance-none cursor-pointer focus:ring-0">
                <option value="Semua">STATUS AI</option>
                {Object.values(PovertyStatus).map(s => <option key={s} value={s}>{s.toUpperCase()}</option>)}
             </select>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleExportCSV} className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 hover:shadow-lg transition-all active:scale-95 group">
              <FileDown size={22} className="group-hover:translate-y-0.5 transition-transform" />
            </button>
            <button onClick={handleSyncMaster} disabled={isSyncing} className={`px-6 py-4 rounded-2xl font-black text-sm flex items-center gap-2 transition-all active:scale-95 ${isSyncing ? 'bg-slate-200 text-slate-400' : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-[0_10px_20px_rgba(16,185,129,0.3)]'}`}>
              <Database size={18} className={isSyncing ? 'animate-spin' : ''} /> 
              <span className="hidden sm:inline">SINKRON</span>
            </button>
            <button onClick={() => setShowAddModal(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-indigo-700 hover:shadow-[0_10px_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 group">
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> TAMBAH
            </button>
          </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-[3rem] border border-slate-100 overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] group/table">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 backdrop-blur-sm border-b border-slate-100">
                <th className="pl-10 pr-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Identitas Warga</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Periode</th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Hasil Klasifikasi AI</th>
                <th className="pr-10 pl-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c, idx) => (
                <tr key={c.id} className="hover:bg-indigo-50/30 transition-all duration-300 group/row animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${idx * 50}ms` }}>
                  <td className="pl-10 pr-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="relative">
                        <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden shadow-sm group-hover/row:scale-105 transition-transform duration-500 ${c.gender === 'Laki-laki' ? 'bg-blue-50 text-blue-500 border border-blue-100' : 'bg-pink-50 text-pink-500 border border-pink-100'}`}>
                           {c.gender === 'Laki-laki' ? <UserRound size={22} /> : <UserRound size={22} />}
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 tracking-tight leading-none group-hover/row:text-indigo-600 transition-colors uppercase">
                          <HighlightMatch text={c.name} match={searchTerm} />
                        </span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-bold text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                            <HighlightMatch text={c.nik} match={searchTerm} />
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border-2 border-slate-100 rounded-full shadow-sm group-hover/row:border-indigo-200 group-hover/row:shadow-md transition-all duration-500">
                      <Calendar size={14} className="text-slate-400 group-hover/row:text-indigo-500 transition-colors" />
                      <span className="text-[11px] font-black text-slate-800 tracking-tighter">{c.year}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] border-2 shadow-sm transition-all duration-500 transform group-hover/row:scale-[1.03] ${
                      c.status === PovertyStatus.MISKIN 
                        ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-200/20' 
                        : c.status === PovertyStatus.RENTAN_MISKIN 
                        ? 'bg-amber-50 text-amber-700 border-amber-100 shadow-amber-200/20' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100 shadow-emerald-200/20'
                    }`}>
                      {getStatusIcon(c.status)}
                      <span className="relative">{c.status}</span>
                    </div>
                  </td>
                  <td className="pr-10 pl-8 py-6 text-center">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover/row:opacity-100 transition-all transform translate-x-4 group-hover/row:translate-x-0 duration-300">
                      <button onClick={() => setSelectedCitizen(c)} className="p-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-xl transition-all active:scale-90" title="Detail Audit">
                        <Activity size={20} />
                      </button>
                      <button onClick={() => onDelete(c.id)} className="p-3 bg-white text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white hover:shadow-xl transition-all active:scale-90" title="Hapus Data">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedCitizen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 animate-in zoom-in-95 duration-500 flex flex-col max-h-[95vh] relative">
            <div className="p-12 bg-slate-900 relative overflow-hidden shrink-0">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-slate-900 opacity-90"></div>
               <button onClick={() => setSelectedCitizen(null)} className="absolute top-8 right-8 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all z-20">
                 <X size={28} />
               </button>
               
               <div className="relative z-10 flex flex-col">
                  <div className="flex items-center gap-4 mb-4">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 ${selectedCitizen.gender === 'Laki-laki' ? 'bg-blue-600' : 'bg-pink-600'}`}>
                        <User size={28} className="text-white" />
                     </div>
                     <div>
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Profil Terverifikasi</span>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter leading-none text-white mt-1">{selectedCitizen.name}</h3>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-6">
                     <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                        <Calendar size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Tahun {selectedCitizen.year}</span>
                     </div>
                     <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                        <UserRound size={14} className="text-indigo-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{selectedCitizen.gender}</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto py-10 px-12 custom-scrollbar space-y-10">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Target size={14} className="text-indigo-500" /> Metrik Ekonomi
                     </h4>
                     <div className="space-y-3">
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group/item hover:bg-white hover:shadow-lg transition-all">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Penghasilan</span>
                           <span className="font-black text-slate-900">Rp {selectedCitizen.income.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center group/item hover:bg-white hover:shadow-lg transition-all">
                           <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">Tanggungan</span>
                           <span className="font-black text-slate-900">{selectedCitizen.dependents} Orang</span>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                        <Cpu size={14} className="text-indigo-500" /> Analisis Inferensi
                     </h4>
                     <div className={`p-6 rounded-[2rem] border flex flex-col gap-4 relative overflow-hidden ${
                        selectedCitizen.status === PovertyStatus.MISKIN ? 'bg-red-50/30 border-red-100' :
                        selectedCitizen.status === PovertyStatus.RENTAN_MISKIN ? 'bg-amber-50/30 border-amber-100' :
                        'bg-emerald-50/30 border-emerald-100'
                     }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(selectedCitizen.status)}
                          <span className="text-[10px] font-black uppercase tracking-widest ml-2">{selectedCitizen.status}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-bold italic">
                           "{selectedCitizen.classificationReason}"
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="px-12 py-8 bg-slate-50/80 backdrop-blur-md shrink-0 flex items-center justify-between border-t border-slate-100">
               <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Audit Terverifikasi Digital</span>
               </div>
               <button onClick={() => setSelectedCitizen(null)} className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl text-xs hover:bg-black transition-all uppercase tracking-[0.3em] shadow-2xl active:scale-95">Tutup Audit</button>
            </div>
          </div>
        </div>
      )}

      {/* MODERN & PROFESSIONAL ADD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl shadow-[0_50px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-in zoom-in-95 duration-500 border border-white/20 flex flex-col max-h-[90vh]">
             {/* Header Section */}
             <div className="p-8 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white flex justify-between items-center relative overflow-hidden shrink-0">
                <div className="absolute top-0 right-0 p-10 opacity-10 -mr-10 -mt-10"><BrainCircuit size={160} /></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,1)]"></div>
                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-200">Registration System</span>
                   </div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter flex items-center gap-4 leading-none">
                     Formulir Warga Baru
                   </h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all relative z-10 backdrop-blur-md border border-white/10 shadow-lg">
                   <X size={24} />
                </button>
             </div>
             
             {/* Form Content */}
             <form onSubmit={handleSubmit} className="overflow-y-auto custom-scrollbar bg-slate-50/30">
                <div className="p-10 space-y-10">
                   {/* Personal Info Group */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-200">
                            <Fingerprint size={16} />
                         </div>
                         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">I. Informasi Identitas</h4>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                         <div className="space-y-2 md:col-span-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                             Nama Lengkap Berdasarkan KTP
                           </label>
                           <div className="relative group">
                              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                              <input 
                                required autoFocus
                                className="w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50/50 text-slate-900 font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner" 
                                placeholder="Contoh: Muhammad Rendy"
                                value={newCitizen.name}
                                onChange={e => setNewCitizen({...newCitizen, name: e.target.value})} 
                              />
                           </div>
                         </div>
                         
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nomor Induk Kependudukan (NIK)</label>
                           <div className="relative group">
                              <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                              <input 
                                required maxLength={16} 
                                className="w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50/50 text-slate-900 font-mono font-bold focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner" 
                                placeholder="3321xxxxxxxxxxxx"
                                value={newCitizen.nik}
                                onChange={e => setNewCitizen({...newCitizen, nik: e.target.value})} 
                              />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jenis Kelamin</label>
                           <div className="flex gap-2 p-1 bg-slate-50 border-2 border-slate-100 rounded-2xl shadow-inner h-[60px]">
                              <button 
                                type="button"
                                onClick={() => setNewCitizen({...newCitizen, gender: 'Laki-laki'})}
                                className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${newCitizen.gender === 'Laki-laki' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                              >
                                <UserRound size={14} /> Laki-laki
                              </button>
                              <button 
                                type="button"
                                onClick={() => setNewCitizen({...newCitizen, gender: 'Perempuan'})}
                                className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${newCitizen.gender === 'Perempuan' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
                              >
                                <UserRound size={14} /> Perempuan
                              </button>
                           </div>
                         </div>
                      </div>
                   </div>

                   {/* Economic Group */}
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-200">
                            <Coins size={16} />
                         </div>
                         <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">II. Parameter Ekonomi & ML</h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Total Penghasilan (Rp)</label>
                           <div className="relative group">
                              <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                              <input 
                                type="number" required 
                                className="w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50/50 text-slate-900 font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner" 
                                placeholder="0"
                                value={newCitizen.income || ''}
                                onChange={e => setNewCitizen({...newCitizen, income: Number(e.target.value)})} 
                              />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Jumlah Tanggungan</label>
                           <div className="relative group">
                              <Baby className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                              <input 
                                type="number" required 
                                className="w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50/50 text-slate-900 font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner" 
                                placeholder="0"
                                value={newCitizen.dependents || ''}
                                onChange={e => setNewCitizen({...newCitizen, dependents: Number(e.target.value)})} 
                              />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Pekerjaan Utama</label>
                           <div className="relative group">
                              <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={18} />
                              <input 
                                required
                                className="w-full pl-14 pr-6 py-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50/50 text-slate-900 font-bold italic focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner" 
                                placeholder="Misal: Buruh Harian"
                                value={newCitizen.occupation}
                                onChange={e => setNewCitizen({...newCitizen, occupation: e.target.value})} 
                              />
                           </div>
                         </div>

                         <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Tahun Pendataan</label>
                           <div className="relative group">
                              <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                              <select 
                                className="w-full pl-14 pr-10 py-4 border-2 border-slate-100 rounded-2xl text-base bg-slate-50/50 text-slate-900 font-black focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all shadow-inner appearance-none cursor-pointer"
                                value={newCitizen.year}
                                onChange={e => setNewCitizen({...newCitizen, year: Number(e.target.value)})}
                              >
                                {availableYears.map(y => <option key={y} value={y}>TAHUN {y}</option>)}
                              </select>
                              <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                           </div>
                         </div>
                      </div>
                   </div>

                   <div className="p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100 flex items-start gap-4">
                      <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600">
                         <BrainCircuit size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-black text-indigo-900 uppercase tracking-wider mb-1">Algoritma Decision Tree</p>
                         <p className="text-[10px] text-indigo-700 font-medium leading-relaxed italic opacity-80">Data yang Anda masukkan akan diproses oleh mesin inferensi AI untuk menentukan status kelayakan bantuan secara otomatis dan objektif.</p>
                      </div>
                   </div>
                </div>

                {/* Footer Section */}
                <div className="p-10 pt-0 shrink-0">
                  <div className="flex items-center justify-end gap-4">
                     <button 
                       type="button" 
                       onClick={() => setShowAddModal(false)} 
                       className="px-10 py-5 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all"
                     >
                       Batal
                     </button>
                     <button 
                       type="submit" 
                       className="px-14 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-2xl shadow-indigo-500/30 hover:bg-indigo-700 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em] text-[11px] flex items-center gap-3 border-b-4 border-indigo-800"
                     >
                       Analisis Data <Zap size={18} className="fill-white" />
                     </button>
                  </div>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenList;
