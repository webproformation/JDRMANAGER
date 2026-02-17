import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { UserPlus, Mail, Lock, User, ArrowLeft } from 'lucide-react';

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane p-4">
      <div className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <UserPlus size={48} className="mx-auto mb-4 text-cyan-light" />
          <h1 className="text-3xl font-bold text-cyan-light mb-2">Créer un compte</h1>
          <p className="text-silver">Rejoignez JDR Manager</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
            Compte créé avec succès ! Redirection...
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label className="block text-soft-white mb-2 font-medium">
              <User size={16} className="inline mr-2" />
              Nom complet
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-soft-white mb-2 font-medium">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <label className="block text-soft-white mb-2 font-medium">
              <Lock size={16} className="inline mr-2" />
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-soft-white mb-2 font-medium">
              <Lock size={16} className="inline mr-2" />
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-light hover:bg-cyan-400 text-night font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('/login')}
            className="text-silver hover:text-cyan-light transition-colors inline-flex items-center"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  );
}
