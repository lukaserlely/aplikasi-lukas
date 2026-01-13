
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  ChevronRight, 
  BrainCircuit, 
  Zap,
  Eye,
  EyeOff,
  Fingerprint,
  Cpu
} from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError('');

    // Simulate Network Delay & ML Verification
    setTimeout(() => {
      // UPDATED CREDENTIALS: admin / wiratan123
      if (username === 'admin' && password === 'wiratan123') {
        onLogin(username);
      } else {
        setError('Kredensial tidak valid. Silakan periksa ID dan Kata Sandi Anda.');
        setIsAuthenticating(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden font-inter">
      {/* Background Orbs / Decorations */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
      
      {/* Circuit Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="text-center mb-10 group cursor-default">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2rem] text-white shadow-[0_0_50px_rgba(79,70,229,0.4)] mb-6 transition-transform group-hover:scale-110 duration-500">
            <BrainCircuit size={40} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">SI-WIRATAN</h1>
          <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.4em] mt-2">Intelligence Administration</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-10 shadow-2xl relative">
          {/* Top Indicator */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-900 border border-white/10 px-6 py-2 rounded-full flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
             <span className="text-[9px] font-black text-white uppercase tracking-widest whitespace-nowrap">Secure Login Portal</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-6 mt-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <ShieldCheck size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-red-400 leading-tight">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">ID Administrator</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type="text" 
                  required
                  placeholder="Username"
                  className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-14 pr-14 py-5 bg-white/5 border border-white/10 rounded-[2rem] text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all shadow-inner"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isAuthenticating}
                className={`relative w-full py-5 rounded-[2rem] overflow-hidden group transition-all duration-500 active:scale-95 ${
                  isAuthenticating 
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)]'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                
                <div className="relative flex items-center justify-center gap-3">
                  {isAuthenticating ? (
                    <>
                      <Cpu size={20} className="animate-spin" />
                      <span className="font-black text-sm uppercase tracking-[0.2em] italic">Verifying Session...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-black text-sm uppercase tracking-[0.2em] italic">Masuk ke Sistem</span>
                      <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
               <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer group/biometric">
                  <Fingerprint size={24} className="text-slate-400 group-hover/biometric:text-indigo-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Biometric</span>
               </div>
               <div className="w-px h-6 bg-white/5"></div>
               <div className="flex flex-col items-center gap-1 opacity-40 hover:opacity-100 transition-opacity cursor-pointer">
                  <Zap size={22} className="text-slate-400" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Bantuan AI</span>
               </div>
            </div>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
          <p>© 2026 Desa Wiratan Intelligence Hub</p>
          <p className="mt-1 opacity-50">Sistem ini dipantau secara otomatis oleh Machine Learning Unit</p>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Login;
