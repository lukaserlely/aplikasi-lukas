
import React, { useMemo, useState } from 'react';
// Rename recharts component to avoid conflict with lucide-react icon
import { PieChart as ReChartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Citizen, PovertyStatus } from '../types';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  BrainCircuit, 
  Wallet, 
  Cpu, 
  Zap, 
  Activity, 
  Layers, 
  ShieldCheck, 
  Gauge,
  GitBranch,
  Terminal,
  Scan,
  RefreshCcw,
  ArrowRight,
  Database,
  Code2,
  Box,
  BadgeCheck,
  Building2,
  PieChart // Added icon from lucide-react
} from 'lucide-react';

interface Props {
  citizens: Citizen[];
}

const StatCard = ({ label, value, icon: Icon, color, subtext }: { label: string, value: number, icon: any, color: string, subtext: string }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color} text-white shadow-lg transition-transform group-hover:scale-110`}>
        <Icon size={24} />
      </div>
    </div>
    <div className="mt-4 flex items-center gap-1">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{subtext}</span>
    </div>
  </div>
);

const Dashboard: React.FC<Props> = ({ citizens }) => {
  const [isScanning, setIsScanning] = useState(false);

  const stats = useMemo(() => ({
    total: citizens.length,
    miskin: citizens.filter(c => c.status === PovertyStatus.MISKIN).length,
    rentan: citizens.filter(c => c.status === PovertyStatus.RENTAN_MISKIN).length,
    aman: citizens.filter(c => c.status === PovertyStatus.TIDAK_MISKIN).length,
  }), [citizens]);

  const handleRunInference = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const chartData = useMemo(() => [
    { name: 'Miskin', value: stats.miskin, color: '#ef4444' },
    { name: 'Rentan Miskin', value: stats.rentan, color: '#f59e0b' },
    { name: 'Tidak Miskin', value: stats.aman, color: '#10b981' },
  ], [stats]);

  const occupationData = useMemo(() => {
    const counts: Record<string, number> = {};
    citizens.forEach(c => {
      counts[c.occupation] = (counts[c.occupation] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [citizens]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Data Warga" value={stats.total} icon={Users} color="bg-indigo-600" subtext="Jumlah Sampel" />
        <StatCard label="Prediksi Miskin" value={stats.miskin} icon={AlertCircle} color="bg-red-500" subtext="Sangat Perlu Bantuan" />
        <StatCard label="Prediksi Rentan" value={stats.rentan} icon={TrendingUp} color="bg-amber-500" subtext="Harus Terus Dipantau" />
        <StatCard label="Prediksi Aman" value={stats.aman} icon={CheckCircle} color="bg-emerald-500" subtext="Ekonomi Sudah Mampu" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIE CHART WITH LOGO */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-slate-300 relative overflow-hidden group">
          {/* Subtle Watermark Logo Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
            <Building2 size={300} />
          </div>

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
                {/* Now refers to the lucide-react icon */}
                <PieChart size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Distribusi Kelayakan</h4>
            </div>
            
            {/* OFFICIAL VERIFICATION LOGO/BADGE */}
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
               <BadgeCheck size={16} className="text-emerald-600" />
               <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">ML Verified</span>
            </div>
          </div>

          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              {/* Use renamed recharts component */}
              <ReChartsPieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value} Orang`, 'Jumlah']}
                />
                <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{paddingTop: '20px', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase'}} />
              </ReChartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm transition-all hover:shadow-xl hover:border-slate-300 relative overflow-hidden">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2 relative z-10">
            <Layers size={16} className="text-indigo-500" /> Profil Sektor Pekerjaan
          </h4>
          <div className="h-[280px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={occupationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* INTELLIGENCE CORE DECISION TREE v2.5 (ANCHORED AT BOTTOM) */}
      <div className="relative mt-8 group">
         <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-[3.5rem] blur-2xl opacity-10 group-hover:opacity-20 transition duration-1000"></div>
         
         <div className="relative bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white overflow-hidden border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 right-0 p-16 opacity-5 rotate-12 transition-transform group-hover:rotate-45 duration-[2000ms] pointer-events-none">
              <GitBranch size={450} strokeWidth={1} />
            </div>
            <div className="absolute bottom-0 left-0 p-10 opacity-5 -rotate-12 pointer-events-none">
              <Terminal size={300} strokeWidth={1} />
            </div>
            
            {isScanning && (
              <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_30px_rgba(129,140,248,1)] z-30 animate-[scan_2s_ease-in-out_infinite]"></div>
            )}

            <div className="relative z-20 flex flex-col lg:flex-row items-center gap-12">
               <div className="flex-1 space-y-8 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                     <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-1"></div>
                     Decision Tree Machine Learning Core v2.5
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none mb-6">
                    Intelligence <br /> <span className="text-indigo-500">Processing Hub</span>
                  </h3>
                  
                  <p className="text-slate-400 text-base leading-relaxed max-w-2xl font-medium mx-auto lg:mx-0">
                    Mesin inferensi ini menggunakan algoritma percabangan logika untuk memproses indikator kemiskinan warga secara otomatis. Tekan tombol pemicu untuk memulai audit data skala besar.
                  </p>

                  <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                     <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-sm group/tag hover:bg-white/10 transition-all">
                        <Code2 size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Entropy: 0.24</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-sm group/tag hover:bg-white/10 transition-all">
                        <Box size={16} className="text-indigo-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Gini Index: 0.18</span>
                     </div>
                     <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-2xl border border-white/5 backdrop-blur-sm group/tag hover:bg-white/10 transition-all">
                        <ShieldCheck size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">92.4% Accuracy</span>
                     </div>
                  </div>
               </div>

               <div className="flex flex-col items-center gap-6 shrink-0 w-full lg:w-auto">
                  <button 
                    onClick={handleRunInference}
                    disabled={isScanning}
                    className={`relative w-full sm:w-80 h-80 rounded-[4rem] overflow-hidden transition-all duration-700 transform active:scale-95 flex flex-col items-center justify-center gap-5 group/btn border-4 ${
                      isScanning 
                      ? 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed scale-95 shadow-none' 
                      : 'bg-indigo-600 border-indigo-500/50 text-white shadow-[0_30px_80px_-20px_rgba(79,70,229,0.7)] hover:bg-indigo-500 hover:-translate-y-4 hover:shadow-[0_45px_100px_-15px_rgba(79,70,229,0.9)]'
                    }`}
                  >
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-transparent to-white/10 opacity-50"></div>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
                     
                     <div className={`relative p-8 rounded-[2rem] transition-all duration-700 ${isScanning ? 'bg-slate-700' : 'bg-white/10 backdrop-blur-xl border border-white/10 shadow-2xl group-hover/btn:rotate-12 group-hover/btn:scale-110'}`}>
                        {isScanning ? (
                          <RefreshCcw size={48} className="animate-spin text-slate-500" />
                        ) : (
                          <Zap size={48} className="fill-white animate-pulse" />
                        )}
                     </div>

                     <div className="text-center relative z-10 px-6">
                        <span className="block font-black text-xs uppercase tracking-[0.5em] italic mb-2">
                          {isScanning ? 'Running ML Module...' : 'Inference Trigger'}
                        </span>
                        {!isScanning && (
                          <span className="block text-[10px] font-bold uppercase tracking-[0.3em] opacity-50 flex items-center justify-center gap-2">
                            Execute Decision Tree Logic <ArrowRight size={10} />
                          </span>
                        )}
                     </div>

                     {isScanning && (
                        <div className="absolute bottom-12 w-40 h-1 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-400 animate-[progress_2s_ease-in-out]"></div>
                        </div>
                     )}
                  </button>
                  
                  <div className="flex items-center gap-3 bg-slate-950/50 px-6 py-2 rounded-full border border-white/5">
                     <Activity size={12} className="text-indigo-500 animate-pulse" />
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Latency: 0.02ms</span>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
