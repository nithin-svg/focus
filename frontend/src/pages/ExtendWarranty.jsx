import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheck, 
  User, 
  Phone, 
  Mail, 
  Laptop, 
  Tag, 
  Hash, 
  Calendar, 
  Clock, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Info, 
  AlertCircle, 
  Loader2,
  Percent,
  Check
} from 'lucide-react';

const PRODUCTS = [
  { name: '500 VR Voltage stabilizer( Refrigerator)', category: 'Refrigerator', defaultPrice: 2499, serialPrefix: 'FS-VS-500VR' },
  { name: '55 inches voltage stabilizer(TV)', category: 'TV', defaultPrice: 1999, serialPrefix: 'FS-VS-55TV' },
  { name: '43 inches voltage stabilizer(TV)', category: 'TV', defaultPrice: 1699, serialPrefix: 'FS-VS-43TV' },
  { name: '32 inches voltage stabilizer(TV)', category: 'TV', defaultPrice: 1399, serialPrefix: 'FS-VS-32TV' },
  { name: '65 inches voltage stabilizer(TV)', category: 'TV', defaultPrice: 2299, serialPrefix: 'FS-VS-65TV' },
];

const CATEGORIES = [
  'Refrigerator',
  'TV',
];

const EXTENSION_TIERS = [
  { 
    id: '6 Months', 
    name: '6 Months Extended', 
    badge: 'Quick Coverage', 
    discount: '5% Off', 
    desc: 'Ideal for short-term protection beyond factory expiration.' 
  },
  { 
    id: '1 Year', 
    name: '1 Year Extended', 
    badge: 'Most Popular', 
    discount: '15% Off', 
    desc: 'Complete 365-day OEM-grade repair & maintenance cover.' 
  },
  { 
    id: '2 Years', 
    name: '2 Years Extended', 
    badge: 'Best Value', 
    discount: '25% Off', 
    desc: 'Comprehensive multi-year cover + Free annual tune-up.' 
  },
  { 
    id: '3 Years', 
    name: '3 Years Extended', 
    badge: 'Max Savings', 
    discount: '35% Off', 
    desc: 'Ultimate Peace of Mind with Liquid & Accidental protection.' 
  },
];

