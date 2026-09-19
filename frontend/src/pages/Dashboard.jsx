import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { 
  ShieldCheck, 
  PlusCircle, 
  ScrollText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  Search, 
  FileText, 
  ChevronRight, 
  Laptop, 
  Smartphone, 
  Tv, 
  Server, 
  Loader2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import WarrantyCertificateModal from '../components/WarrantyCertificateModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedWarrantyForCert, setSelectedWarrantyForCert] = useState(null);
  const [serialQuery, setSerialQuery] = useState('');

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const res = await api.get('/warranties');
      setWarranties(res.data);
    } catch (err) {
      console.error('Error fetching warranties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarranties();
  }, []);

  const totalCount = warranties.length;
  const activeCount = warranties.filter(w => w.status === 'Active').length;
  const expiringCount = warranties.filter(w => w.status === 'Expiring Soon').length;
  const expiredCount = warranties.filter(w => w.status === 'Expired').length;

  const handleQuickLookup = (e) => {
    e.preventDefault();
    if (serialQuery.trim()) {
      navigate(`/extend-warranty?serial=${encodeURIComponent(serialQuery.trim())}`);
    }
  };

  const getStatusBadge = (status, daysLeft) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active ({daysLeft > 0 ? `${daysLeft}d left` : 'Protected'})
          </span>
        );
      case 'Expiring Soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Expiring Soon ({daysLeft}d left)
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Clock className="w-3.5 h-3.5" />
            Expired ({Math.abs(daysLeft)}d ago)
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Refrigerator':
        return <ShieldCheck className="w-4 h-4 text-focus-600" />;
      case 'TV':
        return <Tv className="w-4 h-4 text-focus-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-focus-600" />;
    }
  };

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      
      {/* Hero Welcome & Quick Actions Banner */}
      <div className="bg-gradient-to-r from-focus-950 via-focus-900 to-navy-900 text-white pt-8 pb-20 px-4 sm:px-6 lg:px-8 border-b border-focus-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-focus-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-focus-500/20 text-focus-300 text-xs font-semibold mb-3 border border-focus-400/20">
                <Sparkles className="w-3.5 h-3.5" /> Focus System Asset Protection Dashboard
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Welcome back, {user?.full_name || 'Valued Customer'}!
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Manage your active product warranties, extend multi-year coverage, and verify digital OEM certificates.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/extend-warranty"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-focus-500 to-sky-500 hover:from-focus-600 hover:to-sky-600 text-white font-bold text-sm shadow-lg shadow-focus-500/30 transition-all hover:scale-[1.02]"
              >
                <PlusCircle className="w-4 h-4" />
                Extend New Warranty
              </Link>
              <Link
                to="/my-warranty"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm border border-white/15 transition-colors"
              >
                <ScrollText className="w-4 h-4" />
                View All Records
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Body with Floating Stat Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Registered</p>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{totalCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Products in Focus System</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Coverage</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{activeCount}</p>
            <p className="text-[11px] text-emerald-700/80 mt-1">100% Protected Devices</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expiring Soon</p>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{expiringCount}</p>
            <p className="text-[11px] text-amber-700/80 mt-1">Action needed within 30 days</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-subtle hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Expired Policies</p>
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{expiredCount}</p>
            <p className="text-[11px] text-rose-700/80 mt-1">Eligible for instant renewal</p>
          </div>
        </div>

        {/* Section 1: Extend Your Warranty Interactive Promo / Lookup Form */}
        <div className="bg-gradient-to-br from-focus-50 via-white to-sky-50 rounded-3xl p-6 sm:p-8 border border-focus-200 shadow-elevated relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-focus-100 text-focus-700 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Exclusive Multi-Year Extension
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Extend Your Warranty in 3 Easy Steps
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                Protect your devices against unexpected hardware breakdowns, motherboard failures, and power surges with Focus System OEM Extended Protection.
              </p>

              {/* Quick Serial Lookup Input */}
              <form onSubmit={handleQuickLookup} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={serialQuery}
                    onChange={(e) => setSerialQuery(e.target.value)}
                    placeholder="Enter Device Serial Number (e.g. FS-DELL-98213)"
                    className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-focus-600 hover:bg-focus-700 text-white font-bold text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <span>Check & Extend</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Quick Benefits Pillar */}
            <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl p-5 border border-focus-100 shadow-xs space-y-3">
              <h3 className="font-bold text-xs text-focus-800 uppercase tracking-wider">
                Why Extend with Focus System?
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>100% Genuine Spare Parts & Factory Direct Logistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Free Doorstep Pickup & Fast Turnaround Times</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Instant Digital Cryptographic Certificate Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">✓</div>
                  <span>Upto 35% Savings on Multi-Year Extended Plans</span>
                </div>
              </div>
              <div className="pt-2">
                <Link
                  to="/extend-warranty"
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Open Full Warranty Extension Form</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Section 2: Recent Warranties Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-subtle overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Recent Warranty Registrations
              </h2>
              <p className="text-xs text-slate-500">
                Live status and digital certificates for your registered hardware.
              </p>
            </div>

            <Link
              to="/my-warranty"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-focus-600 hover:text-focus-700 hover:underline"
            >
              <span>View All ({warranties.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-focus-600" />
              <p className="text-xs font-medium">Loading warranty records...</p>
            </div>
          ) : warranties.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Warranties Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You haven't registered or extended any products yet. Fill the extension form to get started.
              </p>
              <Link
                to="/extend-warranty"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-focus-600 text-white font-bold text-xs"
              >
                <PlusCircle className="w-4 h-4" />
                Register First Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-6">Product & Category</th>
                    <th className="py-3.5 px-4">Serial Number</th>
                    <th className="py-3.5 px-4">Current Expiry</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {warranties.slice(0, 5).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-focus-50 border border-focus-100 flex items-center justify-center shrink-0">
                            {getCategoryIcon(item.product_category)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{item.product_name}</p>
                            <p className="text-[11px] text-slate-500">{item.product_category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono font-bold text-slate-700">
                        {item.serial_number}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.warranty_expiry_date}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {getStatusBadge(item.status, item.days_left)}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => setSelectedWarrantyForCert(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          Certificate
                        </button>
                        <Link
                          to={`/extend-warranty?serial=${encodeURIComponent(item.serial_number)}&product=${encodeURIComponent(item.product_name)}&category=${encodeURIComponent(item.product_category)}&expiry=${encodeURIComponent(item.warranty_expiry_date)}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-focus-600 text-white font-bold hover:bg-focus-700 transition-colors shadow-xs"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          Extend
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Certificate Modal */}
      {selectedWarrantyForCert && (
        <WarrantyCertificateModal
          warranty={selectedWarrantyForCert}
          isOpen={!!selectedWarrantyForCert}
          onClose={() => setSelectedWarrantyForCert(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
