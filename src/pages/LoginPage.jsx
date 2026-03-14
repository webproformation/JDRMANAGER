import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, UserPlus, Eye, EyeOff, ShieldCheck } from 'lucide-react';

/**
 * LoginPage - Standard PRESTIGE 4.3.6
 * Portail d'accès sécurisé au Multivers.
 */
export default function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin(data.user);
        onNavigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={globalBackgroundStyle}>
      {/* CARTE PRESTIGE GLASSMORPHISM */}
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* HEADER IMMERSIF */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-[#2DD4BF]/10 rounded-2xl mb-6 shadow-[0_0_30px_rgba(45,212,191,0.2)] animate-pulse-slow">
            <LogIn size={40} className="text-[#2DD4BF] drop-shadow-[0_0_8px_#2DD4BF]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 uppercase tracking-tighter leading-none">
            Portail de <span className="text-[#2DD4BF]">Connexion</span>
          </h1>
          <p className="text-silver/50 text-[10px] font-black uppercase tracking-[0.3em]">Accédez à vos Chroniques Universelles</p>
        </div>

        {/* ALERTE ERREUR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-[11px] font-bold animate-in slide-in-from-top-2">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1 flex items-center gap-2">
              <Mail size={12} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 focus:ring-1 focus:ring-[#2DD4BF]/20 transition-all font-bold"
              placeholder="votre@sphère.com"
            />
          </div>

          {/* MOT DE PASSE */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1 flex items-center gap-2">
              <Lock size={12} /> Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-5 pr-12 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 focus:ring-1 focus:ring-[#2DD4BF]/20 transition-all font-bold"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-[#2DD4BF] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* OPTIONS SUPPLÉMENTAIRES */}
          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => onNavigate('/forgot-password')}
              className="text-silver/40 hover:text-[#2DD4BF] text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Identifiants oubliés ?
            </button>
          </div>

          {/* BOUTON D'ACCÈS */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#1B2A3F] font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1B2A3F]/20 border-t-[#1B2A3F] rounded-full animate-spin" />
                Déchiffrement...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Autoriser l'accès <LogIn size={16} />
              </span>
            )}
          </button>
        </form>

        {/* FOOTER - CRÉATION DE COMPTE */}
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <button
            onClick={() => onNavigate('/register')}
            className="text-silver/40 hover:text-[#2DD4BF] transition-all inline-flex items-center text-[11px] font-black uppercase tracking-[0.2em] group"
          >
            <UserPlus size={14} className="mr-2 group-hover:scale-110 transition-transform" />
            Initier un nouveau profil
          </button>
        </div>
      </div>
    </div>
  );
}