const ExtendWarranty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Form States
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone_number || '');
  const [email, setEmail] = useState(user?.email || '');

  const [productName, setProductName] = useState(
    searchParams.get('product') || '500 VR Voltage stabilizer( Refrigerator)'
  );
  const [productCategory, setProductCategory] = useState(
    searchParams.get('category') || 'Refrigerator'
  );
  const [serialNumber, setSerialNumber] = useState(
    searchParams.get('serial') || 'FS-VS-500VR-9821'
  );
  const [purchaseDate, setPurchaseDate] = useState('2025-05-15');
  const [currentWarrantyExpiry, setCurrentWarrantyExpiry] = useState(
    searchParams.get('expiry') || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]
  );
  const [purchasePrice, setPurchasePrice] = useState(2499);

  // Extension Selection
  const [selectedPeriod, setSelectedPeriod] = useState('1 Year');

  // Pricing State
  const [pricing, setPricing] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Update user details if loaded later
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.full_name || '');
      if (!phone) setPhone(user.phone_number || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  // Dynamic Price Calculator Trigger
  const calculatePrice = async (periodToUse = selectedPeriod) => {
    if (!productName.trim() || !serialNumber.trim() || !currentWarrantyExpiry) {
      setErrorMessage('Please fill in Product Name, Serial Number, and Current Expiry Date.');
      return;
    }
    setCalculating(true);
    setErrorMessage('');
    try {
      const res = await api.post('/warranties/calculate-price', {
        product_name: productName.trim(),
        product_category: productCategory,
        purchase_price: parseFloat(purchasePrice) || 49999,
        extension_period: periodToUse,
        current_warranty_expiry: currentWarrantyExpiry
      });
      setPricing(res.data);
    } catch (err) {
      console.error('Calculation error:', err);
      setErrorMessage(err.response?.data?.detail || 'Failed to calculate extension price.');
    } finally {
      setCalculating(false);
    }
  };

  // Run calculation on initial load and when period / category / price changes
  useEffect(() => {
    calculatePrice(selectedPeriod);
  }, [selectedPeriod, productCategory, currentWarrantyExpiry]);

  // Handle Proceed to Payment
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !productName || !serialNumber || !currentWarrantyExpiry) {
      setErrorMessage('Please complete all required fields before proceeding to payment.');
      return;
    }

    const warrantyPayload = {
      customer_name: fullName.trim(),
      customer_phone: phone.trim(),
      customer_email: email.trim(),
      product_name: productName.trim(),
      product_category: productCategory,
      serial_number: serialNumber.trim().toUpperCase(),
      purchase_date: purchaseDate,
      current_warranty_expiry: currentWarrantyExpiry,
      extension_period: selectedPeriod,
      amount_paid: pricing?.total_amount || 2499,
      payment_method: 'Razorpay Gateway'
    };

    navigate('/payment', {
      state: {
        warrantyData: warrantyPayload,
        pricing: pricing
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-focus-50 text-focus-700 text-xs font-bold border border-focus-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Official Focus System Protection Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Extend Your Product Warranty
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Verify customer details, register device parameters, select an extension tier, and calculate instant pricing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/dashboard"
              className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span className="font-semibold">{errorMessage}</span>
          </div>
        )}

        {/* Main Grid: Left Form | Right Summary & Live Calculator */}
        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Customer Details Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-focus-50 text-focus-700 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Customer Details</h2>
                  <p className="text-xs text-slate-500">Contact information for policy registration and certificate delivery.</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="customer@example.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Product Details Section */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-xl bg-focus-50 text-focus-700 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Product Details</h2>
                  <p className="text-xs text-slate-500">Specify hardware model and purchase timeline.</p>
                </div>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Product Name & Model
                  </label>
                  <div className="relative">
                    <Laptop className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      required
                      value={productName}
                      onChange={(e) => {
                        const selectedVal = e.target.value;
                        setProductName(selectedVal);
                        const matched = PRODUCTS.find((p) => p.name === selectedVal);
                        if (matched) {
                          setProductCategory(matched.category);
                          setPurchasePrice(matched.defaultPrice);
                        }
                      }}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500 bg-white"
                    >
                      {PRODUCTS.map((prod) => (
                        <option key={prod.name} value={prod.name}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Product Category
                    </label>
                    <div className="relative">
                      <Tag className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <select
                        value={productCategory}
                        onChange={(e) => {
                          const newCat = e.target.value;
                          setProductCategory(newCat);
                          // Auto-select first matching product for this category
                          const firstMatching = PRODUCTS.find((p) => p.category === newCat);
                          if (firstMatching) {
                            setProductName(firstMatching.name);
                            setPurchasePrice(firstMatching.defaultPrice);
                          }
                        }}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500 bg-white"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Product Serial Number
                    </label>
                    <div className="relative">
                      <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="text"
                        required
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="e.g. FS-AAPL-77341"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:ring-2 focus:ring-focus-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Purchase Date
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        required
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Current Warranty Expiry Date
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                      <input
                        type="date"
                        required
                        value={currentWarrantyExpiry}
                        onChange={(e) => setCurrentWarrantyExpiry(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-focus-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Warranty Extension Period Selector */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-focus-50 text-focus-700 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Select Extension Period</h2>
                    <p className="text-xs text-slate-500">Pick your desired multi-year coverage tenure.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => calculatePrice(selectedPeriod)}
                  disabled={calculating}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  <Calculator className="w-3.5 h-3.5 text-focus-600" />
                  {calculating ? 'Calculating...' : 'Recalculate Price'}
                </button>
              </div>

              {/* Extension Tiers 4-Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {EXTENSION_TIERS.map((tier) => {
                  const isSelected = selectedPeriod === tier.id;
                  return (
                    <div
                      key={tier.id}
                      onClick={() => {
                        setSelectedPeriod(tier.id);
                        calculatePrice(tier.id);
                      }}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        isSelected
                          ? 'border-focus-600 bg-focus-50/50 shadow-md shadow-focus-600/10 scale-[1.01]'
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded-md bg-focus-100 text-focus-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
                            {tier.badge}
                          </span>
                          <h3 className="font-extrabold text-slate-900 text-sm">{tier.name}</h3>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-focus-600 bg-focus-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 mt-2">{tier.desc}</p>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="font-semibold text-emerald-600 flex items-center gap-1">
                          <Percent className="w-3 h-3" /> {tier.discount}
                        </span>
                        <span className="font-bold text-focus-700">Select Plan</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Price Calculation Summary & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 border border-focus-200 shadow-elevated space-y-6">
              
              {/* Box Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-focus-600 text-white flex items-center justify-center shadow-xs">
                    <Calculator className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Warranty Quotation Summary
                  </h3>
                </div>
                {calculating && <Loader2 className="w-4 h-4 text-focus-600 animate-spin" />}
              </div>

              {/* Product Preview Card */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Device</span>
                  <span className="font-bold text-slate-800 text-right max-w-[180px] truncate">{productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Serial No.</span>
                  <span className="font-mono font-bold text-slate-800">{serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Expiry</span>
                  <span className="font-semibold text-slate-700">{currentWarrantyExpiry}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-focus-700 font-bold">
                  <span>New Extended Expiry</span>
                  <span>{pricing?.new_expiry_date || 'Calculating...'}</span>
                </div>
              </div>

              {/* Itemized Price Breakdown */}
              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Base Extension Cost ({selectedPeriod})</span>
                  <span className="font-semibold text-slate-800">
                    ₹{pricing?.base_price ? pricing.base_price.toLocaleString('en-IN') : '...'}
                  </span>
                </div>

                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Multi-Year Plan Discount</span>
                  <span>
                    -₹{pricing?.discount_amount ? pricing.discount_amount.toLocaleString('en-IN') : '...'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>GST / Platform Taxes (18%)</span>
                  <span className="font-semibold text-slate-800">
                    +₹{pricing?.tax_amount ? pricing.tax_amount.toLocaleString('en-IN') : '...'}
                  </span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex items-baseline justify-between text-slate-900">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase">Total Payable</p>
                    <p className="text-[11px] text-slate-400">All Taxes & Certifications Included</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-focus-700">
                      ₹{pricing?.total_amount ? pricing.total_amount.toLocaleString('en-IN') : '2,499'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Included Coverage Benefits */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Guaranteed Under Focus System Care:
                </p>
                <div className="space-y-1.5 text-xs text-slate-700">
                  {(pricing?.coverage_features || [
                    '100% Genuine OEM Parts Guarantee',
                    'Free Doorstep Pickup & Fast Delivery',
                    'Unlimited Repair Request Authorizations',
                    'Cryptographically Signed Certificate'
                  ]).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Calculate & Extend */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={calculating}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-focus-600 to-sky-600 hover:from-focus-700 hover:to-sky-700 text-white font-bold text-sm shadow-lg shadow-focus-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
                >
                  <span>Extend Warranty Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => calculatePrice(selectedPeriod)}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-focus-600" />
                  <span>Calculate Price</span>
                </button>
              </div>

            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ExtendWarranty;
