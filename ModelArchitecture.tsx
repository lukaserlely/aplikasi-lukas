
import React from 'react';
import { 
  Workflow, 
  Binary, 
  Cpu, 
  TrendingDown, 
  Home, 
  Users, 
  Zap, 
  ChevronRight, 
  Network,
  ShieldCheck,
  SearchCode,
  Layers,
  BarChart3,
  Dna,
  Microchip,
  GitBranch,
  Settings2
} from 'lucide-react';

const DecisionNode = ({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) => (
  <div className="relative group flex-1">
    <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-3xl blur opacity-20 group-hover:opacity-60 transition duration-500`}></div>
    <div className="relative bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center h-full">
      <div className={`p-5 rounded-2xl ${color.replace('from-', 'bg-').replace('to-', '')} text-white mb-6 shadow-xl ring-4 ring-white`}>
        <Icon size={32} />
      </div>
      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tighter mb-3">{title}</h4>
      <p className="text-xs text-slate-500 font-medium leading-relaxed">{description}</p>
    </div>
  </div>
);

const StepCard = ({ number, title, desc }: { number: string, title: string, desc: string }) => (
  <div className="flex gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100 relative group overflow-hidden">
    <div className="absolute -right-4 -bottom-4 text-slate-200/50 group-hover:text-indigo-200/50 transition-colors">
      <Settings2 size={80} />
    </div>
    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black italic shrink-0 shadow-lg relative z-10">
      {number}
    </div>
    <div className="relative z-10">
      <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest mb-1">{title}</h5>
      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const ModelArchitecture: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-20">
      {/* Hero Section */}
      <div className="relative bg-slate-900 rounded-[4rem] p-16 overflow-hidden shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-0 right-0 p-10 opacity-10 animate-pulse">
          <Network size={400} className="text-indigo-400" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8">
            <Microchip size={14} className="animate-spin-slow" /> Machine Learning Engine v2.5
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
            Intelligence <br /> <span className="text-indigo-500">Decision Tree</span>
          </h2>
          <p className="text-indigo-100/60 max-w-2xl font-medium leading-relaxed text-lg">
            Sistem klasifikasi Desa Wiratan didukung oleh algoritma Pohon Keputusan yang mentransformasi data mentah warga menjadi kebijakan sosial yang presisi melalui logika percabangan matematika.
          </p>
        </div>
      </div>

      {/* Pipeline Section */}
      <div className="space-y-8">
        <div className="flex items-center gap-4">
           <div className="h-px flex-1 bg-slate-200"></div>
           <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">ML Training Pipeline</h3>
           <div className="h-px flex-1 bg-slate-200"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StepCard number="01" title="Data Ingestion" desc="Sinkronisasi data dari Google Sheets & Form warga Desa Wiratan." />
          <StepCard number="02" title="Pre-processing" desc="Pembersihan data (Cleaning) & normalisasi nilai pendapatan per keluarga." />
          <StepCard number="03" title="Tree Growing" desc="Pembuatan cabang keputusan berdasarkan fitur yang paling berpengaruh." />
          <StepCard number="04" title="Inference" desc="Prediksi status ekonomi (Miskin/Rentan) secara instan (real-time)." />
        </div>
      </div>

      {/* visual Core Logic */}
      <div className="space-y-10">
        <div className="flex items-center gap-3">
           <GitBranch className="text-indigo-600" size={28} />
           <h3 className="text-xl font-black text-slate-900 uppercase tracking-widest italic">Anatomi Pohon Keputusan</h3>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8">
          <DecisionNode 
            icon={TrendingDown} 
            title="Root Node: Ekonomi" 
            description="Kriteria pemisah pertama: Apakah pendapatan bulanan per kapita mencukupi kebutuhan kalori minimum?" 
            color="from-indigo-600 to-blue-700" 
          />
          <div className="hidden lg:flex items-center"><ChevronRight size={32} className="text-slate-200" /></div>
          <DecisionNode 
            icon={Users} 
            title="Internal Node: Rasio" 
            description="Mengevaluasi beban tanggungan. Jika 1 pencari kerja menanggung >3 orang, risiko kemiskinan meningkat." 
            color="from-violet-600 to-purple-700" 
          />
          <div className="hidden lg:flex items-center"><ChevronRight size={32} className="text-slate-200" /></div>
          <DecisionNode 
            icon={Home} 
            title="Leaf Node: Final" 
            description="Hasil akhir klasifikasi: Sistem memberikan label (Output) berdasarkan data fisik hunian pendukung." 
            color="from-emerald-600 to-teal-700" 
          />
        </div>
      </div>

      {/* Technical Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-5"><BarChart3 size={200} /></div>
          <h4 className="text-2xl font-black text-slate-900 italic uppercase mb-8 flex items-center gap-3">
            <Layers className="text-indigo-600" /> Mengapa Decision Tree?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
            <div className="space-y-4">
              <div className="p-5 bg-indigo-50 rounded-2xl border-l-4 border-indigo-600">
                <p className="text-sm font-black text-indigo-900 uppercase tracking-wider mb-2">Interpretabilitas Tinggi</p>
                <p className="text-xs text-indigo-700 leading-relaxed font-medium">Bukan 'Black Box'. Perangkat desa bisa melihat persis mengapa si A diklasifikasikan miskin.</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-2xl">
                <p className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Penanganan Data Non-Linear</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Sangat baik dalam menangani variabel kategori (Pekerjaan, Tipe Rumah) dan angka secara bersamaan.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-5 bg-slate-50 rounded-2xl">
                <p className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Efisiensi Komputasi</p>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">Hanya membutuhkan milidetik untuk memproses ribuan data warga, sangat hemat resource server.</p>
              </div>
              <div className="p-5 bg-emerald-50 rounded-2xl border-l-4 border-emerald-600">
                <p className="text-sm font-black text-emerald-900 uppercase tracking-wider mb-2">Informasi Gain</p>
                <p className="text-xs text-emerald-700 leading-relaxed font-medium">Menggunakan algoritma Greedy untuk mencari fitur yang paling banyak 'mengurangi ketidakpastian' data.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 p-12 rounded-[3rem] text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -bottom-10 -left-10 opacity-10 rotate-45"><Dna size={200} /></div>
          <div className="relative z-10 space-y-8">
            <div>
               <h4 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Model Metrics</h4>
               <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2"><span>Akurasi Model</span><span>92.4%</span></div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[92%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2"><span>F1-Score (Stabil)</span><span>89.1%</span></div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[89%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-bold uppercase mb-2"><span>Inference Time</span><span>0.02s</span></div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[100%]" />
                    </div>
                  </div>
               </div>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
               <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                 "Decision Tree adalah fondasi yang memungkinkan komputer 'belajar' tanpa instruksi eksplisit, cukup dengan melihat pola dari database kemiskinan historis."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelArchitecture;
