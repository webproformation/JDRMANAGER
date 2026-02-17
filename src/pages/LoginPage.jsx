import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';

export default function LoginPage({ onNavigate, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane">
      <div className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <LogIn size={48} className="mx-auto mb-4 text-cyan-light" />
          <h1 className="text-3xl font-bold text-cyan-light mb-2">Connexion</h1>
          <p className="text-silver">Connectez-vous à votre compte JDR Manager</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-soft-white mb-2 font-medium">
              <Mail size={16} className="inline mr-2" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 pr-12 bg-night border border-arcane rounded-lg text-soft-white focus:outline-none focus:border-cyan-light transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-silver hover:text-cyan-light transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/forgot-password')}
            className="text-cyan-light hover:text-cyan-400 text-sm transition-colors"
          >
            Mot de passe oublié ?
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-light hover:bg-cyan-400 text-night font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('/register')}
            className="text-silver hover:text-cyan-light transition-colors inline-flex items-center"
          >
            <UserPlus size={16} className="mr-2" />
            Créer un compte
          </button>
        </div>
      </div>
    </div>
  );
}
