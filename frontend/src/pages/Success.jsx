import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Download, 
  ScrollText, 
  LayoutDashboard, 
  ShieldCheck, 
  Calendar, 
  Hash, 
  CreditCard, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import WarrantyCertificateModal from '../components/WarrantyCertificateModal';

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const stateData = location.state || {};
  const confirmation = stateData.confirmation || {};
  const warranty = confirmation.warranty || stateData.warrantyData || {
    id: 'WRN-882194',
    customer_name: 'Rajesh Kumar',
    product_name: 'Apple MacBook Pro 16" M3 Max',
    product_category: 'Laptops & Computers',
    serial_number: 'FS-AAPL-77341',
    original_warranty_expiry: '2026-05-15',
    last_extended_period: '1 Year',
    warranty_expiry_date: '2027-05-15',
    certificate_id: 'CERT-FS-AAPL-77341-2026',
    warranty_start_date: new Date().toISOString().split('T')[0]
  };

  const paymentId = confirmation.payment_id || 'pay_rzp_demo_882914';
  const newExpiry = confirmation.new_expiry || warranty.warranty_expiry_date || '2027-05-15';
  const extensionPeriod = warranty.last_extended_period || warranty.extension_period || '1 Year';

  const [certModalOpen, setCertModalOpen] = useState(false);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 300);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-elevated overflow-hidden text-center p-8 sm:p-10 relative">
          
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border-4 border-emerald-100 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4 animate-in zoom-in-75 duration-300">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Policy Activated & Certified
          </span>

          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Warranty Extension Successful
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2">
            Your device is now officially covered under the Focus System Extended Protection Program with guaranteed OEM support.
          </p>

          {/* Details Grid */}
          <div className="mt-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/80 text-left space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Customer Name</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{warranty.customer_name}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Product Name</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{warranty.product_name}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Serial Number</p>
                <p className="font-mono font-bold text-slate-900 text-sm mt-0.5">{warranty.serial_number}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Extension Period</p>
                <p className="font-bold text-focus-700 text-sm mt-0.5">{extensionPeriod} Extended</p>
              </div>
            </div>

            {/* Dates & Reference IDs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-slate-400 font-medium">Original Warranty Expiry</p>
                <p className="font-semibold text-slate-700 mt-0.5">{warranty.original_warranty_expiry || 'Initial Expiry'}</p>
              </div>

              <div className="bg-focus-50 p-2.5 rounded-xl border border-focus-200">
                <p className="text-focus-800 font-bold">New Warranty Expiry Date</p>
                <p className="text-focus-700 font-extrabold text-sm mt-0.5">{newExpiry}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Warranty Reference ID</p>
                <p className="font-mono font-bold text-slate-800 mt-0.5">{warranty.id || 'WRN-FS-2026'}</p>
              </div>

              <div>
                <p className="text-slate-400 font-medium">Razorpay Payment ID</p>
                <p className="font-mono font-bold text-emerald-700 mt-0.5">{paymentId}</p>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setCertModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-focus-600 hover:bg-focus-700 text-white font-bold text-sm shadow-md shadow-focus-600/30 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Warranty Certificate</span>
            </button>

            <button
              onClick={() => setCertModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm transition-colors"
            >
              <Award className="w-4 h-4 text-focus-600" />
              <span>View Warranty Certificate</span>
            </button>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </Link>
          </div>

        </div>

      </div>

      {/* Certificate Modal */}
      {certModalOpen && (
        <WarrantyCertificateModal
          warranty={{
            ...warranty,
            warranty_expiry_date: newExpiry,
            certificate_id: warranty.certificate_id || `CERT-${warranty.serial_number}-FS`
          }}
          isOpen={certModalOpen}
          onClose={() => setCertModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Success;
