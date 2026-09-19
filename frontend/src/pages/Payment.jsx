import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  Lock, 
  Calendar, 
  Hash, 
  Laptop, 
  CheckCircle2, 
  Sparkles, 
  Award, 
  AlertCircle
} from 'lucide-react';
import RazorpayCheckoutModal from '../components/RazorpayCheckoutModal';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const warrantyData = stateData.warrantyData || {
    customer_name: 'Rajesh Kumar',
    customer_phone: '+91 98765 43210',
    customer_email: 'demo@focussystem.com',
    product_name: 'Apple MacBook Pro 16" M3 Max',
    product_category: 'Laptops & Computers',
    serial_number: 'FS-AAPL-77341',
    purchase_date: '2025-05-15',
    current_warranty_expiry: '2026-05-15',
    extension_period: '1 Year',
    amount_paid: 2948.82,
    payment_method: 'Razorpay Gateway'
  };

  const pricing = stateData.pricing || {
    base_price: 2999.0,
    tax_amount: 449.82,
    discount_amount: 500.0,
    total_amount: 2948.82,
    new_expiry_date: '2027-05-15',
    coverage_features: [
      '100% Genuine OEM Parts Guarantee',
      'Free Doorstep Pickup & Fast Delivery',
      'Unlimited Repair Requests Coverage',
      'Official Cryptographic Certificate'
    ]
  };

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const handlePaymentSuccess = (confirmationData) => {
    setCheckoutModalOpen(false);
    navigate('/success', {
      state: {
        confirmation: confirmationData,
        warrantyData: warrantyData,
        pricing: pricing
      },
      replace: true
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            to="/extend-warranty"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-focus-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Modify Details / Back to Form</span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL Encrypted Checkout</span>
          </div>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Order Review & Payment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your extended warranty parameters before proceeding to the Razorpay gateway.
          </p>
        </div>

        {/* Main Review Card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-3xl border border-slate-200/80 shadow-elevated overflow-hidden">
          
          {/* Left Summary Details */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[11px] font-bold text-focus-700 uppercase tracking-wider">
                Product Specification
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {warrantyData.product_name}
              </h2>
              <p className="text-xs text-slate-500">{warrantyData.product_category}</p>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <div>
                <p className="text-slate-400 font-medium">Serial Number</p>
                <p className="font-mono font-bold text-slate-800 text-sm mt-0.5">{warrantyData.serial_number}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Beneficiary Name</p>
                <p className="font-bold text-slate-800 text-sm mt-0.5">{warrantyData.customer_name}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Current Warranty Expiry</p>
                <p className="font-semibold text-slate-700 mt-0.5">{warrantyData.current_warranty_expiry}</p>
              </div>
              <div>
                <p className="text-slate-400 font-medium">Selected Extension</p>
                <p className="font-bold text-focus-700 mt-0.5">{warrantyData.extension_period} Extended</p>
              </div>
            </div>

            {/* New Expiry Highlight */}
            <div className="p-4 bg-focus-50 rounded-2xl border border-focus-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-focus-900">New Extended Expiry Date</p>
                <p className="text-xs text-focus-700">Valid until this date with complete coverage</p>
              </div>
              <span className="px-3 py-1.5 rounded-xl bg-focus-600 text-white font-extrabold text-sm shadow-xs">
                {pricing.new_expiry_date}
              </span>
            </div>

            {/* Coverage Perks */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Coverage Inclusions
              </p>
              <div className="space-y-1.5 text-xs text-slate-600">
                {pricing.coverage_features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Payment Bill Breakdown */}
          <div className="md:col-span-5 bg-slate-900 text-white p-6 sm:p-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-focus-400" />
                  <span className="text-sm font-bold text-white">Focus System Invoice</span>
                </div>
                <span className="text-xs font-mono text-focus-400 bg-focus-500/10 px-2 py-0.5 rounded border border-focus-500/20">
                  Ready to Pay
                </span>
              </div>

              {/* Breakdown */}
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Base Price ({warrantyData.extension_period})</span>
                  <span className="font-semibold text-white">₹{pricing.base_price?.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Promotional Tier Savings</span>
                  <span>-₹{pricing.discount_amount?.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between">
                  <span>GST & Service Taxes (18%)</span>
                  <span className="font-semibold text-white">+₹{pricing.tax_amount?.toLocaleString('en-IN')}</span>
                </div>

                <div className="border-t border-slate-800 pt-4 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase">Final Payable Amount</p>
                    <p className="text-[10px] text-slate-500">Includes Instant Digital Certificate</p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-3xl font-black text-white">
                      ₹{pricing.total_amount?.toLocaleString('en-IN')}
                    </h3>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Gateway Trigger Button */}
            <div className="pt-8 space-y-3">
              <button
                onClick={() => setCheckoutModalOpen(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-focus-500 to-sky-400 hover:from-focus-600 hover:to-sky-500 text-white font-extrabold text-sm shadow-lg shadow-focus-500/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹{pricing.total_amount?.toLocaleString('en-IN')} with Razorpay</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supports UPI, Cards, NetBanking, and Wallets</span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Razorpay Gateway Modal */}
      <RazorpayCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        warrantyData={warrantyData}
        pricing={pricing}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default Payment;
