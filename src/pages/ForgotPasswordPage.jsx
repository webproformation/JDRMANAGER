import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-night via-night to-arcane">
      <div className="bg-night bg-opacity-60 backdrop-blur-sm border border-arcane border-opacity-50 p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <Mail size={48} className="mx-auto mb-4 text-cyan-light" />
          <h1 className="text-3xl font-bold text-cyan-light mb-2">Mot de passe oublié</h1>
          <p className="text-silver">Entrez votre email pour réinitialiser votre mot de passe</p>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded mb-4">
            Un email de réinitialisation a été envoyé ! Vérifiez votre boîte de réception.
          </div>
        )}

        <form onSubmit={handleResetPassword} className="space-y-6">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-light hover:bg-cyan-400 text-night font-bold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
          >
            <Send size={16} className="mr-2" />
            {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
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
