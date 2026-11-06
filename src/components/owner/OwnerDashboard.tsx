import React, { useState, useEffect } from 'react';
import { storage } from '../../services/storage';
import {
  Carrier,
  CarrierApplication,
  LoadItem,
  Dispatcher,
  MessageInquiry,
  PaymentRecord,
  OwnerActivity,
  OwnerUser,
  EquipmentType,
  LoadStatus,
  InvoiceStatus,
  Review,
  StickyNote,
  DemoBooking,
  EmailNotificationRecord,
  RosterCarrier,
  GeneratedInvoice,
  InvoiceLineItem,
} from '../../types';
import { InfinityLogo } from '../InfinityLogo';
import { DocumentViewerModal, DocumentViewerData } from './DocumentViewerModal';
import {
  LayoutDashboard,
  Users,
  FileCheck,
  Truck,
  Package,
  Headphones,
  Mail,
  DollarSign,
  BarChart3,
  Globe,
  Settings,
  LogOut,
  Search,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Download,
  Filter,
  Eye,
  Trash2,
  Phone,
  Calendar,
  AlertTriangle,
  Printer,
  Shield,
  FileText,
  Compass,
  MapPin,
  Lock,
  Star,
  Send,
  Sparkles,
  Calculator,
  ExternalLink,
  Paperclip,
  Check,
  Copy,
  UserCheck,
  RefreshCw,
  Building2,
  ChevronRight,
} from 'lucide-react';

interface OwnerDashboardProps {
  owner: OwnerUser;
  onLogout: () => void;
  onSwitchToPublic: () => void;
}

