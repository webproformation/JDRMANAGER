import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, Send, ShieldAlert, CheckCircle2 } from 'lucide-react';

/**
 * ForgotPasswordPage - Standard PRESTIGE 4.3.6
 * Procédure de restauration des accès cryptographiques.
 */
export default function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      setSuccess(true);
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
            <Mail size={40} className="text-[#2DD4BF] drop-shadow-[0_0_8px_#2DD4BF]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter leading-none">
            Accès <span className="text-[#2DD4BF]">Perdu</span>
          </h1>
          <p className="text-silver/50 text-[10px] font-black uppercase tracking-[0.3em]">Restauration du lien de connexion</p>
        </div>

        {/* ALERTE ERREUR */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-[11px] font-bold flex items-center gap-3 animate-in slide-in-from-top-2">
            <ShieldAlert size={16} /> {error}
          </div>
        )}

        {/* MESSAGE DE SUCCÈS */}
        {success && (
          <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/50 text-[#2DD4BF] px-4 py-3 rounded-xl mb-6 text-[11px] font-bold flex items-center gap-3 animate-in zoom-in">
            <CheckCircle2 size={16} /> Transmission envoyée ! Vérifiez vos messages.
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* EMAIL */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1 flex items-center gap-2">
              <Mail size={12} /> Email de référence
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

          {/* BOUTON D'ENVOI */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#1B2A3F] font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1B2A3F]/20 border-t-[#1B2A3F] rounded-full animate-spin" />
                Transmission...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Restaurer l'accès <Send size={16} />
              </span>
            )}
          </button>
        </form>

        {/* FOOTER - RETOUR */}
        <div className="mt-10 pt-8 border-t border-white/5 text-center">
          <button
            onClick={() => onNavigate('/login')}
            className="text-silver/40 hover:text-[#2DD4BF] transition-all inline-flex items-center text-[11px] font-black uppercase tracking-[0.2em] group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}