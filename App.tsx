
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Users, 
  LayoutDashboard, 
  BrainCircuit, 
  Menu, 
  X, 
  Link2,
  Share2,
  Workflow,
  ShieldCheck,
  ChevronDown,
  Settings,
  LogOut,
  Cpu,
  Zap,
  Bot,
  UserCheck,
  GitBranch,
  Terminal
} from 'lucide-react';
import { Citizen, PovertyStatus } from './types';
import { classifyPoverty } from './utils/decisionTree';
import Dashboard from './components/Dashboard';
import CitizenList from './components/CitizenList';
import MLInsights from './components/MLInsights';
import SelfServiceData from './components/SelfServiceData';
import ModelArchitecture from './components/ModelArchitecture';
import Login from './components/Login';

const initialData: Citizen[] = [
  { 
    id: '1', name: 'Ahmad Subagyo', nik: '33210001', gender: 'Laki-laki', income: 500000, dependents: 4, 
    houseType: 'Kayu/Bambu', floorType: 'Tanah', occupation: 'Buruh Tani', 
    healthIssues: true, status: PovertyStatus.MISKIN, year: 2026,
    classificationReason: "Penghasilan sangat rendah (≤800rb) disertai beban tanggungan keluarga yang banyak (≥3 orang)."
  },
  { 
    id: '2', name: 'Siti Aminah', nik: '33210002', gender: 'Perempuan', income: 1200000, dependents: 2, 
    houseType: 'Permanen', floorType: 'Ubin', occupation: 'Pedagang', 
    healthIssues: false, status: PovertyStatus.TIDAK_MISKIN, year: 2026,
    classificationReason: "Penghasilan mencukupi untuk kebutuhan dasar dengan jumlah tanggungan yang proporsional."
  },
  { 
    id: '3', name: 'Budiyanto', nik: '33210003', gender: 'Laki-laki', income: 850000, dependents: 3, 
    houseType: 'Semi-Permanen', floorType: 'Semen', occupation: 'Serabutan', 
    healthIssues: false, status: PovertyStatus.RENTAN_MISKIN, year: 2027,
    classificationReason: "Penghasilan rendah, namun beban keluarga dan kondisi fisik rumah masih dalam batas wajar."
  }
];

const SidebarLink = ({ to, icon: Icon, label, active }: { to: string, icon: any, label: string, active: boolean }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-600 hover:bg-slate-100'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  const [citizens, setCitizens] = useState<Citizen[]>(initialData);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
  };

  const handleAddCitizen = (newCitizen: Omit<Citizen, 'id' | 'status' | 'classificationReason'>) => {
    const { status, reason } = classifyPoverty(newCitizen);
    const citizen: Citizen = {
      ...newCitizen,
      id: Math.random().toString(36).substr(2, 9),
      status,
      classificationReason: reason
    };
    setCitizens(prev => [...prev, citizen]);
  };

  const handleDeleteCitizen = (id: string) => {
    setCitizens(prev => prev.filter(c => c.id !== id));
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-inter">
      {/* Mobile Backdrop */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md ring-4 ring-indigo-50">
              <BrainCircuit size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight text-nowrap">SI-WIRATAN</h1>
              <p className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">Management System</p>
            </div>
          </div>

          <nav className="space-y-1 flex-grow">
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" active={location.pathname === '/'} />
            <SidebarLink to="/data-warga" icon={Users} label="Data Warga" active={location.pathname === '/data-warga'} />
            <SidebarLink to="/analisis-ai" icon={BrainCircuit} label="Analisis AI" active={location.pathname === '/analisis-ai'} />
            <SidebarLink to="/pendataan-mandiri" icon={Link2} label="Portal Mandiri" active={location.pathname === '/pendataan-mandiri'} />
            
            <div className="pt-10 pb-2 px-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Advanced Tools</p>
            </div>

            <Link 
              to="/arsitektur-model" 
              className={`relative group flex items-center gap-3 px-4 py-4 rounded-2xl transition-all overflow-hidden ${
                location.pathname === '/arsitektur-model' 
                ? 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-800 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.5)]' 
                : 'bg-slate-900 text-slate-300 hover:bg-black shadow-xl border border-white/5 hover:translate-x-1'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <div className={`p-2 rounded-lg ${location.pathname === '/arsitektur-model' ? 'bg-white/20' : 'bg-indigo-600 text-white'}`}>
                <GitBranch size={20} className={location.pathname === '/arsitektur-model' ? 'animate-pulse' : ''} />
              </div>
              <div className="flex flex-col">
                 <span className="font-black text-[11px] uppercase tracking-widest leading-none">Decision Tree</span>
                 <span className="text-[8px] font-medium opacity-60 uppercase mt-1">Logic Arsitektur</span>
              </div>
            </Link>
          </nav>

          <div className="mt-10">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs uppercase tracking-widest"
            >
              <LogOut size={20} />
              Keluar Sesi
            </button>
          </div>

          <div className="mt-auto p-5 bg-slate-900 rounded-[2rem] border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Zap size={40} className="text-indigo-400" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">System Online</p>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight font-medium italic">"Mewujudkan desa transparan dengan bantuan cerdas."</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto h-screen relative">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-600">
            <Menu size={24} />
          </button>
          
          <div className="hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              <h2 className="text-base font-black text-slate-900 uppercase tracking-[0.2em] italic">
                {location.pathname === '/' ? 'Monitoring Warga' : 
                 location.pathname === '/data-warga' ? 'Database Warga' : 
                 location.pathname === '/analisis-ai' ? 'Laporan Analis' :
                 location.pathname === '/arsitektur-model' ? 'Logika Keputusan' :
                 'Input Gateway'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-4 bg-slate-50 border border-slate-200 pl-4 pr-2 py-2 rounded-[1.5rem] group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-500">
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{currentUser === 'admin' ? 'Administrator Desa' : currentUser}</span>
                      <ShieldCheck size={14} className="text-indigo-600" />
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Verified Session</span>
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,1)] animate-pulse"></div>
                   </div>
                </div>
                
                <div className="relative">
                   <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-full opacity-20 group-hover:opacity-100 blur transition-all duration-700"></div>
                   <div className="relative w-11 h-11 bg-white rounded-full flex items-center justify-center border-2 border-slate-100 shadow-lg z-10 overflow-hidden">
                      <img 
                         src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser}&backgroundColor=f8fafc`} 
                         alt="Admin" 
                         className="w-full h-full scale-110" 
                      />
                   </div>
                   <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white z-20 flex items-center justify-center shadow-lg">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                   </div>
                </div>
                <div className="p-1 text-slate-300 group-hover:text-indigo-600 transition-colors">
                   <ChevronDown size={18} />
                </div>
             </div>
          </div>
        </header>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard citizens={citizens} />} />
            <Route path="/data-warga" element={<CitizenList citizens={citizens} onAdd={handleAddCitizen} onDelete={handleDeleteCitizen} />} />
            <Route path="/analisis-ai" element={<MLInsights citizens={citizens} />} />
            <Route path="/arsitektur-model" element={<ModelArchitecture />} />
            <Route path="/pendataan-mandiri" element={<SelfServiceData citizens={citizens} onAdd={handleAddCitizen} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
