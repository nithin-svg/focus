import React from 'react';
import { ShieldCheck, PhoneCall, Mail, Award, Lock, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      {/* Value Badges Banner */}
      <div className="border-b border-slate-800/80 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:text-left">
            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-focus-500/10 text-focus-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-xs sm:text-sm">100% Genuine Care</p>
                <p className="text-[11px] text-slate-400">OEM Certified Technicians</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-focus-500/10 text-focus-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-xs sm:text-sm">Bank-Grade Security</p>
                <p className="text-[11px] text-slate-400">256-Bit Encrypted Payments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-focus-500/10 text-focus-400 flex items-center justify-center">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-xs sm:text-sm">Instant Extension</p>
                <p className="text-[11px] text-slate-400">Real-time Policy Activation</p>
              </div>
            </div>

            <div className="flex items-center gap-3 justify-center md:justify-start">
              <div className="w-10 h-10 rounded-xl bg-focus-500/10 text-focus-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-slate-200 text-xs sm:text-sm">Doorstep Service</p>
                <p className="text-[11px] text-slate-400">Free Pickup & Fast Repair</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-focus-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-black tracking-tight text-white">
                FOCUS<span className="text-focus-400">SYSTEM</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Focus System Warranty & Protection Services provides seamless product registration, digital certificate verification, and comprehensive multi-year extended coverage for premium electronics and enterprise hardware.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Support & Helpline</h4>
            <div className="flex items-center gap-2 text-slate-300">
              <PhoneCall className="w-4 h-4 text-focus-400" />
              <span>1800-419-FOCUS (24x7 Toll Free)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-4 h-4 text-focus-400" />
              <span>support@focussystem.com</span>
            </div>
            <p className="text-slate-400 text-[11px] pt-1">
              Focus Systems Technology Towers, Cyber Gateway, Bengaluru, KA 560100
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px]">Authorized Categories</h4>
            <div className="flex flex-wrap gap-1.5">
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 text-[11px]">Refrigerator Voltage Stabilizers</span>
              <span className="px-2 py-1 bg-slate-800 rounded text-slate-300 text-[11px]">TV Voltage Stabilizers (32" - 65")</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Focus System Global Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-200 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Terms of Warranty</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Claim Guidelines</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