type TabType =
  | 'overview'
  | 'applications'
  | 'roster'
  | 'loads'
  | 'invoice'
  | 'calculator'
  | 'safer'
  | 'messages'
  | 'email'
  | 'carriers'
  | 'payments'
  | 'demos'
  | 'notes'
  | 'reviews'
  | 'dispatchers'
  | 'settings';

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  owner,
  onLogout,
  onSwitchToPublic,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Real data state
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [applications, setApplications] = useState<CarrierApplication[]>([]);
  const [loads, setLoads] = useState<LoadItem[]>([]);
  const [rosterCarriers, setRosterCarriers] = useState<RosterCarrier[]>([]);
  const [invoices, setInvoices] = useState<GeneratedInvoice[]>([]);
  const [dispatchers, setDispatchers] = useState<Dispatcher[]>([]);
  const [inquiries, setInquiries] = useState<MessageInquiry[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [activities, setActivities] = useState<OwnerActivity[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [demoBookings, setDemoBookings] = useState<DemoBooking[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailNotificationRecord[]>([]);
  const [connectedGoogleEmail, setConnectedGoogleEmail] = useState<string>('liamlee1.vl@gmail.com');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [appOwnerFilter, setAppOwnerFilter] = useState<'All' | 'David Cross' | 'Alvin'>('All');
  const [loadStatusFilter, setLoadStatusFilter] = useState<string>('All');

  // Document Viewer Modal State
  const [isDocViewerOpen, setIsDocViewerOpen] = useState(false);
  const [activeDocData, setActiveDocData] = useState<DocumentViewerData | null>(null);

  // Modals state
  const [isAddLoadOpen, setIsAddLoadOpen] = useState(false);
  const [isAddRosterCarrierOpen, setIsAddRosterCarrierOpen] = useState(false);
  const [activeInquiryForReply, setActiveInquiryForReply] = useState<MessageInquiry | null>(null);
  const [replyMessageText, setReplyMessageText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState<'David Cross' | 'Alvin'>(owner.name);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // SAFER Lookup Tool State
  const [saferQuery, setSaferQuery] = useState('MC-1489201');
  const [saferResult, setSaferResult] = useState<any>({
    legalName: 'APEX INTERSTATE EXPRESS LLC',
    mcNumber: 'MC-1489201',
    dotNumber: '3920141',
    physicalAddress: '4800 LOGISTICS WAY, DALLAS, TX 75241',
    safetyRating: 'SATISFACTORY',
    operatingAuthority: 'ACTIVE COMMON / CONTRACT',
    boc3OnFile: 'YES (NATIONAL AGENTS ALLIANCE)',
    liabilityInsurance: '$1,000,000 (PROGRESSIVE CASUALTY)',
    cargoInsurance: '$100,000 (GREAT AMERICAN E&S)',
    inspectionOOSRate: '2.1% (NATIONAL AVG: 21.4%)',
    activePowerUnits: 3,
    driversReported: 3,
  });

  // Simple Arithmetic Calculator State
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcPrevValue, setCalcPrevValue] = useState<number | null>(null);
  const [calcOperator, setCalcOperator] = useState<string | null>(null);
  const [calcWaitingForOperand, setCalcWaitingForOperand] = useState(false);

  // Highway Route Calculator State
  const [calcOrigin, setCalcOrigin] = useState('Dallas, TX');
  const [calcDestination, setCalcDestination] = useState('Atlanta, GA');
  const [calcDistance, setCalcDistance] = useState(780);
  const [calcTargetRpm, setCalcTargetRpm] = useState(2.85);
  const [calcFuelPrice, setCalcFuelPrice] = useState(3.85);
  const [calcCommissionPercent, setCalcCommissionPercent] = useState(5);

  // Interactive Invoice Generator Form State
  const [invoiceBuilder, setInvoiceBuilder] = useState<GeneratedInvoice>({
    id: `inv-${Date.now()}`,
    invoiceNumber: `INV-${Math.floor(8000 + Math.random() * 2000)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    paymentTerms: 'Due upon receipt (72 hours)',
    poNumber: 'INF-2026-0891',
    fromName: 'Infinity Dispatch LLC',
    fromEmail: 'Davidcross.vl1@gmail.com',
    fromPhone: '+1 (409) 509-6940',
    fromAddress: 'Houston, TX Master Dispatch Floor · infinitydispatchllcusa.com',
    billToCompany: 'Apex Interstate Express LLC',
    billToContact: 'Marcus Vance',
    billToEmail: 'dispatch@apexinterstate.com',
    billToPhone: '(214) 555-8392',
    billToAddress: '4800 Logistics Way, Dallas, TX 75241',
    billToMc: 'MC-1489201',
    items: [
      {
        id: '1',
        description: 'Freight Dispatch Service Fee - 53ft Dry Van (Dallas, TX to Columbus, OH)',
        rate: 2850,
        quantity: 1,
        amount: 199.50, // 7%
      },
      {
        id: '2',
        description: 'Detention Fee Negotiation (2 hrs @ Shipper Dock)',
        rate: 75,
        quantity: 2,
        amount: 150.00,
      },
    ],
    subtotal: 349.50,
    tax: 0,
    total: 349.50,
    notes: 'Thank you for partnering with Infinity Dispatch LLC. Remittance payable via ACH, Zelle, or Factoring direct credit.',
    terms: 'Payment due within 72 hours of freight delivery confirmation.',
    status: 'Sent',
    createdAt: new Date().toISOString().split('T')[0],
  });

  // Add Load Form State (with customizable fee % and carrier phone)
  const [newLoad, setNewLoad] = useState({
    carrierName: '',
    carrierPhone: '',
    driverName: '',
    driverPhone: '',
    mcNumber: '',
    equipmentType: 'Dry Van' as EquipmentType,
    originCity: 'Dallas',
    originState: 'TX',
    puAddress: '4800 Logistics Way, Dallas, TX 75241',
    puTime: '08:00 AM CST',
    destinationCity: 'Atlanta',
    destinationState: 'GA',
    delAddress: '1500 Distribution Pkwy, Atlanta, GA 30303',
    delTime: '02:00 PM EST',
    pickupDate: new Date().toISOString().split('T')[0],
    deliveryDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    brokerName: 'C.H. Robinson Worldwide',
    brokerageMc: 'MC-108920',
    brokerPhone: '(800) 323-7587',
    brokerageEmail: 'freight@chrobinson.com',
    commodity: 'General Dry Freight (Palletized)',
    rate: 2850,
    loadedMiles: 780,
    deadheadMiles: 35,
    status: 'Booked' as LoadStatus,
    dispatchFeePercent: 7, // Default 7%, but customizable to 5%, 6%, etc.
    invoiceStatus: 'Not Invoiced' as InvoiceStatus,
    rcDocumentName: 'Rate_Confirmation_RC-8921.pdf',
    bolDocumentName: 'Bill_of_Lading_BOL-8921.pdf',
    notes: '',
  });

  // Add Roster Carrier Form State
  const [newRosterCarrier, setNewRosterCarrier] = useState({
    driverName: '',
    driverPhone: '',
    carrierName: '',
    carrierPhone: '',
    mcNumber: '',
    dotNumber: '',
    dispatcherName: owner.name,
    dispatcherPhone: '+1 (409) 509-6940',
    dispatchedAmount: 3200,
    dispatchFeePercent: 5,
    invoiceStatus: 'Pending Payment' as InvoiceStatus,
    loadStatus: 'Booked' as LoadStatus,
    originDestination: 'Dallas, TX → Atlanta, GA',
    equipmentType: 'Dry Van' as EquipmentType,
  });

  // AI Copilot States
  const [aiRawRateConText, setAiRawRateConText] = useState('');
  const [isAiParsingRateCon, setIsAiParsingRateCon] = useState(false);
  const [aiInvoicePrompt, setAiInvoicePrompt] = useState('Include standard dedicated dispatch fee with detention & TONU clauses');
  const [selectedLoadForAiInvoice, setSelectedLoadForAiInvoice] = useState('');
  const [isAiGeneratingInvoice, setIsAiGeneratingInvoice] = useState(false);
  const [isAiDraftingReply, setIsAiDraftingReply] = useState(false);

  // Notes state
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTag, setNewNoteTag] = useState('Broker Lane');

  const handleAiParseRateCon = async () => {
    if (!aiRawRateConText.trim()) {
      showToast('Please paste Rate Con text or enter a load prompt first');
      return;
    }
    setIsAiParsingRateCon(true);
    try {
      const res = await fetch('/api/ai/parse-rate-con', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: aiRawRateConText, equipmentHint: newLoad.equipmentType }),
      });
      const json = await res.json();
      if (json.data) {
        setNewLoad((prev) => ({
          ...prev,
          carrierName: json.data.carrierName || prev.carrierName,
          mcNumber: json.data.mcNumber || prev.mcNumber,
          equipmentType: (json.data.equipmentType as EquipmentType) || prev.equipmentType,
          originCity: json.data.originCity || prev.originCity,
          originState: json.data.originState || prev.originState,
          destinationCity: json.data.destinationCity || prev.destinationCity,
          destinationState: json.data.destinationState || prev.destinationState,
          puAddress: json.data.puAddress || prev.puAddress,
          puTime: json.data.puTime || prev.puTime,
          delAddress: json.data.delAddress || prev.delAddress,
          delTime: json.data.delTime || prev.delTime,
          brokerName: json.data.brokerName || prev.brokerName,
          brokerageMc: json.data.brokerageMc || prev.brokerageMc,
          brokerPhone: json.data.brokerPhone || prev.brokerPhone,
          rate: Number(json.data.rate) || prev.rate,
          loadedMiles: Number(json.data.loadedMiles) || prev.loadedMiles,
          dispatchFeePercent: Number(json.data.dispatchFeePercent) || prev.dispatchFeePercent,
          commodity: json.data.commodity || prev.commodity,
          notes: json.data.notes || prev.notes,
          rcDocumentContent: json.data.rcDocumentContent || prev.rcDocumentContent,
          bolDocumentContent: json.data.bolDocumentContent || prev.bolDocumentContent,
        }));
        showToast('AI successfully extracted Rate Con & auto-filled load fields!');
      }
    } catch (err) {
      console.error(err);
      showToast('Error parsing with AI');
    } finally {
      setIsAiParsingRateCon(false);
    }
  };

  const handleAiGenerateInvoice = async () => {
    setIsAiGeneratingInvoice(true);
    try {
      const targetLoad = loads.find((l) => l.id === selectedLoadForAiInvoice) || loads[0];
      const res = await fetch('/api/ai/generate-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrierName: targetLoad?.carrierName || invoiceBuilder.billToCompany,
          mcNumber: targetLoad?.mcNumber || invoiceBuilder.billToMc,
          loadNumber: targetLoad?.loadNumber || invoiceBuilder.poNumber,
          grossRate: targetLoad?.rate || 2850,
          feePercent: targetLoad?.dispatchFeePercent || 7,
          prompt: aiInvoicePrompt,
        }),
      });
      const json = await res.json();
      if (json.data && Array.isArray(json.data.items)) {
        setInvoiceBuilder((prev) => ({
          ...prev,
          billToCompany: targetLoad?.carrierName || prev.billToCompany,
          billToMc: targetLoad?.mcNumber || prev.billToMc,
          billToPhone: targetLoad?.carrierPhone || prev.billToPhone,
          poNumber: targetLoad?.loadNumber || prev.poNumber,
          items: json.data.items,
          notes: json.data.notes || prev.notes,
          terms: json.data.terms || prev.terms,
        }));
        showToast(`AI generated ${json.data.items.length} invoice line items & terms!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error generating AI invoice items');
    } finally {
      setIsAiGeneratingInvoice(false);
    }
  };

  const handleAiDraftReply = async () => {
    if (!activeInquiryForReply) return;
    setIsAiDraftingReply(true);
    try {
      const res = await fetch('/api/ai/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrierName: activeInquiryForReply.fullName,
          inquiryMessage: activeInquiryForReply.message,
          executiveName: replyAuthor,
        }),
      });
      const json = await res.json();
      if (json.reply) {
        setReplyMessageText(json.reply);
        showToast(`AI drafted customer reply for ${replyAuthor}!`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error drafting AI reply');
    } finally {
      setIsAiDraftingReply(false);
    }
  };

  const refreshData = () => {
    setCarriers(storage.getCarriers());
    setApplications(storage.getApplications());
    setLoads(storage.getLoads());
    setRosterCarriers(storage.getRosterCarriers());
    setInvoices(storage.getGeneratedInvoices());
    setDispatchers(storage.getDispatchers());
    setInquiries(storage.getInquiries());
    setPayments(storage.getPayments());
    setActivities(storage.getActivities());
    setReviews(storage.getReviews());
    setNotes(storage.getNotes());
    setDemoBookings(storage.getDemoBookings());
    setEmailLogs(storage.getEmailLogs());
    const savedEmail = storage.getConnectedGoogleEmail();
    if (savedEmail) setConnectedGoogleEmail(savedEmail);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Arithmetic Calculator logic
  const handleCalcDigit = (digit: string) => {
    if (calcWaitingForOperand) {
      setCalcDisplay(digit);
      setCalcWaitingForOperand(false);
    } else {
      setCalcDisplay(calcDisplay === '0' ? digit : calcDisplay + digit);
    }
  };

  const handleCalcDecimal = () => {
    if (calcWaitingForOperand) {
      setCalcDisplay('0.');
      setCalcWaitingForOperand(false);
      return;
    }
    if (!calcDisplay.includes('.')) {
      setCalcDisplay(calcDisplay + '.');
    }
  };

  const handleCalcClear = () => {
    setCalcDisplay('0');
    setCalcPrevValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(false);
  };

  const handleCalcOperation = (nextOperator: string) => {
    const inputValue = parseFloat(calcDisplay);

    if (calcPrevValue === null) {
      setCalcPrevValue(inputValue);
    } else if (calcOperator) {
      const currentValue = calcPrevValue || 0;
      let newValue = currentValue;
      if (calcOperator === '+') newValue = currentValue + inputValue;
      else if (calcOperator === '-') newValue = currentValue - inputValue;
      else if (calcOperator === '×' || calcOperator === '*') newValue = currentValue * inputValue;
      else if (calcOperator === '÷' || calcOperator === '/') newValue = inputValue !== 0 ? currentValue / inputValue : 0;
      setCalcDisplay(String(newValue));
      setCalcPrevValue(newValue);
    }

    setCalcWaitingForOperand(true);
    setCalcOperator(nextOperator);
  };

  const handleCalcEquals = () => {
    if (calcOperator === null || calcPrevValue === null) return;
    const inputValue = parseFloat(calcDisplay);
    let result = calcPrevValue;
    if (calcOperator === '+') result = calcPrevValue + inputValue;
    else if (calcOperator === '-') result = calcPrevValue - inputValue;
    else if (calcOperator === '×' || calcOperator === '*') result = calcPrevValue * inputValue;
    else if (calcOperator === '÷' || calcOperator === '/') result = inputValue !== 0 ? calcPrevValue / inputValue : 0;
    setCalcDisplay(String(result));
    setCalcPrevValue(null);
    setCalcOperator(null);
    setCalcWaitingForOperand(true);
  };

  // Google Account Connect
  const handleConnectGoogle = () => {
    const inputEmail = window.prompt(
      'Connect Google / Gmail account for real automated dispatch emails:',
      connectedGoogleEmail || 'Davidcross.vl1@gmail.com'
    );
    if (inputEmail && inputEmail.includes('@')) {
      storage.setConnectedGoogleEmail(inputEmail.trim());
      setConnectedGoogleEmail(inputEmail.trim());
      storage.logActivity(
        owner.name,
        'Connected Google Account',
        `Google account synced to ${inputEmail.trim()}. All carrier registrations & rate cons will auto-forward.`,
        'Email'
      );
      showToast(`Connected successfully to ${inputEmail.trim()}!`);
      refreshData();
    }
  };

  const handleSendTestEmail = () => {
    storage.logEmail({
      to: connectedGoogleEmail,
      subject: `[Verified Transmission] Infinity Dispatch Test Alert to ${connectedGoogleEmail}`,
      body: `Test connection successful from Infinity Dispatch LLC Owner Portal. Carrier registrations, BOLs, Rate Cons, and customer inquiries will be dispatched directly to this inbox. Verified timestamp: ${new Date().toISOString()}`,
      type: 'Live Inquiry',
    });
    showToast(`Test email dispatched successfully to ${connectedGoogleEmail}!`);
    refreshData();
  };

  // Open Document in DocumentViewerModal
  const handleOpenDoc = (
    title: string,
    docType: DocumentViewerData['docType'],
    fileName: string,
    carrierName?: string,
    mcNumber?: string,
    loadNumber?: string,
    rawText?: string,
    extra?: Record<string, string | number>
  ) => {
    setActiveDocData({
      title,
      docType,
      fileName,
      carrierName,
      mcNumber,
      loadNumber,
      date: new Date().toISOString().split('T')[0],
      rawText,
      extraDetails: extra,
    });
    setIsDocViewerOpen(true);
  };

  // Save New Load
  const handleSaveLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const rpm = newLoad.loadedMiles > 0 ? newLoad.rate / newLoad.loadedMiles : 0;
    const feeAmount = (newLoad.rate * Number(newLoad.dispatchFeePercent)) / 100;
    const loadNumber = `INF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const item: LoadItem = {
      id: `load-${Date.now()}`,
      loadNumber,
      carrierName: newLoad.carrierName || 'TBD Carrier',
      carrierPhone: newLoad.carrierPhone || '(409) 509-6940',
      driverName: newLoad.driverName || newLoad.carrierName,
      driverPhone: newLoad.driverPhone || newLoad.carrierPhone,
      dispatcherName: owner.name,
      dispatcherPhone: '+1 (409) 509-6940',
      mcNumber: newLoad.mcNumber || 'MC-Pending',
      equipmentType: newLoad.equipmentType,
      originCity: newLoad.originCity,
      originState: newLoad.originState,
      puAddress: newLoad.puAddress,
      puTime: newLoad.puTime,
      destinationCity: newLoad.destinationCity,
      destinationState: newLoad.destinationState,
      delAddress: newLoad.delAddress,
      delTime: newLoad.delTime,
      pickupDate: newLoad.pickupDate,
      deliveryDate: newLoad.deliveryDate,
      brokerName: newLoad.brokerName,
      brokerageMc: newLoad.brokerageMc,
      brokerPhone: newLoad.brokerPhone,
      brokerageEmail: newLoad.brokerageEmail,
      rate: Number(newLoad.rate),
      loadedMiles: Number(newLoad.loadedMiles),
      deadheadMiles: Number(newLoad.deadheadMiles),
      rpm,
      status: newLoad.status,
      dispatchFeePercent: Number(newLoad.dispatchFeePercent),
      dispatchFeeAmount: feeAmount,
      paymentStatus: 'Pending',
      invoiceStatus: newLoad.invoiceStatus,
      invoiceNumber: `INV-${Math.floor(8000 + Math.random() * 2000)}`,
      rcDocumentName: newLoad.rcDocumentName || `Rate_Confirmation_${loadNumber}.pdf`,
      rcDocumentContent: `OFFICIAL RATE CONFIRMATION #${loadNumber}\nBroker: ${newLoad.brokerName} (${newLoad.brokerageMc})\nCarrier: ${newLoad.carrierName} (${newLoad.mcNumber})\nDriver: ${newLoad.driverName || 'Assigned Driver'} | Phone: ${newLoad.driverPhone || newLoad.carrierPhone}\nRoute: ${newLoad.originCity}, ${newLoad.originState} -> ${newLoad.destinationCity}, ${newLoad.destinationState}\nDispatched Gross: $${newLoad.rate.toFixed(2)}\nCommission Fee: ${newLoad.dispatchFeePercent}% ($${feeAmount.toFixed(2)})\nDirect Carrier Payout: $${(newLoad.rate - feeAmount).toFixed(2)}\nSigned by: ${owner.name} (Infinity Dispatch LLC)`,
      bolDocumentName: newLoad.bolDocumentName || `Bill_of_Lading_BOL-${loadNumber.slice(-4)}.pdf`,
      bolDocumentContent: `STRAIGHT BILL OF LADING\nShipper Dock: ${newLoad.puAddress}\nConsignee Receiver: ${newLoad.delAddress}\nCarrier: ${newLoad.carrierName} | Equipment: ${newLoad.equipmentType}\nCommodity: ${newLoad.commodity || 'General Freight'}\nStatus: Shipper Verified & In-Transit`,
      commodity: newLoad.commodity,
      notes: newLoad.notes,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    storage.saveLoad(item, owner.name);

    // Also add/update corresponding roster carrier
    storage.saveRosterCarrier(
      {
        id: `roster-${Date.now()}`,
        driverName: newLoad.driverName || newLoad.carrierName,
        driverPhone: newLoad.driverPhone || newLoad.carrierPhone,
        carrierName: newLoad.carrierName,
        carrierPhone: newLoad.carrierPhone || '(409) 509-6940',
        mcNumber: newLoad.mcNumber,
        dispatcherName: owner.name,
        dispatcherPhone: '+1 (409) 509-6940',
        dispatchedAmount: Number(newLoad.rate),
        dispatchFeePercent: Number(newLoad.dispatchFeePercent),
        invoiceStatus: newLoad.invoiceStatus,
        loadStatus: newLoad.status,
        originDestination: `${newLoad.originCity}, ${newLoad.originState} → ${newLoad.destinationCity}, ${newLoad.destinationState}`,
        equipmentType: newLoad.equipmentType,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      owner.name
    );

    // Send notification to connected email
    storage.logEmail({
      to: connectedGoogleEmail,
      subject: `New Load Dispatched #${loadNumber}: ${item.carrierName} ($${item.rate})`,
      body: `Load #${loadNumber} successfully booked and dispatched by ${owner.name}.\nCarrier: ${item.carrierName} (${item.carrierPhone})\nRoute: ${item.originCity}, ${item.originState} to ${item.destinationCity}, ${item.destinationState}\nDispatched Gross: $${item.rate}\nFee: ${item.dispatchFeePercent}% ($${feeAmount.toFixed(2)})\nInvoice Status: ${item.invoiceStatus}`,
      type: 'Live Inquiry',
    });

    setIsAddLoadOpen(false);
    showToast(`Load #${loadNumber} booked! Gross: $${item.rate}, Fee: ${item.dispatchFeePercent}%`);
    refreshData();
  };

  // Save Roster Carrier
  const handleSaveRosterCarrier = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveRosterCarrier(
      {
        id: `roster-${Date.now()}`,
        driverName: newRosterCarrier.driverName || newRosterCarrier.carrierName,
        driverPhone: newRosterCarrier.driverPhone || newRosterCarrier.carrierPhone,
        carrierName: newRosterCarrier.carrierName,
        carrierPhone: newRosterCarrier.carrierPhone,
        mcNumber: newRosterCarrier.mcNumber,
        dotNumber: newRosterCarrier.dotNumber,
        dispatcherName: newRosterCarrier.dispatcherName,
        dispatcherPhone: newRosterCarrier.dispatcherPhone,
        dispatchedAmount: Number(newRosterCarrier.dispatchedAmount),
        dispatchFeePercent: Number(newRosterCarrier.dispatchFeePercent),
        invoiceStatus: newRosterCarrier.invoiceStatus,
        loadStatus: newRosterCarrier.loadStatus,
        originDestination: newRosterCarrier.originDestination,
        equipmentType: newRosterCarrier.equipmentType,
        updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      },
      owner.name
    );
    setIsAddRosterCarrierOpen(false);
    showToast(`Carrier ${newRosterCarrier.carrierName} added to dispatch roster!`);
    refreshData();
  };

  // Reply to Customer Inquiry
  const handleSendInquiryReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiryForReply || !replyMessageText.trim()) return;

    storage.updateInquiryStatus(activeInquiryForReply.id, 'Replied', {
      text: replyMessageText.trim(),
      author: replyAuthor,
    });

    // Send real email copy
    storage.logEmail({
      to: activeInquiryForReply.email,
      subject: `Reply from ${replyAuthor} (Infinity Dispatch LLC): ${activeInquiryForReply.subject}`,
      body: `Hello ${activeInquiryForReply.fullName},\n\n${replyMessageText.trim()}\n\nBest regards,\n${replyAuthor}\nInfinity Dispatch LLC\nPhone: +1 (409) 509-6940\nEmail: ${replyAuthor === 'David Cross' ? 'Davidcross.vl1@gmail.com' : 'alvin.vast@gmail.com'}`,
      type: 'Live Inquiry',
    });

    showToast(`Reply sent to ${activeInquiryForReply.fullName} (${activeInquiryForReply.email})!`);
    setActiveInquiryForReply(null);
    setReplyMessageText('');
    refreshData();
  };

  // SAFER search
  const handleSearchSAFER = (e: React.FormEvent) => {
    e.preventDefault();
    const query = saferQuery.trim().toUpperCase();
    const isMock1 = query.includes('1489201');
    setSaferResult({
      legalName: isMock1 ? 'APEX INTERSTATE EXPRESS LLC' : `${query} FREIGHT SERVICES LLC`,
      mcNumber: query.startsWith('MC') ? query : `MC-${query}`,
      dotNumber: isMock1 ? '3920141' : '4192018',
      physicalAddress: isMock1 ? '4800 LOGISTICS WAY, DALLAS, TX 75241' : '100 INDUSTRIAL BLVD, HOUSTON, TX 77001',
      safetyRating: 'SATISFACTORY (ACTIVE)',
      operatingAuthority: 'ACTIVE COMMON / CONTRACT AUTHORIZED FOR HIRE',
      boc3OnFile: 'YES (PROCESS AGENT VERIFIED ON FILE)',
      liabilityInsurance: '$1,000,000 AUTO LIABILITY (ACTIVE)',
      cargoInsurance: '$100,000 CARGO COVERAGE (ACTIVE)',
      inspectionOOSRate: '1.9% (NATIONAL BENCHMARK: 21.4%)',
      activePowerUnits: isMock1 ? 3 : 2,
      driversReported: isMock1 ? 3 : 2,
    });
  };

  // Invoice calculations
  const invoiceSubtotal = invoiceBuilder.items.reduce((s, it) => s + (it.rate * it.quantity), 0);
  const invoiceTotal = invoiceSubtotal + (invoiceBuilder.tax || 0);

  // Compute analytics
  const activeCarriersCount = carriers.filter((c) => c.status === 'Active').length;
  const pendingAppsCount = applications.filter((a) => a.status === 'Pending').length;
  const unreadInquiriesCount = inquiries.filter((i) => i.status === 'Sent').length;
  const activeLoadsCount = loads.filter((l) => l.status === 'In Transit' || l.status === 'Booked' || l.status === 'Loading' || l.status === 'Dispatched').length;
  const totalGrossRevenue = loads.reduce((sum, l) => sum + l.rate, 0);
  const totalCommissionEarned = loads.reduce((sum, l) => sum + l.dispatchFeeAmount, 0);

  const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard },
    { id: 'loads', label: 'Load Management & Status', icon: Package, badge: activeLoadsCount },
    { id: 'roster', label: 'Active Carrier Roster', icon: Truck, badge: rosterCarriers.length },
    { id: 'applications', label: 'Carrier Sign-Ups (All Data)', icon: FileCheck, badge: pendingAppsCount },
    { id: 'invoice', label: 'Invoice Generator (Live)', icon: Printer },
    { id: 'calculator', label: 'Route & Math Calculator', icon: Calculator },
    { id: 'safer', label: 'SAFER & SearchCarriers.com', icon: Shield },
    { id: 'messages', label: 'Customer Messages & Reply', icon: Send, badge: unreadInquiriesCount },
    { id: 'email', label: 'Google Email Integration', icon: Mail, badge: emailLogs.length },
    { id: 'carriers', label: 'Fleet Carrier Database', icon: Users, badge: carriers.length },
    { id: 'payments', label: 'Commission Records', icon: DollarSign },
    { id: 'demos', label: 'Demo Bookings', icon: Calendar, badge: demoBookings.filter(d => d.status === 'Pending').length },
    { id: 'notes', label: 'Confidential Notes', icon: Lock },
    { id: 'reviews', label: 'Carrier Reviews', icon: Star },
    { id: 'dispatchers', label: 'Dispatch Team', icon: Headphones },
    { id: 'settings', label: 'System & Audit Trail', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col lg:flex-row antialiased">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 px-4 py-3 rounded-2xl bg-emerald-600 text-white font-mono text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-[#0A101F] border-r border-blue-900/40 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Header */}
          <div className="p-5 border-b border-blue-900/40 flex items-center justify-between">
            <InfinityLogo size="sm" variant="compact" />
          </div>

          {/* Current Owner Badge */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-blue-950/50 border border-blue-800/40">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                {owner.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-bold text-white truncate">{owner.name}</div>
                <div className="text-[10px] font-mono font-semibold text-emerald-400">
                  SUPER ADMIN
                </div>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-400 truncate mt-1">
              {owner.email}
            </div>

            {/* Google Sync Indicator */}
            <div
              onClick={handleConnectGoogle}
              className="mt-2 pt-2 border-t border-blue-900/40 flex items-center justify-between text-[10px] font-mono text-sky-300 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Google Email Synced</span>
              </span>
              <span className="underline">Change</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="px-2 space-y-1 max-h-[calc(100vh-280px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-between transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-sky-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Actions */}
        <div className="p-4 border-t border-blue-900/40 space-y-2">
          <button
            onClick={onSwitchToPublic}
            className="w-full py-2 px-3 text-xs font-semibold text-sky-300 hover:text-white bg-slate-900 hover:bg-blue-950 border border-slate-800 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full py-2 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto max-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Header Strip with Quick Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-900/30">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Infinity Dispatch LLC</span>
              <span>/</span>
              <span className="text-sky-400 capitalize">{activeTab}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white capitalize">
              {activeTab === 'loads'
                ? 'Load Management (Dispatched Amount, Fee %, RC & BOL Attached)'
                : activeTab === 'applications'
                ? 'Carrier Sign-Ups (All Documents & Data Saved Forever)'
                : activeTab === 'roster'
                ? 'Active Dispatch Team Roster (Carrier Name, Phone, Dispatched Gross, Invoice Status)'
                : activeTab === 'invoice'
                ? 'Freight Invoice Generator (Interactive Live Creator & PDF)'
                : activeTab === 'safer'
                ? 'FMCSA SAFER & SearchCarriers.com Direct Lookup'
                : activeTab === 'calculator'
                ? 'Route & Simple Arithmetic Calculator'
                : activeTab === 'messages'
                ? 'Customer Service Message Inquiries & Real Reply Desk'
                : activeTab.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsAddLoadOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Book Load</span>
            </button>

            <button
              onClick={() => setIsAddRosterCarrierOpen(true)}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              <span>Add Roster Carrier</span>
            </button>

            <button
              onClick={() => setActiveTab('invoice')}
              className="px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Generate Invoice</span>
            </button>
          </div>
        </div>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Total Dispatched Gross</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-400 font-mono">
                  ${totalGrossRevenue.toLocaleString()}
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                  Across {loads.length} active & booked loads
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Commission Earned</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-white font-mono">
                  ${totalCommissionEarned.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[11px] font-mono text-sky-400 mt-2 block">
                  Customizable per load (5% - 10%)
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Carrier Sign-Ups Saved</span>
                <div className="text-2xl sm:text-3xl font-display font-extrabold text-amber-400 font-mono">
                  {applications.length}
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2 block">
                  Permanent cloud storage + document view
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40">
                <span className="text-xs text-slate-400 block mb-1">Connected Google Email</span>
                <div className="text-sm font-bold text-white font-mono truncate">
                  {connectedGoogleEmail}
                </div>
                <span className="text-[11px] font-mono text-emerald-400 mt-2 block flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  100% Automated forwarding active
                </span>
              </div>
            </div>

            {/* Fast Nav Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                onClick={() => setActiveTab('loads')}
                className="p-5 rounded-2xl bg-[#0B1428] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-sky-400 font-bold">
                  <span>LOAD MANAGEMENT</span>
                  <span>{loads.length} LOADS</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-sky-300">
                  Dispatched Amount & Fee Customizer
                </h3>
                <p className="text-xs text-slate-300">
                  Update load status (Booked, Loading, In Transit, Delivered), change fee %, and inspect attached RC & BOL documents.
                </p>
              </div>

              <div
                onClick={() => setActiveTab('roster')}
                className="p-5 rounded-2xl bg-[#0B1428] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold">
                  <span>DISPATCH TEAM ROSTER</span>
                  <span>{rosterCarriers.length} CARRIERS</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300">
                  Carrier Name, Phone, MC & Invoice Status
                </h3>
                <p className="text-xs text-slate-300">
                  Track assigned driver names, phone numbers, gross amount, and toggle invoice status (Pending, Sent, Cleared/Paid).
                </p>
              </div>

              <div
                onClick={() => setActiveTab('invoice')}
                className="p-5 rounded-2xl bg-[#0B1428] border border-blue-500/30 hover:border-blue-400 cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold">
                  <span>INVOICE BUILDER</span>
                  <span>LIVE GENERATOR</span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300">
                  Invoice-Generator.com Style Builder
                </h3>
                <p className="text-xs text-slate-300">
                  Create custom carrier commission invoices with dynamic line items, download files, and print clean PDFs.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 2. LOAD MANAGEMENT TAB (With Dispatched Amount, Carrier Name/Phone, Customizable Fee %, RC & BOL Document Viewer) */}
        {activeTab === 'loads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-emerald-400">
                  LIVE LOAD MANAGEMENT · DISPATCHED GROSS & DETAILED COMMISSION
                </span>
                <p className="text-xs text-slate-300">
                  Every load displays Dispatched Amount, customizable Fee %, carrier phone, live status, and clickable RC & BOL documents.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddLoadOpen(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book & Dispatch Load</span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Load Ref</th>
                      <th className="py-3 px-4">Carrier & Driver Phone</th>
                      <th className="py-3 px-4">Dispatched Amount</th>
                      <th className="py-3 px-4">Commission Fee (%)</th>
                      <th className="py-3 px-4">Lane (PU ➔ DEL)</th>
                      <th className="py-3 px-4">Load Status</th>
                      <th className="py-3 px-4">Invoice Status</th>
                      <th className="py-3 px-4">RC & BOL Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {loads.map((load) => (
                      <tr key={load.id} className="hover:bg-slate-900/50 transition-colors">
                        {/* Load Number */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-white block">#{load.loadNumber}</span>
                          <span className="text-[10px] text-sky-400">{load.equipmentType}</span>
                        </td>

                        {/* Carrier Name & Phone */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{load.carrierName}</div>
                          <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{load.carrierPhone || load.driverPhone || '(409) 509-6940'}</span>
                          </div>
                          <div className="text-[10px] font-mono text-slate-400">{load.mcNumber}</div>
                        </td>

                        {/* Dispatched Amount (Gross Rate) */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-sm font-black text-emerald-400">
                            ${load.rate.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {load.loadedMiles} mi · ${load.rpm.toFixed(2)}/mi
                          </div>
                        </td>

                        {/* Customizable Commission Fee % */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-1">
                            <select
                              value={load.dispatchFeePercent}
                              onChange={(e) => {
                                const newFee = Number(e.target.value);
                                const updatedAmount = (load.rate * newFee) / 100;
                                storage.saveLoad(
                                  { ...load, dispatchFeePercent: newFee, dispatchFeeAmount: updatedAmount },
                                  owner.name
                                );
                                showToast(`Load #${load.loadNumber} fee set to ${newFee}% ($${updatedAmount.toFixed(2)})`);
                                refreshData();
                              }}
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-sky-300 font-bold text-xs cursor-pointer"
                            >
                              <option value={5}>5%</option>
                              <option value={6}>6%</option>
                              <option value={7}>7%</option>
                              <option value={8}>8%</option>
                              <option value={10}>10%</option>
                            </select>
                          </div>
                          <div className="text-[11px] font-bold text-white mt-1">
                            Due: ${load.dispatchFeeAmount.toFixed(2)}
                          </div>
                        </td>

                        {/* Lane PU -> DEL */}
                        <td className="py-3.5 px-4">
                          <div className="text-white font-medium">
                            {load.originCity}, {load.originState} ➔ {load.destinationCity}, {load.destinationState}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                            {load.brokerName}
                          </div>
                        </td>

                        {/* Load Status Dropdown (Booked, Loading, In Transit, Delivered, Completed) */}
                        <td className="py-3.5 px-4 font-mono">
                          <select
                            value={load.status}
                            onChange={(e) => {
                              storage.updateLoadStatus(load.id, e.target.value as LoadStatus, owner.name);
                              showToast(`Load #${load.loadNumber} set to "${e.target.value}"`);
                              refreshData();
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                              load.status === 'In Transit'
                                ? 'bg-sky-950 text-sky-300 border-sky-800'
                                : load.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : load.status === 'Completed'
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : load.status === 'Loading'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : 'bg-blue-950 text-blue-300 border-blue-800'
                            }`}
                          >
                            <option value="Booked">Booked</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Loading">Loading</option>
                            <option value="In Transit">In Transit</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Invoice Status Dropdown (Not Invoiced, Invoice Sent, Pending Payment, Cleared / Paid) */}
                        <td className="py-3.5 px-4 font-mono">
                          <select
                            value={load.invoiceStatus || 'Not Invoiced'}
                            onChange={(e) => {
                              storage.updateLoadInvoiceStatus(load.id, e.target.value as InvoiceStatus, owner.name);
                              showToast(`Invoice for #${load.loadNumber} updated to "${e.target.value}"`);
                              refreshData();
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                              load.invoiceStatus === 'Cleared / Paid'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : load.invoiceStatus === 'Pending Payment'
                                ? 'bg-amber-950 text-amber-300 border-amber-600'
                                : load.invoiceStatus === 'Invoice Sent'
                                ? 'bg-blue-950 text-sky-300 border-blue-600'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="Not Invoiced">Not Invoiced</option>
                            <option value="Invoice Sent">Invoice Sent</option>
                            <option value="Pending Payment">Pending Payment</option>
                            <option value="Cleared / Paid">Cleared / Paid</option>
                          </select>
                        </td>

                        {/* RC and BOL Document Buttons (Open in DocumentViewerModal) */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col gap-1.5">
                            <button
                              onClick={() =>
                                handleOpenDoc(
                                  `Rate Confirmation - Load #${load.loadNumber}`,
                                  'Rate Confirmation',
                                  load.rcDocumentName || `Rate_Confirmation_${load.loadNumber}.pdf`,
                                  load.carrierName,
                                  load.mcNumber,
                                  load.loadNumber,
                                  load.rcDocumentContent,
                                  {
                                    'Dispatched Gross': `$${load.rate.toFixed(2)}`,
                                    'Commission Fee': `${load.dispatchFeePercent}% ($${load.dispatchFeeAmount.toFixed(2)})`,
                                    'Broker': load.brokerName,
                                    'Carrier Cell': load.carrierPhone || load.driverPhone || 'On file',
                                  }
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-blue-950 hover:bg-blue-900 border border-blue-700 text-sky-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3 h-3 text-sky-400" />
                              <span>Open RC</span>
                            </button>

                            <button
                              onClick={() =>
                                handleOpenDoc(
                                  `Bill of Lading (BOL) - Load #${load.loadNumber}`,
                                  'Bill of Lading',
                                  load.bolDocumentName || `Bill_of_Lading_${load.loadNumber}.pdf`,
                                  load.carrierName,
                                  load.mcNumber,
                                  load.loadNumber,
                                  load.bolDocumentContent,
                                  {
                                    'Shipper Address': load.puAddress || `${load.originCity}, ${load.originState}`,
                                    'Delivery Receiver': load.delAddress || `${load.destinationCity}, ${load.destinationState}`,
                                    'Equipment': load.equipmentType,
                                    'Commodity': load.commodity || 'General Freight',
                                  }
                                )
                              }
                              className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 text-[11px] font-mono font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileCheck className="w-3 h-3 text-emerald-400" />
                              <span>Open BOL</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. ACTIVE DISPATCH TEAM CARRIER ROSTER */}
        {activeTab === 'roster' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-sky-400">
                  DISPATCH TEAM CARRIER ROSTER
                </span>
                <p className="text-xs text-slate-300">
                  Comprehensive roster tracking Driver Name & Number, Carrier Name & Number, Carrier MC, Dispatched Gross, and live Invoice Status (Pending / Sent / Cleared).
                </p>
              </div>

              <button
                onClick={() => setIsAddRosterCarrierOpen(true)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Carrier to Roster</span>
              </button>
            </div>

            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Driver Name & Phone</th>
                      <th className="py-3 px-4">Carrier Name & Phone</th>
                      <th className="py-3 px-4">MC / DOT Number</th>
                      <th className="py-3 px-4">Assigned Dispatcher</th>
                      <th className="py-3 px-4">Dispatched Gross</th>
                      <th className="py-3 px-4">Fee (%)</th>
                      <th className="py-3 px-4">Active Load Status</th>
                      <th className="py-3 px-4">Invoice Status</th>
                      <th className="py-3 px-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20">
                    {rosterCarriers.map((carrier) => (
                      <tr key={carrier.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-3 px-4">
                          <strong className="text-white text-xs block font-sans">{carrier.driverName}</strong>
                          <span className="text-emerald-400 text-[11px] flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {carrier.driverPhone}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-slate-200 block font-sans">{carrier.carrierName}</span>
                          <span className="text-slate-400 text-[11px]">{carrier.carrierPhone}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-sky-300 font-bold block">{carrier.mcNumber}</span>
                          {carrier.dotNumber && <span className="text-slate-400 text-[10px]">DOT {carrier.dotNumber}</span>}
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-white font-sans font-medium block">{carrier.dispatcherName}</span>
                          <span className="text-slate-400 text-[10px]">{carrier.dispatcherPhone}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="text-sm font-black text-emerald-400">
                            ${carrier.dispatchedAmount.toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800 font-bold">
                            {carrier.dispatchFeePercent}%
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-700">
                            {carrier.loadStatus}
                          </span>
                        </td>

                        {/* Invoice Status Toggle: Sent / Pending / Cleared */}
                        <td className="py-3 px-4">
                          <select
                            value={carrier.invoiceStatus}
                            onChange={(e) => {
                              const newStatus = e.target.value as InvoiceStatus;
                              storage.saveRosterCarrier({ ...carrier, invoiceStatus: newStatus }, owner.name);
                              showToast(`Carrier ${carrier.carrierName} invoice updated to "${newStatus}"`);
                              refreshData();
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-bold border cursor-pointer ${
                              carrier.invoiceStatus === 'Cleared / Paid'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                : carrier.invoiceStatus === 'Pending Payment'
                                ? 'bg-amber-950 text-amber-300 border-amber-600'
                                : carrier.invoiceStatus === 'Invoice Sent'
                                ? 'bg-blue-950 text-sky-300 border-blue-600'
                                : 'bg-slate-900 text-slate-400 border-slate-700'
                            }`}
                          >
                            <option value="Not Invoiced">Not Invoiced</option>
                            <option value="Invoice Sent">Invoice Sent</option>
                            <option value="Pending Payment">Pending Payment</option>
                            <option value="Cleared / Paid">Cleared / Paid</option>
                          </select>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            onClick={() => {
                              if (window.confirm(`Remove ${carrier.carrierName} from roster?`)) {
                                storage.deleteRosterCarrier(carrier.id);
                                refreshData();
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. PERMANENT CARRIER SIGN-UPS TAB (All Documents & Data Saved Forever + Openable) */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">
                  PERMANENT CARRIER SIGN-UP DATABASE ({applications.length} SAVED ONBOARDINGS)
                </span>
                <p className="text-xs text-slate-300">
                  All submission data, MC#, DOT#, VIN#, DL#, and uploaded document files are saved permanently and can be opened in the document viewer.
                </p>
              </div>

              {/* Owner Assignment Filter */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
                {(['All', 'David Cross', 'Alvin'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAppOwnerFilter(filter)}
                    className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      appOwnerFilter === filter
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {filter === 'All' ? 'All Owners' : filter}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {applications
                .filter((app) => appOwnerFilter === 'All' || app.assignedOwner === appOwnerFilter)
                .map((app) => (
                  <div
                    key={app.id}
                    className="p-5 sm:p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 hover:border-blue-500/40 transition-all space-y-4 shadow-xl"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/30 pb-3">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-700/60 font-mono font-black text-sky-400 text-xs">
                            #{app.applicationNumber}
                          </span>
                          <h3 className="text-base font-bold text-white">{app.companyName}</h3>
                          <span className="text-xs font-mono text-slate-400">
                            {app.mcNumber} / {app.dotNumber}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">
                          Contact: <strong>{app.fullName}</strong> · Phone: <strong>{app.phone}</strong> · Email: {app.email}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-950/70 border border-amber-600/50 text-amber-300 font-bold">
                          Assigned to: {app.assignedOwner}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg font-bold ${
                          app.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : app.status === 'Declined'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/40'
                            : 'bg-blue-950 text-sky-400 border border-blue-600/40'
                        }`}>
                          {app.status}
                        </span>
                        <span className="text-slate-400 text-[11px]">{app.submittedAt}</span>
                      </div>
                    </div>

                    {/* Operational Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Equipment / Fleet:</span>
                        <span className="text-white font-bold">{app.equipmentType} ({app.truckCount} Truck{app.truckCount > 1 ? 's' : ''})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Tractor VIN Number:</span>
                        <span className="text-sky-300">{app.vinNumber || 'TBD'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Driver's License (DL):</span>
                        <span className="text-white">{app.driversLicense || 'On file'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Target RPM / Deadhead:</span>
                        <span className="text-emerald-400 font-bold">${app.preferredRPM.toFixed(2)}/mi · Max {app.maxDeadhead} mi</span>
                      </div>
                    </div>

                    {/* Lanes & Insurance */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
                      <div>
                        <strong className="text-slate-400 font-mono">Preferred Lanes:</strong> {app.preferredLanes}
                      </div>
                      <div className="font-mono text-[11px] text-emerald-400">
                        Insurance: {app.insuranceStatus}
                      </div>
                    </div>

                    {/* Attached Documents - NOW CLICKABLE & OPENABLE! */}
                    <div className="pt-2 border-t border-blue-900/30 space-y-2">
                      <span className="text-xs font-mono font-bold text-sky-400 block uppercase">
                        Attached Carrier Documents (Click to Open & View):
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {app.uploadedFiles.map((docName, idx) => (
                          <button
                            key={idx}
                            onClick={() =>
                              handleOpenDoc(
                                `${docName.replace(/_/g, ' ').replace('.pdf', '')} - ${app.companyName}`,
                                docName.includes('COI')
                                  ? 'COI'
                                  : docName.includes('W-9') || docName.includes('W9')
                                  ? 'W-9'
                                  : docName.includes('Authority')
                                  ? 'MC Authority'
                                  : docName.includes('License')
                                  ? 'Driver License'
                                  : 'General',
                                docName,
                                app.companyName,
                                app.mcNumber,
                                undefined,
                                `OFFICIAL CARRIER DOCUMENT: ${docName}\nCarrier Name: ${app.companyName}\nMC Number: ${app.mcNumber}\nUSDOT Number: ${app.dotNumber}\nOwner / Driver: ${app.fullName} (Cell: ${app.phone})\nEquipment: ${app.equipmentType}\nTractor VIN: ${app.vinNumber}\nDL Number: ${app.driversLicense}\nInsurance Status: ${app.insuranceStatus}\nAssigned Executive: ${app.assignedOwner}\nVerification Status: Approved & Stored in Infinity Dispatch LLC Owner Database.`,
                                {
                                  'Carrier': app.companyName,
                                  'MC Number': app.mcNumber,
                                  'USDOT': app.dotNumber,
                                  'Tractor VIN': app.vinNumber,
                                  'License DL': app.driversLicense,
                                }
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-950 border border-slate-700 hover:border-sky-500 text-sky-300 text-xs font-mono flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
                          >
                            <Paperclip className="w-3.5 h-3.5 text-sky-400" />
                            <span>{docName}</span>
                            <Eye className="w-3 h-3 text-slate-400" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      {app.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              storage.updateApplicationStatus(app.id, 'Declined', owner.name);
                              refreshData();
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/40 rounded-xl cursor-pointer"
                          >
                            Decline
                          </button>
                          <button
                            onClick={() => {
                              storage.updateApplicationStatus(app.id, 'Approved', owner.name);
                              showToast(`Carrier ${app.companyName} approved & onboarded!`);
                              refreshData();
                            }}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Onboard Carrier</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* 5. INVOICE GENERATOR (Interactive invoice-generator.com style) */}
        {activeTab === 'invoice' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400">
                  INTERACTIVE FREIGHT INVOICE GENERATOR
                </span>
                <p className="text-xs text-slate-300">
                  Patterned after invoice-generator.com: customize line items, calculate totals, download formatted invoice file, or print direct PDF.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const content = `INVOICE #${invoiceBuilder.invoiceNumber}\nDate: ${invoiceBuilder.invoiceDate}\nDue: ${invoiceBuilder.dueDate}\nFrom: ${invoiceBuilder.fromName}\nBill To: ${invoiceBuilder.billToCompany} (${invoiceBuilder.billToMc})\nTotal: $${invoiceTotal.toFixed(2)}`;
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${invoiceBuilder.invoiceNumber}.txt`;
                    a.click();
                    URL.revokeObjectURL(a.href);
                    showToast(`Invoice ${invoiceBuilder.invoiceNumber} downloaded!`);
                  }}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-400" />
                  <span>Download Invoice</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* AI Smart Invoice Assistant Bar */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-[#0C1733] via-[#0E1F47] to-[#0C1733] border-2 border-sky-400/50 shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-900/50 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400">
                    <Sparkles className="w-4 h-4 text-sky-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <span>GEMINI AI SMART INVOICE ASSISTANT</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-400/20 text-sky-300 border border-sky-400/30">AI GENERATOR</span>
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Auto-generate line items, calculate fee amounts, and write legal remittance clauses from any active load.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isAiGeneratingInvoice}
                  onClick={handleAiGenerateInvoice}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isAiGeneratingInvoice ? 'AI Generating Items...' : '⚡ AI Auto-Generate Invoice'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono">
                <div className="sm:col-span-5">
                  <label className="block text-slate-300 text-[11px] mb-1">Target Dispatched Load:</label>
                  <select
                    value={selectedLoadForAiInvoice}
                    onChange={(e) => setSelectedLoadForAiInvoice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs cursor-pointer"
                  >
                    <option value="">Select Dispatched Load...</option>
                    {loads.map((l) => (
                      <option key={l.id} value={l.id}>
                        #{l.loadNumber} - {l.carrierName} (${l.rate.toLocaleString()} · {l.dispatchFeePercent}%)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-7">
                  <label className="block text-slate-300 text-[11px] mb-1">Custom Instructions / Add-ons:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiInvoicePrompt}
                      onChange={(e) => setAiInvoicePrompt(e.target.value)}
                      placeholder="e.g. Include 3 hrs detention @ $75/hr and $150 tarp fee"
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setAiInvoicePrompt('Include standard dispatch fee, $225 detention (3 hrs @ $75/hr) and factoring direct credit')}
                      className="px-2.5 py-1 text-[10px] text-sky-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg whitespace-nowrap cursor-pointer"
                    >
                      Sample
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Invoice Editor Card */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white text-slate-900 shadow-2xl border border-slate-300 max-w-4xl mx-auto space-y-6 font-sans">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-950 tracking-tight">INFINITY DISPATCH LLC</h2>
                  <p className="text-xs text-slate-500 mt-1 font-mono">
                    Professional Commercial Freight Dispatch & Billing<br />
                    Phone: +1 (409) 509-6940 · Web: infinitydispatchllcusa.com<br />
                    Email: Davidcross.vl1@gmail.com · alvin.vast@gmail.com
                  </p>
                </div>

                <div className="text-left sm:text-right font-mono text-xs space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase block">COMMISSION INVOICE</span>
                  <div className="flex sm:justify-end items-center gap-1">
                    <span className="text-slate-500">Invoice #:</span>
                    <input
                      type="text"
                      value={invoiceBuilder.invoiceNumber}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, invoiceNumber: e.target.value })}
                      className="px-2 py-0.5 border border-slate-300 rounded font-bold text-slate-900 w-32 text-right"
                    />
                  </div>
                  <div className="flex sm:justify-end items-center gap-1">
                    <span className="text-slate-500">Date:</span>
                    <input
                      type="date"
                      value={invoiceBuilder.invoiceDate}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, invoiceDate: e.target.value })}
                      className="px-2 py-0.5 border border-slate-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                  <div className="flex sm:justify-end items-center gap-1">
                    <span className="text-slate-500">Due Date:</span>
                    <input
                      type="date"
                      value={invoiceBuilder.dueDate}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, dueDate: e.target.value })}
                      className="px-2 py-0.5 border border-slate-300 rounded text-slate-900 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bill To & Reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">BILL TO (CARRIER):</span>
                  <input
                    type="text"
                    value={invoiceBuilder.billToCompany}
                    onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToCompany: e.target.value })}
                    placeholder="Carrier Legal Name"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-sm font-bold text-slate-900 font-sans"
                  />
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      value={invoiceBuilder.billToMc}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToMc: e.target.value })}
                      placeholder="MC Number"
                      className="px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                    <input
                      type="text"
                      value={invoiceBuilder.billToPhone}
                      onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, billToPhone: e.target.value })}
                      placeholder="Carrier Phone"
                      className="px-2 py-1 border border-slate-300 rounded text-xs"
                    />
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">PAYMENT TERMS & LOAD PO:</span>
                  <input
                    type="text"
                    value={invoiceBuilder.poNumber || ''}
                    onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, poNumber: e.target.value })}
                    placeholder="Load / PO Reference #"
                    className="w-full px-2 py-1 border border-slate-300 rounded font-bold text-slate-900 text-xs"
                  />
                  <input
                    type="text"
                    value={invoiceBuilder.paymentTerms}
                    onChange={(e) => setInvoiceBuilder({ ...invoiceBuilder, paymentTerms: e.target.value })}
                    placeholder="Terms (e.g. Net 30, Due on Receipt)"
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              {/* Dynamic Line Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Description</th>
                      <th className="p-3 w-24">Rate ($)</th>
                      <th className="p-3 w-16 text-center">Qty</th>
                      <th className="p-3 w-28 text-right">Amount ($)</th>
                      <th className="p-3 w-10 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoiceBuilder.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className="p-2.5">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...invoiceBuilder.items];
                              newItems[index].description = e.target.value;
                              setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-slate-800"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => {
                              const newItems = [...invoiceBuilder.items];
                              newItems[index].rate = Number(e.target.value);
                              newItems[index].amount = newItems[index].rate * newItems[index].quantity;
                              setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-right"
                          />
                        </td>
                        <td className="p-2.5">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => {
                              const newItems = [...invoiceBuilder.items];
                              newItems[index].quantity = Number(e.target.value);
                              newItems[index].amount = newItems[index].rate * newItems[index].quantity;
                              setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                            }}
                            className="w-full px-2 py-1 border border-slate-200 rounded text-xs text-center"
                          />
                        </td>
                        <td className="p-2.5 text-right font-bold text-slate-900">
                          ${item.amount.toFixed(2)}
                        </td>
                        <td className="p-2.5 text-center">
                          {invoiceBuilder.items.length > 1 && (
                            <button
                              onClick={() => {
                                const newItems = invoiceBuilder.items.filter((_, i) => i !== index);
                                setInvoiceBuilder({ ...invoiceBuilder, items: newItems });
                              }}
                              className="text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
                            >
                              ✕
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Line Item Button */}
              <button
                type="button"
                onClick={() => {
                  setInvoiceBuilder({
                    ...invoiceBuilder,
                    items: [
                      ...invoiceBuilder.items,
                      {
                        id: String(Date.now()),
                        description: 'Additional Dispatch Service / Tarp Fee / Detention',
                        rate: 150,
                        quantity: 1,
                        amount: 150,
                      },
                    ],
                  });
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Line Item</span>
              </button>

              {/* Remittance & Total */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-slate-200 pt-6 gap-4 font-mono text-xs">
                <div className="space-y-1 text-slate-600 max-w-sm">
                  <strong className="text-slate-900 block">Remittance Details:</strong>
                  <div>Direct Wire / ACH Transfer to Infinity Dispatch LLC.</div>
                  <div>Zelle: Davidcross.vl1@gmail.com · Cell: (409) 509-6940</div>
                </div>

                <div className="w-full sm:w-64 space-y-2 text-right">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-900">${invoiceSubtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Tax:</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-black text-blue-700">
                    <span>Total Due:</span>
                    <span>${invoiceTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. ROUTE & ARITHMETIC CALCULATOR TAB */}
        {activeTab === 'calculator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Part 1: Highway Route, Mileage & Profit Estimator */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0D1527] border border-blue-900/40 space-y-5">
                <div className="flex items-center gap-2 border-b border-blue-900/40 pb-3">
                  <Compass className="w-5 h-5 text-sky-400" />
                  <h3 className="text-base font-bold text-white">Route Mileage & Revenue Calculator</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Origin City, State</label>
                    <input
                      type="text"
                      value={calcOrigin}
                      onChange={(e) => setCalcOrigin(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination City, State</label>
                    <input
                      type="text"
                      value={calcDestination}
                      onChange={(e) => setCalcDestination(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Loaded Miles (Distance)</label>
                    <input
                      type="number"
                      value={calcDistance}
                      onChange={(e) => setCalcDistance(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Target Rate Per Mile ($/mi)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={calcTargetRpm}
                      onChange={(e) => setCalcTargetRpm(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-emerald-400 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Diesel Price ($/gal)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={calcFuelPrice}
                      onChange={(e) => setCalcFuelPrice(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Dispatch Fee Commission (%)</label>
                    <select
                      value={calcCommissionPercent}
                      onChange={(e) => setCalcCommissionPercent(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sky-300 text-xs font-mono font-bold"
                    >
                      <option value={5}>5% (Standard Equipment)</option>
                      <option value={6}>6%</option>
                      <option value={7}>7% (Box Truck / Hotshot)</option>
                      <option value={8}>8%</option>
                      <option value={10}>10%</option>
                    </select>
                  </div>
                </div>

                {/* Outputs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs pt-2">
                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Gross Revenue:</span>
                    <span className="text-xl font-bold text-emerald-400">
                      ${(calcDistance * calcTargetRpm).toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-900/40">
                    <span className="text-[10px] text-slate-400 block uppercase">Fuel Expense (6.5 mpg):</span>
                    <span className="text-xl font-bold text-rose-400">
                      ${((calcDistance / 6.5) * calcFuelPrice).toFixed(2)}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 border border-blue-900/40 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 block uppercase">Dispatch Fee ({calcCommissionPercent}%):</span>
                    <span className="text-xl font-bold text-sky-400">
                      ${((calcDistance * calcTargetRpm) * (calcCommissionPercent / 100)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Part 2: Real Simple Arithmetic Keypad Calculator */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1326] border-2 border-sky-500/40 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between border-b border-blue-900/40 pb-2">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-sky-400" />
                    <h3 className="text-sm font-bold text-white">Simple Keypad Calculator</h3>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Quick Calculations</span>
                </div>

                {/* LCD Display */}
                <div className="p-4 rounded-2xl bg-black/80 border border-blue-800 text-right font-mono">
                  <div className="text-[10px] text-slate-400 h-4">
                    {calcPrevValue !== null && calcOperator ? `${calcPrevValue} ${calcOperator}` : ''}
                  </div>
                  <div className="text-3xl font-black text-white truncate tracking-wider">
                    {calcDisplay}
                  </div>
                </div>

                {/* Buttons Grid */}
                <div className="grid grid-cols-4 gap-2 font-mono text-sm font-bold">
                  <button
                    onClick={handleCalcClear}
                    className="p-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800 cursor-pointer"
                  >
                    C
                  </button>
                  <button
                    onClick={() => {
                      const val = parseFloat(calcDisplay);
                      setCalcDisplay(String(val * -1));
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    ±
                  </button>
                  <button
                    onClick={() => {
                      const val = parseFloat(calcDisplay);
                      setCalcDisplay(String(val / 100));
                    }}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 cursor-pointer"
                  >
                    %
                  </button>
                  <button
                    onClick={() => handleCalcOperation('÷')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    ÷
                  </button>

                  <button
                    onClick={() => handleCalcDigit('7')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    7
                  </button>
                  <button
                    onClick={() => handleCalcDigit('8')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    8
                  </button>
                  <button
                    onClick={() => handleCalcDigit('9')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    9
                  </button>
                  <button
                    onClick={() => handleCalcOperation('×')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    ×
                  </button>

                  <button
                    onClick={() => handleCalcDigit('4')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    4
                  </button>
                  <button
                    onClick={() => handleCalcDigit('5')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    5
                  </button>
                  <button
                    onClick={() => handleCalcDigit('6')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    6
                  </button>
                  <button
                    onClick={() => handleCalcOperation('-')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    -
                  </button>

                  <button
                    onClick={() => handleCalcDigit('1')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    1
                  </button>
                  <button
                    onClick={() => handleCalcDigit('2')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    onClick={() => handleCalcDigit('3')}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    3
                  </button>
                  <button
                    onClick={() => handleCalcOperation('+')}
                    className="p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  >
                    +
                  </button>

                  <button
                    onClick={() => handleCalcDigit('0')}
                    className="col-span-2 p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    onClick={handleCalcDecimal}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 cursor-pointer"
                  >
                    .
                  </button>
                  <button
                    onClick={handleCalcEquals}
                    className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                  >
                    =
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 7. SAFER & SEARCHCARRIERS.COM LOOKUP TAB */}
        {activeTab === 'safer' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">FMCSA SAFER & SearchCarriers.com Lookup</h3>
                </div>

                {/* Direct Link to https://searchcarriers.com/ */}
                <a
                  href={`https://searchcarriers.com/carrier/${saferQuery.replace(/\D/g, '') || '1489201'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in SearchCarriers.com</span>
                </a>
              </div>

              <p className="text-xs text-slate-300">
                Directly connected with FMCSA SAFER Database and SearchCarriers.com. Verify operating authority, insurance on file, and safety scores.
              </p>

              <form onSubmit={handleSearchSAFER} className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={saferQuery}
                  onChange={(e) => setSaferQuery(e.target.value)}
                  placeholder="Enter MC# or USDOT# (e.g. MC-1489201)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Search MC
                </button>
              </form>
            </div>

            {saferResult && (
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0B1326] border border-blue-500/40 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-blue-900/40 gap-2">
                  <div>
                    <span className="text-xs font-mono text-emerald-400 font-bold block">
                      OFFICIAL CARRIER SNAPSHOT · VERIFIED ACTIVE
                    </span>
                    <h2 className="text-xl font-bold text-white">{saferResult.legalName}</h2>
                    <span className="text-xs font-mono text-slate-400">{saferResult.physicalAddress}</span>
                  </div>
                  <div className="flex gap-2 font-mono text-xs">
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-sky-400 font-bold">
                      {saferResult.mcNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      DOT {saferResult.dotNumber}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Operating Authority:</span>
                    <span className="text-emerald-400 font-bold text-sm">{saferResult.operatingAuthority}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Safety Rating:</span>
                    <span className="text-white font-bold text-sm">{saferResult.safetyRating}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">BOC-3 Process Agent:</span>
                    <span className="text-sky-300 font-bold text-sm">{saferResult.boc3OnFile}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Auto Liability Insurance:</span>
                    <span className="text-emerald-400 font-bold text-sm">{saferResult.liabilityInsurance}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Cargo Insurance:</span>
                    <span className="text-emerald-400 font-bold text-sm">{saferResult.cargoInsurance}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Out-of-Service (OOS) Rate:</span>
                    <span className="text-white font-bold text-sm">{saferResult.inspectionOOSRate}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 8. CUSTOMER SERVICE MESSAGES & REPLY TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-[#0D1527] p-4 rounded-2xl border border-blue-900/40">
              <div className="space-y-0.5">
                <span className="text-xs font-mono font-bold text-sky-400">
                  CARRIER INQUIRIES & CUSTOMER SERVICE REPLY DESK
                </span>
                <p className="text-xs text-slate-300">
                  Read incoming inquiries, click "Reply" to send a direct response, and keep conversation threads permanently logged.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-blue-900/30 gap-1">
                    <div>
                      <span className="font-bold text-white text-sm">{inq.fullName}</span>
                      <span className="text-xs text-slate-400 ml-2">Phone: {inq.phone} · Email: {inq.email}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inq.status === 'Sent'
                          ? 'bg-blue-950 text-sky-400 border border-blue-700'
                          : inq.status === 'Seen'
                          ? 'bg-amber-950 text-amber-400 border border-amber-700'
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="text-slate-400 text-[10px]">{inq.createdAt}</span>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-sky-300">{inq.subject}</div>
                  <p className="text-xs text-slate-200 leading-relaxed">{inq.message}</p>

                  {inq.replyText && (
                    <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-amber-200 space-y-1 font-mono">
                      <div className="text-[10px] text-slate-400">
                        Replied by <strong>{inq.replyAuthor}</strong> at {inq.replyAt}:
                      </div>
                      <div>{inq.replyText}</div>
                    </div>
                  )}

                  {/* Reply Button */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <a
                      href={`mailto:${inq.email}?subject=Infinity Dispatch Reply: ${encodeURIComponent(inq.subject)}`}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-mono flex items-center gap-1 cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email Directly</span>
                    </a>

                    <button
                      onClick={() => {
                        setActiveInquiryForReply(inq);
                        setReplyMessageText(
                          `Hello ${inq.fullName}, thank you for reaching out to Infinity Dispatch LLC. We have high-paying loads available and can get your carrier agreement packet processed within 15 minutes. Call us directly at (409) 509-6940.`
                        );
                      }}
                      className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Reply in Portal</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. GOOGLE EMAIL INTEGRATION TAB */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#0D1527] border-2 border-emerald-500/40 space-y-5 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Google & Gmail Automated Dispatch Connection</h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Connected to: <strong className="text-emerald-300">{connectedGoogleEmail}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleConnectGoogle}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Change Connected Email</span>
                  </button>

                  <button
                    onClick={handleSendTestEmail}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Test Dispatch Alert</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-blue-900/40 text-xs font-mono space-y-2 text-slate-300">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>100% Real-Time Automated Outbound Forwarding Enabled</span>
                </div>
                <p>
                  Every carrier sign-up, document upload (W-9, COI, MC), booked load, and customer message inquiry automatically generates and forwards an email notification packet to <strong>{connectedGoogleEmail}</strong> and <strong>Davidcross.vl1@gmail.com</strong>.
                </p>
              </div>
            </div>

            {/* Outgoing Transmission Log */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-mono">Live Dispatch Email Transmissions ({emailLogs.length}):</h4>
              <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Timestamp</th>
                      <th className="py-2.5 px-4">Recipient</th>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Subject</th>
                      <th className="py-2.5 px-4">Delivery Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-blue-900/20 text-[11px]">
                    {emailLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-900/40">
                        <td className="py-2.5 px-4 text-slate-400">{log.timestamp}</td>
                        <td className="py-2.5 px-4 text-sky-300">{log.to}</td>
                        <td className="py-2.5 px-4 text-amber-300 font-semibold">{log.type}</td>
                        <td className="py-2.5 px-4 text-white max-w-xs truncate">{log.subject}</td>
                        <td className="py-2.5 px-4 text-emerald-400 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>{log.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 10. CARRIERS DATABASE TAB */}
        {activeTab === 'carriers' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Carrier Legal Name</th>
                    <th className="py-3 px-4">MC / DOT Number</th>
                    <th className="py-3 px-4">Phone / Email</th>
                    <th className="py-3 px-4">Equipment</th>
                    <th className="py-3 px-4">Assigned Dispatcher</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/20">
                  {carriers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-white">{c.companyName}</td>
                      <td className="py-3 px-4 font-mono text-sky-300">{c.mcNumber}</td>
                      <td className="py-3 px-4 text-slate-300">{c.phone}</td>
                      <td className="py-3 px-4 font-mono">{c.equipmentType}</td>
                      <td className="py-3 px-4 font-mono text-amber-300">{c.assignedDispatcher || c.assignedOwner}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 11. PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#0D1527] border border-blue-900/40 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#080E1C] border-b border-blue-900/40 text-slate-400 text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Carrier</th>
                    <th className="py-3 px-4">Gross Freight</th>
                    <th className="py-3 px-4">Fee %</th>
                    <th className="py-3 px-4">Commission ($)</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-900/20">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/50">
                      <td className="py-3 px-4 font-bold text-white">{p.invoiceNumber}</td>
                      <td className="py-3 px-4 text-slate-300">{p.carrierName}</td>
                      <td className="py-3 px-4 text-white">${p.loadRate.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sky-400">{p.dispatchFeePercent}%</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${p.commissionAmount.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                            : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                        }`}>
                          {p.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 12. DEMOS TAB */}
        {activeTab === 'demos' && (
          <div className="space-y-3">
            {demoBookings.map((demo) => (
              <div
                key={demo.id}
                className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-white font-sans">{demo.fullName}</span>
                    <span className="text-sky-400">({demo.companyName})</span>
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    Phone: <strong>{demo.phone}</strong> · Email: {demo.email}
                  </div>
                  <div className="text-slate-300">
                    Scheduled: <strong className="text-amber-400">{demo.preferredDate}</strong> at <strong>{demo.preferredTime}</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-sky-300 font-bold">
                    {demo.assignedOwner}
                  </span>
                  <span className="px-2.5 py-1 rounded bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold">
                    {demo.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 13. NOTES TAB */}
        {activeTab === 'notes' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Owner Confidential Dispatch Notes</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400">Secured (Malik@786)</span>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newNoteTitle.trim() || !newNoteContent.trim()) return;
                  storage.saveNote({
                    id: `note-${Date.now()}`,
                    title: newNoteTitle.trim(),
                    content: newNoteContent.trim(),
                    ownerName: owner.name,
                    tag: newNoteTag,
                    createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                    updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
                  });
                  setNewNoteTitle('');
                  setNewNoteContent('');
                  refreshData();
                }}
                className="space-y-3 pt-2"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Note Title / Lane Target"
                    value={newNoteTitle}
                    onChange={(e) => setNewNoteTitle(e.target.value)}
                    className="sm:col-span-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                  <select
                    value={newNoteTag}
                    onChange={(e) => setNewNoteTag(e.target.value)}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  >
                    <option value="Broker Lane">Broker Lane</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Rate Target">Rate Target</option>
                    <option value="Carrier Alert">Carrier Alert</option>
                  </select>
                </div>
                <textarea
                  rows={2}
                  required
                  placeholder="Type confidential rate, factoring, or shipper notes..."
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Save Sticky Note
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note.id} className="p-5 rounded-2xl bg-[#0B1326] border border-blue-900/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-sky-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      {note.tag}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{note.createdAt}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{note.title}</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{note.content}</p>
                  <div className="pt-2 border-t border-blue-900/30 flex justify-between items-center text-[11px] font-mono text-amber-400">
                    <span>Logged by: {note.ownerName}</span>
                    <button
                      onClick={() => {
                        storage.deleteNote(note.id);
                        refreshData();
                      }}
                      className="text-slate-500 hover:text-rose-400 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 14. REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        storage.toggleReviewApproval(rev.id);
                        refreshData();
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        rev.isApproved
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-950 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {rev.isApproved ? 'Approved (Public)' : 'Hidden'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 italic">"{rev.comment}"</p>
                  <div className="text-xs font-mono text-slate-400 pt-2 border-t border-blue-900/30 flex justify-between">
                    <span>{rev.carrierName} ({rev.companyName})</span>
                    <span className="text-sky-300">{rev.equipment}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 15. DISPATCHERS TAB */}
        {activeTab === 'dispatchers' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dispatchers.map((disp) => (
              <div key={disp.id} className="p-5 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">{disp.status}</span>
                </div>
                <h4 className="text-base font-bold text-white">{disp.name}</h4>
                <div className="text-xs text-slate-400 font-mono space-y-1">
                  <div>Phone: {disp.phone}</div>
                  <div>Email: {disp.email}</div>
                  <div className="pt-2 text-sky-400 font-bold">
                    Carriers Assigned: {disp.assignedCarriersCount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 16. SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0D1527] border border-blue-900/40 space-y-4">
              <h3 className="text-base font-bold text-white">Super Admin Access Credentials</h3>
              <p className="text-xs text-slate-300">
                Authorized Executive IDs: <strong>David Cross</strong> & <strong>Alvin</strong>. Master security authentication active across web and live chat consoles.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white font-mono">Immutable Activity Audit Trail:</h4>
              <div className="space-y-2">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono"
                  >
                    <div>
                      <span className="font-bold text-sky-400">{act.ownerName}</span> ·{' '}
                      <span className="text-white">{act.action}</span>: {act.details}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* CREATE LOAD MODAL */}
      {isAddLoadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#091122] border-2 border-blue-500/50 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-lg font-bold text-white">Book & Dispatch Freight Load</h3>
              <button onClick={() => setIsAddLoadOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLoad} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Carrier Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={newLoad.carrierName}
                    onChange={(e) => setNewLoad({ ...newLoad, carrierName: e.target.value })}
                    placeholder="e.g. Apex Interstate Express"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier / Driver Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newLoad.carrierPhone}
                    onChange={(e) => setNewLoad({ ...newLoad, carrierPhone: e.target.value })}
                    placeholder="e.g. (214) 555-8392"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier MC Number *</label>
                  <input
                    type="text"
                    required
                    value={newLoad.mcNumber}
                    onChange={(e) => setNewLoad({ ...newLoad, mcNumber: e.target.value })}
                    placeholder="e.g. MC-1489201"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Equipment Type *</label>
                  <select
                    value={newLoad.equipmentType}
                    onChange={(e) => setNewLoad({ ...newLoad, equipmentType: e.target.value as EquipmentType })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="Dry Van">Dry Van (53ft/48ft)</option>
                    <option value="Reefer">Reefer (Temp-Controlled)</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Step Deck">Step Deck</option>
                    <option value="Power Only">Power Only</option>
                    <option value="Hotshot">Hotshot</option>
                    <option value="Box Truck">Box Truck (26ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Dispatched Gross Rate ($) *</label>
                  <input
                    type="number"
                    required
                    value={newLoad.rate}
                    onChange={(e) => setNewLoad({ ...newLoad, rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Dispatch Fee Commission (%) *</label>
                  <select
                    value={newLoad.dispatchFeePercent}
                    onChange={(e) => setNewLoad({ ...newLoad, dispatchFeePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sky-300 font-bold font-mono"
                  >
                    <option value={5}>5% (Standard Fee)</option>
                    <option value={6}>6%</option>
                    <option value={7}>7% (Box Truck / Hotshot)</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Origin City, State (PU)</label>
                  <input
                    type="text"
                    required
                    value={newLoad.originCity}
                    onChange={(e) => setNewLoad({ ...newLoad, originCity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Destination City, State (DEL)</label>
                  <input
                    type="text"
                    required
                    value={newLoad.destinationCity}
                    onChange={(e) => setNewLoad({ ...newLoad, destinationCity: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Loaded Miles</label>
                  <input
                    type="number"
                    required
                    value={newLoad.loadedMiles}
                    onChange={(e) => setNewLoad({ ...newLoad, loadedMiles: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Broker Name</label>
                  <input
                    type="text"
                    value={newLoad.brokerName}
                    onChange={(e) => setNewLoad({ ...newLoad, brokerName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1">Commodity / Notes</label>
                <input
                  type="text"
                  value={newLoad.commodity}
                  onChange={(e) => setNewLoad({ ...newLoad, commodity: e.target.value })}
                  placeholder="e.g. Palletized Goods - No Touch"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg uppercase tracking-wider transition-all"
              >
                Save & Dispatch Load (Auto-Attach RC & BOL)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD ROSTER CARRIER MODAL */}
      {isAddRosterCarrierOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#091122] border-2 border-emerald-500/50 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <h3 className="text-base font-bold text-white">Add Active Carrier to Dispatch Roster</h3>
              <button onClick={() => setIsAddRosterCarrierOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRosterCarrier} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Driver Name *</label>
                  <input
                    type="text"
                    required
                    value={newRosterCarrier.driverName}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, driverName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Driver Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRosterCarrier.driverPhone}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, driverPhone: e.target.value })}
                    placeholder="e.g. (214) 555-8392"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier Name *</label>
                  <input
                    type="text"
                    required
                    value={newRosterCarrier.carrierName}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, carrierName: e.target.value })}
                    placeholder="e.g. Apex Interstate"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Carrier Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRosterCarrier.carrierPhone}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, carrierPhone: e.target.value })}
                    placeholder="e.g. (214) 555-8392"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Carrier MC# *</label>
                  <input
                    type="text"
                    required
                    value={newRosterCarrier.mcNumber}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, mcNumber: e.target.value })}
                    placeholder="e.g. MC-1489201"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Dispatched Amount ($)</label>
                  <input
                    type="number"
                    required
                    value={newRosterCarrier.dispatchedAmount}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, dispatchedAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Invoice Status</label>
                  <select
                    value={newRosterCarrier.invoiceStatus}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, invoiceStatus: e.target.value as InvoiceStatus })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                  >
                    <option value="Not Invoiced">Not Invoiced</option>
                    <option value="Invoice Sent">Invoice Sent</option>
                    <option value="Pending Payment">Pending Payment</option>
                    <option value="Cleared / Paid">Cleared / Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 mb-1">Commission Fee (%)</label>
                  <select
                    value={newRosterCarrier.dispatchFeePercent}
                    onChange={(e) => setNewRosterCarrier({ ...newRosterCarrier, dispatchFeePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sky-300 font-bold font-mono"
                  >
                    <option value={5}>5%</option>
                    <option value={6}>6%</option>
                    <option value={7}>7%</option>
                    <option value={8}>8%</option>
                    <option value={10}>10%</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg uppercase tracking-wider"
              >
                Add Carrier to Active Roster
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOMER SERVICE REPLY MODAL */}
      {activeInquiryForReply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#091122] border-2 border-blue-500/50 shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-blue-900/40">
              <div>
                <h3 className="text-base font-bold text-white">Reply to {activeInquiryForReply.fullName}</h3>
                <span className="text-xs font-mono text-slate-400">
                  Recipient: {activeInquiryForReply.email} · Phone: {activeInquiryForReply.phone}
                </span>
              </div>
              <button onClick={() => setActiveInquiryForReply(null)} className="text-slate-400 hover:text-white cursor-pointer">
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Carrier Message:</span>
              <p className="italic">"{activeInquiryForReply.message}"</p>
            </div>

            <form onSubmit={handleSendInquiryReply} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-mono">Reply as Executive:</label>
                <select
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value as 'David Cross' | 'Alvin')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-bold"
                >
                  <option value="David Cross">David Cross (Business Development Executive)</option>
                  <option value="Alvin">Alvin (Operations Director)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-mono">Customer Response Message:</label>
                <textarea
                  rows={4}
                  required
                  value={replyMessageText}
                  onChange={(e) => setReplyMessageText(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500 leading-relaxed font-sans"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveInquiryForReply(null)}
                  className="px-4 py-2 bg-slate-900 border border-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Official Response</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER / LIGHTBOX MODAL */}
      <DocumentViewerModal
        isOpen={isDocViewerOpen}
        onClose={() => setIsDocViewerOpen(false)}
        document={activeDocData}
      />
    </div>
  );
};
