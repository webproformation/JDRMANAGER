import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Mail, Lock, Trash2, Save } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';

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

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        avatarUrl: user.user_metadata?.avatar_url || '',
      });
    }
  }, [user]);

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
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-cyan-light mb-2">Paramètres du compte</h1>
        <p className="text-silver">Gérez vos informations personnelles et votre sécurité</p>
      </div>

      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid gap-6">
        <div className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-soft-white mb-4 flex items-center">
            <User className="mr-2" size={24} />
            Informations personnelles
          </h2>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-soft-white mb-2 font-medium">
                Nom complet
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
              />
            </div>

            <div>
              <label className="block text-soft-white mb-2 font-medium">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-silver cursor-not-allowed opacity-60"
              />
              <p className="text-sm text-silver mt-1">L'email ne peut pas être modifié</p>
            </div>

            <div>
              <ImageUpload
                label="Photo de profil"
                value={formData.avatarUrl}
                onChange={(url) => setFormData({ ...formData, avatarUrl: url })}
                bucket="avatars"
                maxSize={2097152}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-light hover:bg-cyan-400 text-night font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </form>
        </div>

        <div className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-soft-white mb-4 flex items-center">
            <Lock className="mr-2" size={24} />
            Changer le mot de passe
          </h2>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-soft-white mb-2 font-medium">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-soft-white mb-2 font-medium">
                Confirmer le nouveau mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-cyan-light hover:bg-cyan-400 text-night font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center"
            >
              <Lock size={16} className="mr-2" />
              {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
            </button>
          </form>
        </div>

        <div className="bg-night bg-opacity-60 backdrop-blur-sm border border-red-500 border-opacity-50 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center">
            <Trash2 className="mr-2" size={24} />
            Zone de danger
          </h2>

          <p className="text-silver mb-4">
            La suppression de votre compte est irréversible. Toutes vos données seront définitivement supprimées.
          </p>

          <button
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg transition-colors inline-flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Supprimer mon compte
          </button>
        </div>
      </div>
    </div>
  );
}
