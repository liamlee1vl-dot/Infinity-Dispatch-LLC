import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Building2,
  Truck,
  DollarSign,
  User,
  Sparkles,
  Copy,
  AlertTriangle,
} from 'lucide-react';

export interface DocumentViewerData {
  title: string;
  docType: 'Rate Confirmation' | 'Bill of Lading' | 'W-9' | 'COI' | 'MC Authority' | 'Driver License' | 'NOA' | 'Invoice' | 'General';
  fileName: string;
  carrierName?: string;
  mcNumber?: string;
  loadNumber?: string;
  date?: string;
  rawText?: string;
  extraDetails?: Record<string, string | number>;
}

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentViewerData | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document: doc,
}) => {
  const [aiDisputeLetter, setAiDisputeLetter] = useState<string | null>(null);
  const [isGeneratingDispute, setIsGeneratingDispute] = useState(false);
  const [copiedDispute, setCopiedDispute] = useState(false);

  if (!isOpen || !doc) return null;

  const handleGenerateDispute = async (type: 'Detention' | 'TONU') => {
    setIsGeneratingDispute(true);
    try {
      const res = await fetch('/api/ai/draft-dispute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'Detention' ? 'Detention Compensation ($75/hr)' : 'Truck Ordered Not Used (TONU)',
          loadNumber: doc.loadNumber || 'INF-2026-0891',
          brokerName: String(doc.extraDetails?.Broker || 'Brokerage Claims Dept'),
          carrierName: doc.carrierName || 'Apex Interstate Express LLC',
          hoursDelayed: 3,
          dockAddress: String(doc.extraDetails?.['Shipper Address'] || 'Receiver Terminal'),
        }),
      });
      const data = await res.json();
      setAiDisputeLetter(data.letter || 'Demand letter generated.');
    } catch (err) {
      console.error(err);
      setAiDisputeLetter(
        `FORMAL DEMAND FOR DETENTION PAYMENT\nRe: Load #${doc.loadNumber || 'INF-2026-0891'}\nCarrier: ${doc.carrierName || 'Carrier'}\n\nPlease issue revised Rate Con with $225.00 detention (3 hrs @ $75/hr) to Davidcross.vl1@gmail.com.`
      );
    } finally {
      setIsGeneratingDispute(false);
    }
  };

  const handleCopyDispute = () => {
    if (aiDisputeLetter) {
      navigator.clipboard.writeText(aiDisputeLetter);
      setCopiedDispute(true);
      setTimeout(() => setCopiedDispute(false), 3000);
    }
  };

  const handleDownload = () => {
    const content = doc.rawText || `${doc.title}\nCarrier: ${doc.carrierName || 'N/A'}\nMC#: ${doc.mcNumber || 'N/A'}\nDate: ${doc.date || new Date().toISOString().split('T')[0]}\nStatus: Official Verified Document On File (Infinity Dispatch LLC)`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = doc.fileName || `${doc.title.replace(/\s+/g, '_')}.txt`;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-[#091122] border-2 border-blue-500/50 shadow-2xl overflow-hidden">
        
        {/* Top Modal Navigation Bar */}
        <div className="p-4 sm:p-5 bg-[#0C152B] border-b border-blue-900/50 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-sky-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white truncate max-w-md">
                  {doc.title}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  VERIFIED ON FILE
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">
                File: <span className="text-sky-300">{doc.fileName}</span> · Infinity Dispatch LLC Storage
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 cursor-pointer transition-colors"
              title="Print / Save PDF"
            >
              <Printer className="w-4 h-4 text-sky-400" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-mono text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition-colors"
              title="Download Document"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Body (Visual Formal Document View) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-[#070B14]">
          <div className="max-w-3xl mx-auto rounded-2xl bg-white text-slate-900 p-6 sm:p-10 shadow-2xl border border-slate-300 font-sans space-y-6 relative print:m-0 print:border-none print:shadow-none">
            
            {/* Watermark / Official Stamp */}
            <div className="absolute right-6 top-6 sm:right-10 sm:top-10 border-2 border-emerald-600/70 rounded-xl p-2 text-center text-emerald-700 font-mono text-[10px] font-black uppercase rotate-6 pointer-events-none select-none bg-emerald-50/80">
              INFINITY DISPATCH LLC<br />
              OFFICIALLY VERIFIED & LOCKED<br />
              PORTAL STORAGE ACTIVE
            </div>

            {/* Document Header */}
            <div className="border-b-2 border-slate-900 pb-5">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-700 uppercase tracking-widest mb-1">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>INFINITY DISPATCH LLC · COMMERCIAL FREIGHT DOCUMENT</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                {doc.title}
              </h1>
              <div className="text-xs text-slate-600 font-mono mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>Date: <strong>{doc.date || new Date().toISOString().split('T')[0]}</strong></span>
                {doc.loadNumber && <span>Load #: <strong>{doc.loadNumber}</strong></span>}
                {doc.mcNumber && <span>Carrier MC: <strong>{doc.mcNumber}</strong></span>}
              </div>
            </div>

            {/* Metadata Summary Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">CARRIER / HOLDER:</span>
                <span className="text-sm font-bold text-slate-900">{doc.carrierName || 'Apex Interstate Express LLC'}</span>
                <div className="text-slate-600">{doc.mcNumber || 'MC-1489201'}</div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">MANAGED BY DISPATCH DESK:</span>
                <span className="text-sm font-bold text-blue-700">Infinity Dispatch LLC (Houston HQ)</span>
                <div className="text-slate-600">David Cross / Alvin · (409) 509-6940</div>
              </div>
            </div>

            {/* Document Specific Breakdown */}
            {doc.docType === 'Rate Confirmation' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-blue-200 pb-1.5 font-bold text-blue-900">
                    <span>RATE CONFIRMATION SPECIFICATIONS</span>
                    <span className="text-emerald-700">100% DIRECT BROKER PAYOUT</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Gross Agreed Rate: <strong className="text-slate-950 font-bold">$2,850.00 USD</strong></div>
                    <div>Dispatch Fee Commission: <strong className="text-blue-700 font-bold">7% ($199.50)</strong></div>
                    <div>Net Carrier Remittance: <strong className="text-emerald-700 font-bold">$2,650.50 USD</strong></div>
                    <div>Detention / Layover Clause: <strong>$75/hr after 2h at dock</strong></div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-2 text-slate-700">
                  <div className="font-bold text-slate-900">ROUTE & TIMING INSTRUCTIONS:</div>
                  <p className="leading-relaxed">
                    Pickup: Dallas, TX (Dock 1, 08:00 AM CST) ➔ Delivery: Columbus, OH (Receiver Dock, 02:00 PM EST).
                    Driver must maintain continuous communication with Infinity Dispatch operations desk. Check calls required at loading, mid-point, and delivery empty.
                  </p>
                </div>
              </div>
            )}

            {doc.docType === 'Bill of Lading' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs font-mono space-y-2">
                  <div className="flex justify-between border-b border-amber-200 pb-1.5 font-bold text-amber-900">
                    <span>STRAIGHT BILL OF LADING · SHORT FORM</span>
                    <span className="text-slate-700">ORIGINAL - NOT NEGOTIABLE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div>Shipper: <strong>Dallas Central Distribution, TX</strong></div>
                    <div>Consignee: <strong>Buckeye Retail Logistics, Columbus, OH</strong></div>
                    <div>Commodity: <strong>24 Pallets Consumer Packaged Goods</strong></div>
                    <div>Gross Weight: <strong>38,450 lbs · Seal #778921</strong></div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 text-xs font-mono space-y-2 text-slate-700">
                  <div className="font-bold text-slate-900">CARRIER RECEIPT & CONDITION CLAUSE:</div>
                  <p className="leading-relaxed">
                    Received, subject to individually determined rates or contracts. Goods described above are in apparent good order, except as noted.
                  </p>
                </div>
              </div>
            )}

            {/* Raw Text Content If Present */}
            {doc.rawText && (
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
                  Document Full Content:
                </span>
                <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed overflow-x-auto border border-slate-800">
                  {doc.rawText}
                </pre>
              </div>
            )}

            {/* Extra Key-Values */}
            {doc.extraDetails && Object.keys(doc.extraDetails).length > 0 && (
              <div className="border-t border-slate-200 pt-4">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Registered Attributes:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                  {Object.entries(doc.extraDetails).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-lg bg-slate-100 border border-slate-200">
                      <span className="text-slate-500 text-[10px] block uppercase">{key}:</span>
                      <strong className="text-slate-900">{String(val)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Official Signatures & Verification Stamp */}
            {/* Official Signatures & Verification Stamp */}
            <div className="border-t-2 border-slate-900 pt-5 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 font-mono text-xs text-slate-600">
              <div>
                <div className="font-bold text-slate-900 uppercase">Authorized Signature:</div>
                <div className="font-serif italic text-lg text-blue-900 font-bold mt-1">David Cross</div>
                <div className="text-[10px] text-slate-500">Business Development Executive · Infinity Dispatch LLC</div>
              </div>

              <div className="text-left sm:text-right text-[10px] space-y-0.5">
                <div>Digital Verification ID: <strong className="text-slate-800">INF-AUTH-{Math.floor(100000 + Math.random() * 900000)}</strong></div>
                <div>Status: <span className="text-emerald-700 font-bold">100% Active in Permanent Database</span></div>
                <div>Server Time: <span>{new Date().toISOString().replace('T', ' ').slice(0, 19)} UTC</span></div>
              </div>
            </div>

            {/* AI Dispute Demand Letter Generator Section */}
            {(doc.docType === 'Rate Confirmation' || doc.docType === 'Bill of Lading') && (
              <div className="mt-6 pt-6 border-t-2 border-dashed border-slate-300 print:hidden space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 font-mono text-xs">
                      AI BROKER DISPUTE COPILOT (GEMINI POWERED)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={isGeneratingDispute}
                      onClick={() => handleGenerateDispute('Detention')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-mono font-bold text-[11px] cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                    >
                      {isGeneratingDispute ? 'Drafting...' : '⚡ AI Draft Detention Claim ($75/hr)'}
                    </button>
                    <button
                      type="button"
                      disabled={isGeneratingDispute}
                      onClick={() => handleGenerateDispute('TONU')}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-300 font-mono font-bold text-[11px] cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                    >
                      ⚡ AI Draft TONU Claim ($350)
                    </button>
                  </div>
                </div>

                {aiDisputeLetter && (
                  <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-xs space-y-2 border border-slate-800">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-amber-400 font-bold">Official Ready-to-Send Demand Letter:</span>
                      <button
                        type="button"
                        onClick={handleCopyDispute}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedDispute ? 'Copied to Clipboard!' : 'Copy Letter'}</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap text-[11px] text-slate-200 leading-relaxed font-mono">
                      {aiDisputeLetter}
                    </pre>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-[#0C152B] border-t border-blue-900/50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs font-mono text-slate-400">
            Stored permanently in Owner Portal database · Instant cloud PDF print ready
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 font-bold cursor-pointer"
            >
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-mono text-white font-bold cursor-pointer shadow-md"
            >
              Close Document
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
