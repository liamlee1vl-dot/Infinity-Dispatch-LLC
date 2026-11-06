import React, { useState } from 'react';
import { EquipmentType } from '../types';
import { storage } from '../services/storage';
import {
  FileCheck2,
  Truck,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  MapPin,
  Upload,
  User,
  Building,
  Mail,
  Phone,
  FileText,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface CarrierSignUpSectionProps {
  initialEquipment?: EquipmentType;
  initialRPM?: number;
  onApplicationSubmitted?: () => void;
}

export const CarrierSignUpSection: React.FC<CarrierSignUpSectionProps> = ({
  initialEquipment = 'Dry Van',
  initialRPM = 2.85,
  onApplicationSubmitted,
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    mcNumber: '',
    dotNumber: '',
    vinNumber: '',
    driversLicense: '',
    equipmentType: initialEquipment,
    truckCount: 1,
    currentZip: '',
    preferredLanes: '',
    preferredRPM: initialRPM,
    maxDeadhead: 50,
    availableDate: new Date().toISOString().split('T')[0],
    insuranceStatus: '$1,000,000 Auto Liability / $100,000 Cargo',
    additionalRequirements: '',
    assignedOwner: 'David Cross' as 'David Cross' | 'Alvin',
  });

  const [docs, setDocs] = useState({
    w9: true,
    coi: true,
    mcAuthority: true,
    driversLicense: true,
    noaOrVoidedCheck: true,
  });

  const [submittedApp, setSubmittedApp] = useState<{
    id: string;
    applicationNumber: number;
    assignedOwner: string;
    companyName: string;
  } | null>(null);

  const [error, setError] = useState('');

  const equipmentOptions: EquipmentType[] = [
    'Dry Van',
    'Reefer',
    'Flatbed',
    'Step Deck',
    'Power Only',
    'Hotshot',
    'Box Truck',
    'Sprinter Van',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.companyName.trim() || !formData.fullName.trim()) {
      setError('Please provide your Company Name and Contact Full Name.');
      return;
    }
    if (!formData.phone.trim() || !formData.email.trim()) {
      setError('Please provide a valid Phone Number and Email Address.');
      return;
    }
    if (!formData.mcNumber.trim()) {
      setError('Please provide your MC# or DOT# for carrier verification.');
      return;
    }

    setError('');

    const uploadedFiles: string[] = [];
    if (docs.w9) uploadedFiles.push('W-9_Form.pdf');
    if (docs.coi) uploadedFiles.push('Certificate_of_Insurance_COI.pdf');
    if (docs.mcAuthority) uploadedFiles.push('FMCSA_MC_Authority.pdf');
    if (docs.driversLicense) uploadedFiles.push('Drivers_License_Copy.pdf');
    if (docs.noaOrVoidedCheck) uploadedFiles.push('Notice_of_Assignment_VoidedCheck.pdf');

    const newApp = storage.submitApplication({
      fullName: formData.fullName,
      companyName: formData.companyName,
      email: formData.email,
      phone: formData.phone,
      mcNumber: formData.mcNumber.startsWith('MC') ? formData.mcNumber : `MC-${formData.mcNumber}`,
      dotNumber: formData.dotNumber ? (formData.dotNumber.startsWith('USDOT') ? formData.dotNumber : `USDOT ${formData.dotNumber}`) : 'Pending',
      vinNumber: formData.vinNumber || 'TBD-VIN',
      driversLicense: formData.driversLicense || 'Verified on file',
      equipmentType: formData.equipmentType,
      truckCount: Number(formData.truckCount) || 1,
      currentZip: formData.currentZip || '75001',
      preferredLanes: formData.preferredLanes || 'Nationwide / Open Lanes',
      preferredRPM: Number(formData.preferredRPM) || 2.85,
      maxDeadhead: Number(formData.maxDeadhead) || 50,
      availableDate: formData.availableDate,
      insuranceStatus: formData.insuranceStatus,
      additionalRequirements: formData.additionalRequirements,
      assignedOwner: formData.assignedOwner,
      uploadedFiles,
      documents: docs,
    });

    setSubmittedApp({
      id: newApp.id,
      applicationNumber: newApp.applicationNumber,
      assignedOwner: newApp.assignedOwner,
      companyName: newApp.companyName,
    });

    if (onApplicationSubmitted) {
      onApplicationSubmitted();
    }
  };

  return (
    <section id="carrier-signup" className="py-20 bg-[#060A14] border-t border-b border-blue-900/40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/90 border border-blue-500/40 text-xs font-mono text-sky-400 mb-3 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>ONE-STEP FAST ONBOARDING · NO DELAYS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
            Carrier Sign-Up & Direct Dispatch Setup
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300">
            Submit your authority and equipment details below. All fields are accessible in one continuous form — no multi-step wizard, no hidden fees, instant owner assignment.
          </p>
        </div>

        {submittedApp ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#09152C] via-[#0B1A38] to-[#071024] border border-emerald-500/50 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                APPLICATION #{submittedApp.applicationNumber} REGISTERED SUCCESSFULLY
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
                Welcome Aboard, {submittedApp.companyName}!
              </h3>
              <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Your application has been assigned directly to <strong>{submittedApp.assignedOwner}</strong>. A full notification packet and document check have been forwarded to executive email:
                <code className="text-sky-300 font-mono block mt-1">
                  {submittedApp.assignedOwner === 'David Cross' ? 'Davidcross.vl1@gmail.com' : 'alvin.vast@gmail.com'}
                </code>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#050C1A] border border-blue-900/60 max-w-md mx-auto text-xs font-mono text-left space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>Application Sequence:</span>
                <span className="text-white font-bold">#{submittedApp.applicationNumber}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Executive:</span>
                <span className="text-amber-400 font-bold">{submittedApp.assignedOwner}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Contact:</span>
                <span className="text-sky-400 font-bold">+1 (409) 509-6940</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Direct Telegram:</span>
                <span className="text-sky-400 font-bold">@DavidCross4899</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setSubmittedApp(null)}
                className="px-6 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700 rounded-xl cursor-pointer"
              >
                Register Another Truck / Carrier
              </button>
              <a
                href="https://t.me/DavidCross4899"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg cursor-pointer"
              >
                Connect on Telegram with David Cross
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-[#091122] border border-blue-500/40 shadow-2xl space-y-8"
          >
            {error && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {/* BLOCK 1: Carrier & Company Identity */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <Building className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  1. Company & Contact Details
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Company / Carrier Legal Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g. Apex Interstate Express LLC"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Owner / Contact Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Marcus Vance"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Direct Phone / Cell Number *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. (214) 555-8392"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Primary Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. dispatch@apexinterstate.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* BLOCK 2: FMCSA Authority, VIN & Driver License */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <FileText className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  2. Authority, VIN & Driver Credentials
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    MC Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.mcNumber}
                    onChange={(e) => setFormData({ ...formData, mcNumber: e.target.value })}
                    placeholder="e.g. MC-1489201"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    USDOT Number
                  </label>
                  <input
                    type="text"
                    value={formData.dotNumber}
                    onChange={(e) => setFormData({ ...formData, dotNumber: e.target.value })}
                    placeholder="e.g. USDOT 3920141"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Tractor / Truck VIN Number
                  </label>
                  <input
                    type="text"
                    value={formData.vinNumber}
                    onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })}
                    placeholder="17-Digit VIN Number"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Driver License (DL) Number
                  </label>
                  <input
                    type="text"
                    value={formData.driversLicense}
                    onChange={(e) => setFormData({ ...formData, driversLicense: e.target.value })}
                    placeholder="State & DL Number"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* BLOCK 3: Equipment, Fleet Size & Running Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <Truck className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  3. Equipment Setup & Lane Targets
                </h3>
              </div>

              {/* Equipment Selector Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Select Primary Equipment Type:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {equipmentOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData({ ...formData, equipmentType: type })}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                        formData.equipmentType === type
                          ? 'bg-blue-600 border-blue-400 text-white shadow-md font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Truck / Fleet Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.truckCount}
                    onChange={(e) => setFormData({ ...formData, truckCount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Current Base ZIP / City
                  </label>
                  <input
                    type="text"
                    value={formData.currentZip}
                    onChange={(e) => setFormData({ ...formData, currentZip: e.target.value })}
                    placeholder="e.g. 75201 (Dallas, TX)"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target RPM ($ / Mile)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="1.50"
                    max="6.00"
                    value={formData.preferredRPM}
                    onChange={(e) => setFormData({ ...formData, preferredRPM: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Unpaid Deadhead
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="200"
                    value={formData.maxDeadhead}
                    onChange={(e) => setFormData({ ...formData, maxDeadhead: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preferred Freight Lanes & States
                </label>
                <input
                  type="text"
                  value={formData.preferredLanes}
                  onChange={(e) => setFormData({ ...formData, preferredLanes: e.target.value })}
                  placeholder="e.g. Texas Triangle, Midwest to Southeast, West Coast produce lanes"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs"
                />
              </div>
            </div>

            {/* BLOCK 4: Document Verification Checklist */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  4. Document Packet Verification (Tick Attached Items)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                <label className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2.5 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={docs.w9}
                    onChange={(e) => setDocs({ ...docs, w9: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs text-slate-200">W-9 Form</span>
                </label>

                <label className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2.5 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={docs.coi}
                    onChange={(e) => setDocs({ ...docs, coi: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs text-slate-200">COI ($1M / $100K)</span>
                </label>

                <label className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2.5 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={docs.mcAuthority}
                    onChange={(e) => setDocs({ ...docs, mcAuthority: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs text-slate-200">MC Authority</span>
                </label>

                <label className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2.5 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={docs.driversLicense}
                    onChange={(e) => setDocs({ ...docs, driversLicense: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs text-slate-200">Driver's License (DL)</span>
                </label>

                <label className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 flex items-center gap-2.5 cursor-pointer hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={docs.noaOrVoidedCheck}
                    onChange={(e) => setDocs({ ...docs, noaOrVoidedCheck: e.target.checked })}
                    className="w-4 h-4 accent-blue-600 rounded"
                  />
                  <span className="text-xs text-slate-200">NOA / Voided Check</span>
                </label>
              </div>
            </div>

            {/* BLOCK 5: CRUCIAL OWNER SELECTION */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 pb-2 border-b border-blue-900/40">
                <User className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  5. Choose Which Owner To Submit Your Packet To
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Option 1: David Cross */}
                <div
                  onClick={() => setFormData({ ...formData, assignedOwner: 'David Cross' })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    formData.assignedOwner === 'David Cross'
                      ? 'bg-blue-950/80 border-sky-400 ring-2 ring-sky-400/30 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src="/public/assets/aistudio/Screenshot_2026-11-04_095031_b047180c.png"
                    alt="David Cross"
                    className="w-16 h-16 object-contain drop-shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">David Cross</span>
                      {formData.assignedOwner === 'David Cross' && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono block">
                      Business Development Executive
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      Davidcross.vl1@gmail.com · +1 (409) 509-6940
                    </span>
                  </div>
                </div>

                {/* Option 2: Alvin */}
                <div
                  onClick={() => setFormData({ ...formData, assignedOwner: 'Alvin' })}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                    formData.assignedOwner === 'Alvin'
                      ? 'bg-blue-950/80 border-sky-400 ring-2 ring-sky-400/30 shadow-xl'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src="/public/assets/aistudio/Alvin_Royal_Gold_Emblem_1d364b11.png"
                    alt="Alvin"
                    className="w-16 h-16 object-contain drop-shadow"
                    referrerPolicy="no-referrer"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">Alvin</span>
                      {formData.assignedOwner === 'Alvin' && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </div>
                    <span className="text-[11px] text-amber-400 font-mono block">
                      Operations Director
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      alvin.vast@gmail.com · 24/7 Fleet Lead
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-blue-900/40">
              <button
                type="submit"
                className="w-full py-4 text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
              >
                <FileCheck2 className="w-5 h-5" />
                <span>Complete Carrier Sign-Up & Submit to {formData.assignedOwner}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <span className="text-[11px] text-center text-slate-400 block mt-2 font-mono">
                Your data is stored permanently in the Owner Portal with sequential numbering and instant email transmission.
              </span>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};
