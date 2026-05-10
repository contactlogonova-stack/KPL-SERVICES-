import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Eye, EyeOff, Loader2, Mail, ArrowLeft, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot password state
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState({ type: '', text: '' });
  const [isResetting, setIsResetting] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('Email ou mot de passe incorrect. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetting(true);
    setResetMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/update-password`,
      });

      if (error) throw error;

      setResetMessage({ 
        type: 'success', 
        text: 'Un email contenant le lien de réinitialisation vous a été envoyé. Vérifiez votre boîte de réception.' 
      });
      setResetEmail('');
    } catch (err: any) {
      setResetMessage({ 
        type: 'error', 
        text: 'Une erreur est survenue. Veuillez vérifier l\'adresse saisie ou réessayer plus tard.' 
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#E91E8C] mb-2">KPL SERVICES</h1>
          <p className="text-gray-500 font-medium">Dashboard Administration</p>
        </div>

        <div className="relative overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            {!isForgotPassword ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-pink-50 p-3 rounded-full">
                    <Lock className="w-8 h-8 text-[#E91E8C]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Connexion</h2>

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none transition-all"
                      placeholder="admin@kpl-services.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none transition-all pr-12"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError('');
                      }}
                      className="text-sm text-[#E91E8C] hover:text-[#D81B80] font-medium transition-colors"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#E91E8C] hover:bg-[#D81B80] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      'Se connecter'
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="reset"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-pink-50 p-3 rounded-full">
                    <KeyRound className="w-8 h-8 text-[#E91E8C]" />
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Mot de passe oublié</h2>
                <p className="text-gray-600 text-center mb-8 text-sm">
                  Entrez votre adresse email ci-dessous et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>

                {resetMessage.text && (
                  <div className={`p-4 rounded-lg mb-6 text-sm text-center ${resetMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {resetMessage.text}
                  </div>
                )}

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none transition-all"
                        placeholder="votre-email@kpl-services.com"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isResetting || resetMessage.type === 'success'}
                    className="w-full bg-[#E91E8C] hover:bg-[#D81B80] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center shadow-lg shadow-pink-500/30 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isResetting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      'Envoyer le lien'
                    )}
                  </button>

                  <div className="flex justify-center mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(false);
                        setResetMessage({ type: '', text: '' });
                      }}
                      className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2 transition-colors group"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      Retour à la connexion
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
