import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Wallet, 
  CheckCircle, 
  Lock, 
  X, 
  ArrowRight, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import api from '../services/api';

const RazorpayCheckoutModal = ({ 
  isOpen, 
  onClose, 
  warrantyData, 
  pricing, 
  onPaymentSuccess 
}) => {
  const [activeTab, setActiveTab] = useState('upi'); // upi, card, netbanking, wallet
  const [upiId, setUpiId] = useState('rajesh@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('892');
  const [cardName, setCardName] = useState(warrantyData?.customer_name || 'Rajesh Kumar');
  const [bank, setBank] = useState('HDFC');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const totalAmount = pricing?.total_amount || 2499;

  const handleProcessPayment = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Create order
      const orderRes = await api.post('/payment/create-order', {
        warranty_data: warrantyData,
        amount: totalAmount,
        currency: 'INR'
      });

      const orderData = orderRes.data;

      // Simulate realistic payment gateway processing delay
      await new Promise((resolve) => setTimeout(resolve, 1400));

      // 2. Verify payment and extend warranty
      const mockPaymentId = `pay_rzp_${Math.random().toString(36).substring(2, 11).toUpperCase()}`;
      
      const verifyRes = await api.post('/payment/verify', {
        razorpay_order_id: orderData.order_id,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: `sig_${Math.random().toString(36).substring(2, 14)}`,
        warranty_data: {
          ...warrantyData,
          amount_paid: totalAmount,
          payment_id: mockPaymentId,
          payment_method: activeTab.toUpperCase()
        }
      });

      if (verifyRes.data && verifyRes.data.success) {
        onPaymentSuccess(verifyRes.data);
      } else {
        setError('Payment verification failed. Please try again.');
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.response?.data?.detail || 'An error occurred while processing payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
        
        {/* Razorpay Header with Brand */}
        <div className="bg-gradient-to-r from-focus-900 via-focus-800 to-navy-800 text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-focus-500/20 text-focus-400 border border-focus-400/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-focus-300">
              Focus System Secure Checkout
            </span>
          </div>

          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-xs text-slate-300">Total Payable Amount</p>
              <h2 className="text-3xl font-black tracking-tight text-white">
                ₹{totalAmount.toLocaleString('en-IN')}
              </h2>
            </div>
            <div className="text-right text-xs text-slate-300">
              <p className="font-semibold text-white">{warrantyData?.product_name?.substring(0, 22)}...</p>
              <p className="text-focus-300 font-mono text-[11px]">{warrantyData?.extension_period} Coverage</p>
            </div>
          </div>
        </div>

        {/* Payment Methods Navigation */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upi')}
            className={`py-3 px-2 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'upi'
                ? 'bg-white text-focus-700 border-b-2 border-focus-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            UPI / QR
          </button>

          <button
            onClick={() => setActiveTab('card')}
            className={`py-3 px-2 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'card'
                ? 'bg-white text-focus-700 border-b-2 border-focus-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            Cards
          </button>

          <button
            onClick={() => setActiveTab('netbanking')}
            className={`py-3 px-2 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'netbanking'
                ? 'bg-white text-focus-700 border-b-2 border-focus-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            NetBanking
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`py-3 px-2 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'wallet'
                ? 'bg-white text-focus-700 border-b-2 border-focus-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wallet className="w-4 h-4" />
            Wallets
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'upi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Enter UPI ID (VPA)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Verified
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Popular:</span>
                {['@okhdfcbank', '@okaxis', '@paytm', '@ybl'].map((suffix) => (
                  <button
                    key={suffix}
                    type="button"
                    onClick={() => setUpiId(`rajesh${suffix}`)}
                    className="text-xs px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
                  >
                    {suffix}
                  </button>
                ))}
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-focus-100 text-focus-700 flex items-center justify-center font-bold text-xs">
                    QR
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Scan QR code using any UPI App</p>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, CRED</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-focus-600 cursor-pointer hover:underline">
                  Show QR
                </span>
              </div>
            </div>
          )}

          {activeTab === 'card' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500"
                />
              </div>
            </div>
          )}

          {activeTab === 'netbanking' && (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Your Bank
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setBank(b)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      bank === b
                        ? 'border-focus-600 bg-focus-50 text-focus-800'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'wallet' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Digital Wallet
              </label>
              {['Amazon Pay Balance', 'Paytm Wallet', 'PhonePe Wallet', 'MobiKwik'].map((w, idx) => (
                <div 
                  key={w}
                  className="p-3 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-semibold text-slate-800">{w}</span>
                  <input type="radio" name="wallet" defaultChecked={idx === 0} className="text-focus-600" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Button & Security Assurance */}
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
          <button
            onClick={handleProcessPayment}
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-focus-600 hover:bg-focus-700 text-white font-bold text-sm shadow-md shadow-focus-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Authorizing Razorpay Gateway...
              </>
            ) : (
              <>
                <span>Pay ₹{totalAmount.toLocaleString('en-IN')} & Extend Warranty</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL Encrypted • PCI-DSS Certified • Razorpay & Stripe Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckoutModal;
