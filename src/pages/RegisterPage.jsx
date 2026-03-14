import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Mail, Lock, User, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RegisterPage({ onNavigate, onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const globalBackgroundStyle = {
    background: 'linear-gradient(135deg, #1B2A3F 0%, #583B84 100%)',
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        setSuccess(true);
        setTimeout(() => {
          onLogin(data.user);
          onNavigate('/');
        }, 2000);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={globalBackgroundStyle}>
      {/* CARTE PRESTIGE */}
      <div className="bg-black/40 backdrop-blur-3xl border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-500">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-[#2DD4BF]/10 rounded-2xl mb-6 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
            <UserPlus size={40} className="text-[#2DD4BF] drop-shadow-[0_0_8px_#2DD4BF]" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Créer un profil</h1>
          <p className="text-silver/50 text-[10px] font-black uppercase tracking-[0.2em]">Rejoignez le Multivers</p>
        </div>

        {/* MESSAGES D'ALERTE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-xs font-bold animate-in slide-in-from-top-2">
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="bg-[#2DD4BF]/10 border border-[#2DD4BF]/50 text-[#2DD4BF] px-4 py-3 rounded-xl mb-6 text-xs font-bold flex items-center gap-3 animate-pulse">
            <ShieldCheck size={18} />
            Accès autorisé ! Redirection en cours...
          </div>
        )}

        {/* FORMULAIRE */}
        <form onSubmit={handleRegister} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1">
              Nom complet
            </label>
            <div className="relative">
              <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 focus:ring-1 focus:ring-[#2DD4BF]/20 transition-all font-bold"
                placeholder="Ex: Elminster d'Aumar"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1">
              Email
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 focus:ring-1 focus:ring-[#2DD4BF]/20 transition-all font-bold"
                placeholder="votre@sphère.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 focus:ring-1 focus:ring-[#2DD4BF]/20 transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-[#2DD4BF] uppercase tracking-widest ml-1">
                Confirmation
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-black/20 border border-white/5 rounded-xl text-white placeholder:text-white/10 focus:outline-none focus:border-[#2DD4BF]/50 focus:ring-1 focus:ring-[#2DD4BF]/20 transition-all font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-[#2DD4BF] hover:bg-[#2DD4BF]/90 text-[#1B2A3F] font-black uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#2DD4BF]/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1B2A3F]/20 border-t-[#1B2A3F] rounded-full animate-spin" />
                Incantation...
              </span>
            ) : (
              'Créer mon compte'
            )}
          </button>
        </form>

        {/* LIEN DE RETOUR */}
        <div className="mt-8 text-center">
          <button
            onClick={() => onNavigate('/login')}
            className="text-silver/40 hover:text-[#2DD4BF] transition-colors inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] group"
          >
            <ArrowLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}