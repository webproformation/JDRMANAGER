import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, UserPlus, Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';

/**
 * LoginPage - Standard PRESTIGE 4.5.9
 * Portail d'accès sécurisé au Multivers.
 * CONFIGURATION : Accès direct (sans vidéo) + Dégradé Magique Signature.
 */
export default function LoginPage({ onNavigate, onLogin }) {
  // --- ÉTATS D'AUTHENTIFICATION ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- STYLE DE FOND MAGIQUE (RESTAURÉ) ---
  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  // --- LOGIQUE DE CONNEXION ---
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
    <div className="relative flex items-center justify-center min-h-screen p-4 overflow-hidden" style={globalBackgroundStyle}>
      
      {/* --- ÉLÉMENTS DE DÉCOR D'ARRIÈRE-PLAN --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2DD4BF]/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />
      </div>

      {/* --- CARTE DE CONNEXION GLASSMORPHISM --- */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
          
          {/* HEADER IMMERSIF */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-[#2DD4BF]/10 rounded-3xl mb-6 shadow-[0_0_30px_rgba(45,212,191,0.15)] border border-[#2DD4BF]/20">
              <LogIn size={42} className="text-[#2DD4BF] drop-shadow-[0_0_8px_#2DD4BF]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 uppercase tracking-tighter leading-none">
              Accès <span className="text-[#2DD4BF]">MJ</span>
            </h1>
            <p className="text-silver/40 text-[10px] font-black uppercase tracking-[0.3em]">Moteur de Gestion Multiverselle</p>
          </div>

          {/* ALERTE ERREUR */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-[11px] font-bold text-center animate-shake">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#2DD4BF]/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} /> Identifiant
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-4 bg-black/20 border border-white/5 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 transition-all font-bold shadow-inner"
                placeholder="votre@sphère.com"
              />
            </div>

            {/* MOT DE PASSE */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-[#2DD4BF]/60 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Lock size={12} /> Clé Secrète
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-5 pr-12 py-4 bg-black/20 border border-white/5 rounded-2xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 transition-all font-bold shadow-inner"
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
                className="text-silver/30 hover:text-[#2DD4BF] text-[9px] font-black uppercase tracking-widest transition-colors"
              >
                Mémoire défaillante ?
              </button>
            </div>

            {/* BOUTON D'ACCÈS */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#1B2A3F] font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Déchiffrement...
                  </>
                ) : (
                  <>
                    Invoquer le Lore <LogIn size={18} />
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
          </form>

          {/* FOOTER - CRÉATION DE COMPTE */}
          <div className="mt-12 pt-8 border-t border-white/5 text-center flex flex-col gap-4 items-center">
            <button
              onClick={() => onNavigate('/register')}
              className="text-silver/40 hover:text-[#2DD4BF] transition-all inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] group"
            >
              <UserPlus size={14} className="mr-2 group-hover:scale-110 transition-transform" />
              Initier un nouveau profil
            </button>
            
            <div className="flex items-center gap-2 opacity-20 mt-4">
              <Sparkles size={10} className="text-[#2DD4BF]" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white">V4.5.9 PRESTIGE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}