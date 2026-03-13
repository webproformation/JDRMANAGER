import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Mail, Lock, Trash2, Save, Sparkles, Monitor } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import MediaScreensaver from '../components/MediaScreensaver'; // AJOUTÉ V4.2

export default function UserSettingsPage({ user, onLogout, onNavigate }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    avatarUrl: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // État pour l'économiseur d'écran (Manuel)
  const [showScreensaver, setShowScreensaver] = useState(false);

  // État pour l'activation automatique (Persisté localement)
  const [autoScreensaver, setAutoScreensaver] = useState(
    localStorage.getItem('prestige_auto_screensaver') === 'true'
  );

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
      });
    }
  }, [user]);

  // Bascule de l'économiseur automatique
  const handleToggleScreensaver = () => {
    const newVal = !autoScreensaver;
    setAutoScreensaver(newVal);
    localStorage.setItem('prestige_auto_screensaver', newVal);
    setSuccess('Préférences d\'interface mises à jour.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          avatar_url: formData.avatarUrl,
        },
      });

      if (error) throw error;

      setSuccess('Profil mis à jour avec succès !');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });

      if (error) throw error;

      setSuccess('Mot de passe mis à jour avec succès !');
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      return;
    }

    try {
      const { error } = await supabase.rpc('delete_user');
      if (error) throw error;

      await supabase.auth.signOut();
      onLogout();
      onNavigate('/login');
    } catch (error) {
      setError('Impossible de supprimer le compte. Veuillez contacter l\'administrateur.');
    }
  };

  return (
    // CORRECTIF MOBILE : pt-24 pour libérer le bouton de navigation
    <div className="max-w-4xl mx-auto p-6 pt-24 md:pt-10 animate-in fade-in duration-700">
      
      {/* Économiseur d'écran (Overlay) */}
      <MediaScreensaver 
        isOpen={showScreensaver} 
        onClose={() => setShowScreensaver(false)} 
      />

      <div className="mb-8 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-[#2dd4bf] uppercase tracking-tighter mb-2">Paramètres du compte</h1>
          <p className="text-silver/60 font-medium">Gérez vos informations personnelles et votre sécurité</p>
        </div>

        {/* --- BLOC CONFIGURATION ÉCONOMISEUR AUTOMATIQUE --- */}
        <div className="bg-[#2dd4bf]/5 border border-[#2dd4bf]/20 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-[#2dd4bf]/10 rounded-2xl text-[#2dd4bf]">
              <Monitor size={24} />
            </div>
            <div>
              <h3 className="text-soft-white font-black uppercase tracking-widest text-sm">Chroniques Visuelles Automatiques</h3>
              <p className="text-silver/50 text-xs mt-1 max-w-sm">Lance l'économiseur d'écran après 60 secondes d'inactivité de la souris.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Toggle Switch Prestige */}
            <button
              onClick={handleToggleScreensaver}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-500 focus:outline-none ${
                autoScreensaver ? 'bg-[#2dd4bf] shadow-[0_0_15px_rgba(45,212,191,0.4)]' : 'bg-white/10'
              }`}
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 ${
                autoScreensaver ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>

            {/* Bouton Test Manuel */}
            <button
              onClick={() => setShowScreensaver(true)}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#2dd4bf] transition-all"
            >
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest">Tester</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl mb-6 font-bold flex items-center gap-3 animate-shake">
          <Trash2 size={18} /> {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500/30 text-green-400 px-5 py-4 rounded-2xl mb-6 font-bold">
          {success}
        </div>
      )}

      <div className="grid gap-8">
        {/* Informations personnelles */}
        <div className="bg-[#242643]/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-xl font-black text-soft-white mb-6 flex items-center uppercase tracking-tighter">
            <User className="mr-3 text-[#2dd4bf]" size={24} />
            Informations personnelles
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] ml-1">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-5 py-3 bg-black/40 border border-white/5 rounded-xl text-soft-white focus:outline-none focus:border-[#2dd4bf]/50 transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] ml-1">
                  Email (Identifiant)
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full pl-12 pr-5 py-3 bg-white/5 border border-white/5 rounded-xl text-silver/40 cursor-not-allowed italic"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <ImageUpload
                label="Avatar du Profil"
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                bucket="avatars"
                maxSize={2097152}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 px-10 rounded-2xl transition-all disabled:opacity-50 shadow-lg shadow-teal-900/20 inline-flex items-center gap-3"
            >
              <Save size={16} />
              {loading ? 'Synchronisation...' : 'Enregistrer le profil'}
            </button>
          </form>
        </div>

        {/* Changer le mot de passe */}
        <div className="bg-[#242643]/40 backdrop-blur-md border border-white/5 p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-xl font-black text-soft-white mb-6 flex items-center uppercase tracking-tighter">
            <Lock className="mr-3 text-[#2dd4bf]" size={24} />
            Sécurité du compte
          </h2>

          <form onSubmit={handleUpdatePassword} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] ml-1">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-5 py-3 bg-black/40 border border-white/5 rounded-xl text-soft-white focus:outline-none focus:border-[#2dd4bf]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em] ml-1">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-5 py-3 bg-black/40 border border-white/5 rounded-xl text-soft-white focus:outline-none focus:border-[#2dd4bf]/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 px-10 rounded-2xl border border-white/10 transition-all disabled:opacity-50 inline-flex items-center gap-3"
            >
              <Lock size={16} />
              {loading ? 'Mise à jour...' : 'Modifier le mot de passe'}
            </button>
          </form>
        </div>

        {/* Zone de danger */}
        <div className="bg-red-500/5 backdrop-blur-md border border-red-500/20 p-8 rounded-[2rem] shadow-2xl">
          <h2 className="text-xl font-black text-red-400 mb-4 flex items-center uppercase tracking-tighter">
            <Trash2 className="mr-3" size={24} />
            Zone de danger
          </h2>

          <p className="text-silver/60 text-sm mb-6 max-w-xl">
            La suppression de votre compte est irréversible. Toutes vos archives, mondes et personnages liés seront définitivement effacés du Multivers.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-[0.2em] text-[10px] py-4 px-10 rounded-2xl transition-all shadow-lg shadow-red-900/40 inline-flex items-center gap-3"
          >
            <Trash2 size={16} />
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}