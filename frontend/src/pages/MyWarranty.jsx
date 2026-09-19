import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  PlusCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  FileText, 
  History, 
  Calendar, 
  Hash, 
  Laptop, 
  Smartphone, 
  Tv, 
  Server, 
  ChevronRight, 
  X, 
  Loader2,
  ExternalLink,
  Award
} from 'lucide-react';
import WarrantyCertificateModal from '../components/WarrantyCertificateModal';

const MyWarranty = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All'); // All, Active, Expiring Soon, Expired
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const [selectedWarrantyForCert, setSelectedWarrantyForCert] = useState(null);
  const [selectedWarrantyForHistory, setSelectedWarrantyForHistory] = useState(null);

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

  const filteredWarranties = warranties.filter((w) => {
    const matchesFilter = activeFilter === 'All' || w.status === activeFilter;
    const matchesCategory = categoryFilter === 'All' || w.product_category === categoryFilter;
    const matchesSearch = 
      w.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.serial_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.certificate_id?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesCategory && matchesSearch;
  });

  const getStatusBadge = (status, daysLeft) => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Active ({daysLeft > 0 ? `${daysLeft} days left` : 'Covered'})
          </span>
        );
      case 'Expiring Soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" />
            Expiring Soon ({daysLeft} days left)
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Clock className="w-3.5 h-3.5" />
            Expired ({Math.abs(daysLeft)} days ago)
          </span>
        );
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Refrigerator':
        return <ShieldCheck className="w-5 h-5 text-focus-600" />;
      case 'TV':
        return <Tv className="w-5 h-5 text-focus-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-focus-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              My Warranties & Asset Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track lifecycle coverage, view extension logs, and download authenticated warranty certificates.
            </p>
          </div>

          <Link
            to="/extend-warranty"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-focus-600 hover:bg-focus-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-focus-600/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Extend Another Device</span>
          </Link>
        </div>

        {/* Filter Controls & Search */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto text-xs font-bold">
            {['All', 'Active', 'Expiring Soon', 'Expired'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  activeFilter === tab
                    ? 'bg-white text-focus-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search device or serial..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-focus-500"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-focus-500"
            >
              <option value="All">All Categories</option>
              <option value="Refrigerator">Refrigerator</option>
              <option value="TV">TV</option>
            </select>
          </div>
        </div>

        {/* Warranties Card Grid / List */}
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-subtle flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-focus-600" />
            <p className="text-xs font-semibold text-slate-500">Loading your warranty portfolio...</p>
          </div>
        ) : filteredWarranties.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-subtle space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No Warranty Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No warranty records match your current search and status filters.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWarranties.map((w) => (
              <div
                key={w.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-subtle hover:shadow-card-hover transition-all duration-200 space-y-5"
              >
                {/* Top Title & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-focus-50 border border-focus-100 flex items-center justify-center shrink-0">
                      {getCategoryIcon(w.product_category)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-base">{w.product_name}</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{w.product_category}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(w.status, w.days_left)}
                  </div>
                </div>

                {/* Key Specification Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs bg-slate-50/70 p-4 rounded-2xl border border-slate-200/70">
                  <div>
                    <p className="text-slate-400 font-medium">Serial Number</p>
                    <p className="font-mono font-bold text-slate-900 text-xs sm:text-sm mt-0.5">{w.serial_number}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-medium">Purchase Date</p>
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm mt-0.5">{w.purchase_date}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-medium">Warranty Start Date</p>
                    <p className="font-semibold text-slate-800 text-xs sm:text-sm mt-0.5">{w.warranty_start_date || w.purchase_date}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 font-medium">Warranty Expiry Date</p>
                    <p className="font-bold text-focus-700 text-xs sm:text-sm mt-0.5">{w.warranty_expiry_date}</p>
                  </div>
                </div>

                {/* Actions & Extension History Button */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedWarrantyForHistory(w)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                    >
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Extension History ({w.extension_history?.length || 0})</span>
                    </button>

                    <button
                      onClick={() => setSelectedWarrantyForCert(w)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-focus-600" />
                      <span>View & Download Certificate</span>
                    </button>
                  </div>

                  <div>
                    <Link
                      to={`/extend-warranty?serial=${encodeURIComponent(w.serial_number)}&product=${encodeURIComponent(w.product_name)}&category=${encodeURIComponent(w.product_category)}&expiry=${encodeURIComponent(w.warranty_expiry_date)}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-focus-600 hover:bg-focus-700 text-white font-bold text-xs transition-all shadow-xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Extend Warranty</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Extension History Drawer / Modal */}
      {selectedWarrantyForHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-focus-600" />
                <h3 className="font-black text-slate-900 text-base">Warranty Extension History</h3>
              </div>
              <button
                onClick={() => setSelectedWarrantyForHistory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">{selectedWarrantyForHistory.product_name}</p>
              <p className="text-xs font-mono text-slate-500">SN: {selectedWarrantyForHistory.serial_number}</p>
            </div>

            {(!selectedWarrantyForHistory.extension_history || selectedWarrantyForHistory.extension_history.length === 0) ? (
              <p className="text-xs text-slate-500 py-4 text-center">No prior extension records for this product.</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {selectedWarrantyForHistory.extension_history.map((hist, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-focus-700">{hist.period} Extension</span>
                      <span className="font-mono text-slate-400 text-[11px]">{hist.extended_on}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Extended to: <strong className="text-slate-800">{hist.new_expiry}</strong></span>
                      <span className="font-bold text-slate-900">₹{hist.amount_paid?.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 pt-1">
                      Payment ID: {hist.payment_id}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2">
              <button
                onClick={() => setSelectedWarrantyForHistory(null)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default MyWarranty;
