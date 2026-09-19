import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (p) => {
    const clean = p.replace(/\D/g, '');
    return clean.length >= 10;
  };

  const validateEmail = (e) => {
    return /\S+@\S+\.\S+/.test(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Please provide your full legal name.');
      return;
    }
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify and retype.');
      return;
    }
    if (!agreeTerms) {
      setError('You must agree to the Focus System Terms & Warranty Policy.');
      return;
    }

    setLoading(true);

    try {
      await register(fullName.trim(), phone.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.detail || 'Failed to create account. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password strength check
  const hasMinLength = password.length >= 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-3 sm:p-6 lg:p-8 gradient-mesh">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-2xl sm:rounded-3xl shadow-elevated border border-slate-200/80 overflow-hidden">
        
        {/* Left Information Panel (Desktop/Tablet) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-focus-950 via-focus-900 to-navy-900 text-white p-8 sm:p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-focus-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 mb-6">
              <ShieldCheck className="w-5 h-5 text-focus-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Customer Enrollment
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Create Your Customer Protection Account
            </h2>
            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              Register your Voltage Stabilizers, calculate instant warranty extension pricing, and manage digital certificates.
            </p>
          </div>

          <div className="relative z-10 space-y-4 my-8">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs space-y-2">
              <p className="text-xs font-bold text-focus-300 uppercase tracking-wider">
                What You Get as a Member:
              </p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Instant warranty validation for Voltage Stabilizers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Dynamic 6-month to 3-year extension plans
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Official printable & downloadable PDF certificates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  Priority 24/7 technical customer support
                </li>
              </ul>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 text-xs text-slate-400">
            <span>Already have an active warranty? </span>
            <Link to="/login" className="text-white font-bold hover:underline">
              Log in here
            </Link>
          </div>
        </div>

        {/* Right Registration Form */}
        <div className="lg:col-span-7 p-5 sm:p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            
            <div className="mb-6">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Create Customer Account
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your details to register and begin extending product coverage.
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rajesh Kumar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-focus-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone & Email in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-focus-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-focus-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password & Confirm Password in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 chars"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-focus-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium placeholder-slate-400 focus:ring-2 focus:ring-focus-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Password checks mini-pills */}
              {password && (
                <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                  <span className={`flex items-center gap-1 ${hasMinLength ? 'text-emerald-600 font-bold' : ''}`}>
                    <Check className="w-3 h-3" /> 6+ chars
                  </span>
                  <span className={`flex items-center gap-1 ${hasLetter && hasNumber ? 'text-emerald-600 font-bold' : ''}`}>
                    <Check className="w-3 h-3" /> Letters & numbers
                  </span>
                  {confirmPassword && password === confirmPassword && (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="w-3 h-3" /> Passwords match
                    </span>
                  )}
                </div>
              )}

              {/* Terms Checkbox */}
              <div className="pt-2">
                <label className="flex items-start gap-2 text-xs font-medium text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-focus-600 focus:ring-focus-500 border-slate-300"
                  />
                  <span>
                    I agree to the Focus System{' '}
                    <span className="text-focus-600 font-bold hover:underline cursor-pointer">Terms of Service</span> and{' '}
                    <span className="text-focus-600 font-bold hover:underline cursor-pointer">Warranty Protection Policies</span>.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-focus-600 hover:bg-focus-700 text-white font-bold text-sm shadow-md shadow-focus-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Your Account...
                  </>
                ) : (
                  <>
                    <span>Register Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600 font-medium">
                Already registered?{' '}
                <Link
                  to="/login"
                  className="font-bold text-focus-600 hover:text-focus-700 hover:underline"
                >
                  Sign In to Your Dashboard
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
