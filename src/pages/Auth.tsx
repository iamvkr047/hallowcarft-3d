import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { loginUser, signupUser } from '../appwrite/auth';
import { useAppDataStore } from '../zustand/store';
import { primaryBtn } from '../utils/btnUi';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { user, setUser } = useAppDataStore();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    if (isSignUp && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const res = await signupUser(name.trim(), email.trim(), password);
        if (res.success && res.data) {
          setUser(res.data);
          navigate('/dashboard');
        } else {
          setError(res.message || 'Failed to create account. Please try again.');
        }
      } else {
        const res = await loginUser(email.trim(), password);
        if (res.success && res.data) {
          setUser(res.data);
          navigate('/dashboard');
        } else {
          setError(res.message || 'Invalid email or password.');
        }
      }
    } catch (err) {
      setError((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-stone-950 text-stone-100 flex flex-col justify-center items-center px-4 py-8 select-none relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Container */}
      <div className="relative w-full max-w-md bg-stone-900/90 border border-stone-800/90 backdrop-blur-xl rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow-lg shadow-orange-950/60 mb-3">
            <Flame className="w-7 h-7 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-xs text-stone-400 mt-1">
            {isSignUp
              ? 'Join HallowCraft to craft and showcase your pumpkin stickers'
              : 'Sign in to continue crafting and managing your crafts'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-stone-950/80 border border-stone-800 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              !isSignUp
                ? 'bg-stone-800 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              isSignUp ? 'bg-stone-800 text-white shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-950/50 border border-red-800/60 text-red-300 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Spooky Crafter"
                  className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/50 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="crafter@pumpkin.com"
                className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-500">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-10 py-2.5 text-sm text-stone-100 placeholder-stone-600 focus:outline-none focus:border-orange-500/70 focus:ring-1 focus:ring-orange-500/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${primaryBtn} w-full mt-2`}
            // className="w-full mt-2 py-2.5 px-4 bg-orange-600 hover:bg-orange-500 disabled:bg-orange-600/50 text-white font-medium rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
              </>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 text-center">
          <Link to="/" className="text-xs text-stone-400 hover:text-stone-200 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
