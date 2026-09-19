import React, { useRef, useState } from 'react';
import { 
  ShieldCheck, 
  Download, 
  Printer, 
  X, 
  Award, 
  CheckCircle2, 
  Calendar, 
  Hash, 
  QrCode,
  Sparkles,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const WarrantyCertificateModal = ({ warranty, isOpen, onClose }) => {
  const certificateRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !warranty) return null;

  const handleDownloadPDF = async () => {
    if (!certificateRef.current) return;
    try {
      setDownloading(true);
      const element = certificateRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`FocusSystem_Certificate_${warranty.serial_number || 'FS'}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Fallback print
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-focus-600" />
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Focus System Official Warranty Certificate
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-focus-600 hover:bg-focus-700 rounded-lg shadow-sm transition-all"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download Certificate PDF
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Content - Printable Target */}
        <div className="overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-100">
          <div 
            ref={certificateRef}
            className="w-full max-w-[850px] bg-white border-8 border-double border-focus-900 rounded-xl p-6 sm:p-10 shadow-lg relative text-slate-900"
            style={{ minHeight: '520px' }}
          >
            {/* Watermark Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
              <ShieldCheck className="w-[450px] h-[450px] text-focus-900" />
            </div>

            {/* Corner Filigree / Accents */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-focus-600"></div>
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-focus-600"></div>
            <div className="absolute bottom-3 left-3 w-8 h-2 border-b-2 border-l-2 border-focus-600"></div>
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-focus-600"></div>

            {/* Top Brand & Title */}
            <div className="text-center relative z-10 space-y-1">
              <div className="inline-flex items-center justify-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl bg-focus-700 text-white flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  FOCUS<span className="text-focus-600">SYSTEM</span>
                </span>
              </div>
              <p className="text-[11px] font-bold tracking-widest text-focus-700 uppercase">
                Global Warranty Assurance Division
              </p>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-2 font-serif">
                Certificate of Extended Warranty
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                This document certifies that the device described herein is fully enrolled in the Focus System Extended Protection Program with guaranteed OEM-standard maintenance.
              </p>
            </div>

            {/* Certificate ID & Issue Stamp */}
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 border-y border-slate-200 py-3 my-5 bg-slate-50/70 px-4 rounded-lg">
              <div className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 text-focus-600" />
                <span className="font-semibold text-slate-500">Certificate No:</span>
                <span className="font-mono font-bold text-slate-900">{warranty.certificate_id || `CERT-${warranty.id}`}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-focus-600" />
                <span className="font-semibold text-slate-500">Issued On:</span>
                <span className="font-bold text-slate-900">{warranty.warranty_start_date || new Date().toISOString().split('T')[0]}</span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED & ACTIVE
              </div>
            </div>

            {/* Main Specification Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs relative z-10">
              {/* Product Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-focus-700 uppercase tracking-wider text-[10px]">Product Information</p>
                <div>
                  <p className="text-[11px] text-slate-400">Product Name</p>
                  <p className="font-bold text-slate-900 text-sm">{warranty.product_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-[11px] text-slate-400">Category</p>
                    <p className="font-semibold text-slate-800">{warranty.product_category}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Serial Number</p>
                    <p className="font-mono font-bold text-slate-800">{warranty.serial_number}</p>
                  </div>
                </div>
              </div>

              {/* Customer & Coverage Info */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="font-bold text-focus-700 uppercase tracking-wider text-[10px]">Customer & Coverage Timeline</p>
                <div>
                  <p className="text-[11px] text-slate-400">Registered Beneficiary</p>
                  <p className="font-bold text-slate-900 text-sm">{warranty.customer_name}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <p className="text-[11px] text-slate-400">Original Expiry</p>
                    <p className="font-semibold text-slate-700">{warranty.original_warranty_expiry || warranty.purchase_date}</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Valid Until (Extended)</p>
                    <p className="font-bold text-focus-700 text-sm">{warranty.warranty_expiry_date}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full border-2 border-focus-600/40 bg-focus-50 flex flex-col items-center justify-center text-center p-1">
                  <Award className="w-5 h-5 text-focus-700" />
                  <span className="text-[8px] font-black text-focus-900 uppercase">Focus Seal</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  <p className="font-bold text-slate-700">Focus System Protection Guarantee</p>
                  <p>Authenticated Digital Certificate</p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-serif italic font-bold text-slate-800 text-sm tracking-wide">Dr. Arvind Mehta</p>
                <div className="w-32 border-b border-slate-400 my-0.5"></div>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                  Chief Assurance Officer
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Official warranty verification record • Available anytime in customer dashboard</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 font-semibold text-slate-700 text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarrantyCertificateModal;
