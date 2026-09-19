import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Sparkles,
  Phone
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('demo@focussystem.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError('Please enter your email or phone number and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(identifier.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failure:', err);
      setError(err.response?.data?.detail || 'Invalid credentials. Please verify your email/phone and password.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (type) => {
    if (type === 'email') {
      setIdentifier('demo@focussystem.com');
      setPassword('password123');
    } else {
      setIdentifier('+91 98765 43210');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-6 lg:p-8 gradient-mesh">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl sm:rounded-3xl shadow-elevated border border-slate-200/80 overflow-hidden">
        
        {/* Left Brand Showcase Banner (Visible on Desktop / Tablets) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-focus-950 via-focus-900 to-navy-900 text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          {/* Ambient light glow */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-focus-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Logo */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 mb-6">
              <ShieldCheck className="w-5 h-5 text-focus-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Commercial Portal
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Enterprise Warranty Protection, Reimagined.
            </h2>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Extend warranties across premium Voltage Stabilizers (Refrigerator & TV) with instant digital certificates.
            </p>
          </div>

          {/* Benefits Feature List */}
          <div className="relative z-10 space-y-3.5 my-8">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-focus-600/30 border border-focus-400/30 flex items-center justify-center text-focus-300 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">Multi-Year Extension Tiers</p>
                <p className="text-[11px] text-slate-400">Choose from 6 Months to 3 Years flexible coverage.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-focus-600/30 border border-focus-400/30 flex items-center justify-center text-focus-300 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">Verified Cryptographic Certificates</p>
                <p className="text-[11px] text-slate-400">Download authentic PDF certificates on demand.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-focus-600/30 border border-focus-400/30 flex items-center justify-center text-focus-300 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-100">Razorpay & Bank Ready</p>
                <p className="text-[11px] text-slate-400">Instant policy activation upon payment clearance.</p>
              </div>
            </div>
          </div>

          {/* Footer test credentials banner */}
          <div className="relative z-10 pt-4 border-t border-white/10">
            <p className="text-[11px] font-bold text-focus-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Quick Demo Testing
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('email')}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all"
              >
                Use Demo Email
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('phone')}
                className="px-2.5 py-1 text-[11px] rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 transition-all"
              >
                Use Demo Phone
              </button>
            </div>
          </div>
        </div>

        {/* Right Form Area (Mobile Friendly) */}
        <div className="lg:col-span-7 p-5 sm:p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-xl bg-focus-600 flex items-center justify-center text-white shadow-xs">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  FOCUS<span className="text-focus-600">SYSTEM</span>
                </h1>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Customer Sign In
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Access your registered warranties, extend coverage, and download certificates.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email / Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address or Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="name@example.com or +91 9876543210"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-focus-500 focus:border-transparent transition-all shadow-xs"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(true)}
                    className="text-xs font-bold text-focus-600 hover:text-focus-700 hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-focus-500 focus:border-transparent transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-focus-600 focus:ring-focus-500 border-slate-300"
                  />
                  Keep me signed in on this device
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-focus-600 hover:bg-focus-700 text-white font-bold text-sm shadow-md shadow-focus-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 pt-3"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In to Focus System</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Create Account Link */}
            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600 font-medium">
                Don't have a Focus System customer account?{' '}
                <Link
                  to="/register"
                  className="font-bold text-focus-600 hover:text-focus-700 hover:underline"
                >
                  Create Account Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
            {forgotSubmitted ? (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs border border-emerald-200">
                  Password reset verification link has been sent to your registered email/phone!
                </div>
                <button
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSubmitted(false);
                  }}
                  className="w-full py-2 bg-slate-800 text-white font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-500">
                  Enter your registered email address or phone number to receive a secure recovery code.
                </p>
                <input
                  type="text"
                  placeholder="Enter registered email or phone"
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-focus-500"
                />
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="w-1/2 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSubmitted(true)}
                    className="w-1/2 py-2.5 bg-focus-600 text-white font-bold rounded-xl text-xs hover:bg-focus-700 shadow-xs"
                  >
                    Send Reset Link
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
