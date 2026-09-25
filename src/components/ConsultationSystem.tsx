import React, { useState, useEffect } from 'react';
import { SERVICES, CONSULTATION_SLOTS, WORKSHOP_INFO } from '../data/servicesData';
import { ConsultationBooking } from '../types';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Download,
  MessageSquare,
  RefreshCw,
  XCircle,
  FileCheck,
  Building,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ConsultationSystemProps {
  initialServiceId?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const ConsultationSystem: React.FC<ConsultationSystemProps> = ({
  initialServiceId,
  isModal = false,
  onClose,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [tab, setTab] = useState<'book' | 'manage'>('book');

  // Booking Form State
  const [serviceId, setServiceId] = useState<string>(initialServiceId || SERVICES[0].id);
  const [mode, setMode] = useState<'on-site' | 'online'>('on-site');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [propertyType, setPropertyType] = useState<'Residential' | 'Commercial' | 'Industrial' | 'Warehouse'>('Commercial');
  const [address, setAddress] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>(CONSULTATION_SLOTS[0]);
  const [notes, setNotes] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<ConsultationBooking | null>(null);

  // Manage / Lookup State
  const [lookupQuery, setLookupQuery] = useState<string>('');
  const [managedBooking, setManagedBooking] = useState<ConsultationBooking | null>(null);
  const [manageLoading, setManageLoading] = useState<boolean>(false);
  const [manageMsg, setManageMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newRescheduleDate, setNewRescheduleDate] = useState<string>('');
  const [newRescheduleSlot, setNewRescheduleSlot] = useState<string>(CONSULTATION_SLOTS[0]);

  // Compute next 10 business days for date picker
  const [availableDates, setAvailableDates] = useState<{ dateStr: string; label: string; dayName: string }[]>([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();
    let count = 0;
    let dayOffset = 1;

    while (count < 10) {
      const d = new Date(today);
      d.setDate(today.getDate() + dayOffset);
      dayOffset++;

      const isSunday = d.getDay() === 0;
      const dateStr = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      dates.push({
        dateStr,
        label: `${label} (${isSunday ? 'Sun - Appt' : dayName})`,
        dayName,
      });
      count++;
    }

    setAvailableDates(dates);
    if (dates.length > 0 && !selectedDate) {
      setSelectedDate(dates[0].dateStr);
      setNewRescheduleDate(dates[0].dateStr);
    }
  }, []);

  useEffect(() => {
    if (initialServiceId) {
      setServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  const handleBookConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !phone.trim() || !selectedDate || !selectedSlot) {
      setError('Please fill in your name, phone number, and select date & time slot.');
      return;
    }

    if (mode === 'on-site' && !address.trim()) {
      setError('Please provide project site location / address in Bhopal or MP for on-site visit.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        propertyType,
        serviceId,
        consultationMode: mode,
        address: address.trim(),
        date: selectedDate,
        timeSlot: selectedSlot,
        notes: notes.trim(),
      };

      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to schedule consultation.');
      }

      setConfirmedBooking(data.consultation);

      try {
        localStorage.setItem(`LE_BOOKING_${data.consultation.id}`, JSON.stringify(data.consultation));
        localStorage.setItem('LE_LAST_BOOKING_ID', data.consultation.id);
      } catch (err) {
        console.warn('LocalStorage save skipped');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error scheduling consultation.');
    } finally {
      setLoading(false);
    }
  };

  const handleLookupBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setManageMsg(null);
    if (!lookupQuery.trim()) {
      setManageMsg({ type: 'error', text: 'Enter your Booking ID or registered phone number.' });
      return;
    }

    setManageLoading(true);
    try {
      const cleanQuery = lookupQuery.trim();
      const res = await fetch(`/api/consultations/${encodeURIComponent(cleanQuery)}`);
      const data = await res.json();

      if (!res.ok || !data.consultation) {
        const local = localStorage.getItem(`LE_BOOKING_${cleanQuery}`);
        if (local) {
          setManagedBooking(JSON.parse(local));
          return;
        }
        throw new Error(data.error || 'No booking record found for this reference or phone.');
      }

      setManagedBooking(data.consultation);
    } catch (err: any) {
      setManageMsg({ type: 'error', text: err?.message || 'Could not find booking record.' });
    } finally {
      setManageLoading(false);
    }
  };

  const handleRescheduleSubmit = async () => {
    if (!managedBooking) return;
    setManageLoading(true);
    setManageMsg(null);

    try {
      const res = await fetch(`/api/consultations/${managedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newRescheduleDate,
          timeSlot: newRescheduleSlot,
          status: 'rescheduled',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reschedule.');

      setManagedBooking(data.consultation);
      setManageMsg({ type: 'success', text: `Consultation rescheduled to ${newRescheduleDate} at ${newRescheduleSlot}.` });
    } catch (err: any) {
      setManageMsg({ type: 'error', text: err?.message || 'Error updating slot.' });
    } finally {
      setManageLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!managedBooking) return;
    if (!window.confirm('Are you sure you want to cancel this consultation booking?')) return;

    setManageLoading(true);
    setManageMsg(null);

    try {
      const res = await fetch(`/api/consultations/${managedBooking.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to cancel.');

      setManagedBooking(data.consultation);
      setManageMsg({ type: 'success', text: 'Consultation has been cancelled.' });
    } catch (err: any) {
      setManageMsg({ type: 'error', text: err?.message || 'Error cancelling booking.' });
    } finally {
      setManageLoading(false);
    }
  };

  const handleDownloadICS = (booking: ConsultationBooking) => {
    const selectedServiceObj = SERVICES.find((s) => s.id === booking.serviceId);
    const serviceName = selectedServiceObj ? selectedServiceObj.title : 'Metal Fabrication & Automation';

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Lakhera Enterprise//Consultation Booking//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Lakhera Enterprise Consultation: ${serviceName}`,
      `DESCRIPTION:Consultation with Lakhera Enterprise engineers for ${serviceName}. Reference: ${booking.id}. Mode: ${booking.consultationMode}. Contact: +91 82230 01415.`,
      `LOCATION:${booking.consultationMode === 'on-site' ? booking.address : 'Phone/Video Call (+91 82230 01415)'}`,
      `STATUS:CONFIRMED`,
      `UID:${booking.id}@lakheraenterprises.com`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Lakhera-Consultation-${booking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getWhatsAppBookingLink = (booking: ConsultationBooking) => {
    const serviceObj = SERVICES.find((s) => s.id === booking.serviceId);
    const msg = `Hello Lakhera Enterprise, I have booked a ${booking.consultationMode} consultation for "${serviceObj?.title || 'Fabrication Work'}".\nBooking ID: ${booking.id}\nDate: ${booking.date}\nTime Slot: ${booking.timeSlot}\nLocation: ${booking.address || 'Phone Call'}\nName: ${booking.customerName} (${booking.phone})\nPlease confirm this schedule.`;
    return `${WORKSHOP_INFO.whatsappBase}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div
      className={`w-full transition-colors duration-200 ${
        isModal
          ? ''
          : isLight
          ? 'py-20 bg-slate-50 border-b border-slate-200 text-slate-900'
          : 'py-20 bg-slate-950 border-b border-slate-900 text-white'
      }`}
      id="consultation"
    >
      <div className={`mx-auto ${isModal ? 'max-w-3xl' : 'max-w-7xl px-4 sm:px-6 lg:px-8'}`}>
        {!isModal && (
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <div className={`text-xs font-bold uppercase tracking-wider ${
              isLight ? 'text-amber-700' : 'text-amber-400'
            }`}>
              03. Technical Advisory & Site Surveys
            </div>
            <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-balance ${
              isLight ? 'text-slate-950' : 'text-white'
            }`}>
              Book Engineering Consultation
            </h2>
            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-700 font-normal' : 'text-slate-300 font-light'
            }`}>
              Schedule an on-site structural measurement visit in Bhopal & surrounding industrial areas or an online technical assessment with our master fabrication team.
            </p>
          </div>
        )}

        <div className={`rounded-3xl overflow-hidden shadow-2xl border transition-colors ${
          isLight
            ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/70'
            : 'bg-slate-900/90 border-slate-800'
        }`}>
          {/* Top Segmented Controls: Book vs Manage */}
          <div className={`flex border-b p-2 gap-2 ${
            isLight ? 'border-slate-200 bg-slate-100/70' : 'border-slate-800 bg-slate-950/60'
          }`}>
            <button
              onClick={() => {
                setTab('book');
                setConfirmedBooking(null);
              }}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'book'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Schedule New Consultation</span>
            </button>

            <button
              onClick={() => setTab('manage')}
              className={`flex-1 py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                tab === 'manage'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reschedule / Check Existing Booking</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {tab === 'book' && !confirmedBooking && (
              <form onSubmit={handleBookConsultation} className="space-y-6">
                {error && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Consultation Mode Selection */}
                <div>
                  <label className={`block text-xs font-bold mb-2 ${
                    isLight ? 'text-slate-900' : 'text-slate-300'
                  }`}>
                    Select Consultation Mode:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('on-site')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        mode === 'on-site'
                          ? isLight
                            ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-sm'
                            : 'border-amber-400 bg-amber-400/10 text-white'
                          : isLight
                          ? 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs ${isLight ? 'text-slate-950' : 'text-white'}`}>
                          On-Site Measurement Visit
                        </span>
                        {mode === 'on-site' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Our fabrication engineer visits your site in Bhopal / MP with gauges and measurement tools.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMode('online')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        mode === 'online'
                          ? isLight
                            ? 'border-amber-500 bg-amber-50 text-slate-900 shadow-sm'
                            : 'border-amber-400 bg-amber-400/10 text-white'
                          : isLight
                          ? 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`font-bold text-xs ${isLight ? 'text-slate-950' : 'text-white'}`}>
                          Online / Phone Consultation
                        </span>
                        {mode === 'online' && <CheckCircle2 className="w-4 h-4 text-amber-500" />}
                      </div>
                      <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                        Technical discussion via call or WhatsApp video to assess blueprints, motors & materials.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Service Selection */}
                <div>
                  <label className={`block text-xs font-bold mb-2 ${
                    isLight ? 'text-slate-900' : 'text-slate-300'
                  }`}>
                    Select Service Required:
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className={`w-full rounded-xl px-4 py-2.5 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500 shadow-sm'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    }`}
                  >
                    {SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Customer Details Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rajesh Sharma"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                            : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Phone Number (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98260 00000"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs font-mono focus:outline-none border ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                            : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rajesh@example.com"
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                            : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${
                      isLight ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      Property / Project Type
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <select
                        value={propertyType}
                        onChange={(e) => setPropertyType(e.target.value as any)}
                        className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${
                          isLight
                            ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                            : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                        }`}
                      >
                        <option value="Commercial">Commercial / Showroom / Shop</option>
                        <option value="Industrial">Industrial Factory / Warehouse</option>
                        <option value="Residential">Residential Villa / Bungalow</option>
                        <option value="Warehouse">Storage Godown / Logistics Yard</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Project Site Address */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}>
                    {mode === 'on-site' ? 'Project Site Address & Landmark (Bhopal & MP) *' : 'Location / City'}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required={mode === 'on-site'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={mode === 'on-site' ? 'e.g. Near DB Mall, MP Nagar / Govindpura / Kolar Road, Bhopal' : 'e.g. Bhopal, MP'}
                      className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs focus:outline-none border ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                          : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Date & Slot Selector */}
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4 ${
                  isLight ? 'border-slate-200' : 'border-slate-800'
                }`}>
                  <div>
                    <label className={`block text-xs font-bold mb-2 ${
                      isLight ? 'text-slate-900' : 'text-slate-300'
                    }`}>
                      Select Preferred Date:
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                      {availableDates.map((item) => (
                        <button
                          type="button"
                          key={item.dateStr}
                          onClick={() => setSelectedDate(item.dateStr)}
                          className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                            selectedDate === item.dateStr
                              ? 'border-amber-500 bg-amber-400 text-slate-950 font-bold shadow-sm'
                              : isLight
                              ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-bold mb-2 ${
                      isLight ? 'text-slate-900' : 'text-slate-300'
                    }`}>
                      Select Time Slot:
                    </label>
                    <div className="space-y-1.5">
                      {CONSULTATION_SLOTS.map((slot) => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between cursor-pointer ${
                            selectedSlot === slot
                              ? 'border-amber-500 bg-amber-400 text-slate-950 font-bold shadow-sm'
                              : isLight
                              ? 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                              : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-mono tabular-nums">{slot}</span>
                          {selectedSlot === slot && <Clock className="w-3.5 h-3.5 text-slate-950" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project Notes */}
                <div>
                  <label className={`block text-xs font-medium mb-1.5 ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}>
                    Project Notes & Dimensions (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Existing manual shutter needs motor conversion, roughly 12x10 ft opening."
                    className={`w-full px-3 py-2 rounded-xl text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                        : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                    }`}
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Scheduling with Workshop Team...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Consultation Booking</span>
                      </>
                    )}
                  </button>
                  <div className={`mt-2 text-center text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                    Zero consultation charges · Real measurement survey · No obligations
                  </div>
                </div>
              </form>
            )}

            {/* Confirmed Booking State */}
            {tab === 'book' && confirmedBooking && (
              <div className="space-y-6">
                <div className={`p-5 rounded-2xl text-center space-y-2 border ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-300 text-slate-900'
                    : 'bg-emerald-950/30 border-emerald-500/40 text-white'
                }`}>
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold font-display">Consultation Confirmed</h3>
                  <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                    Your appointment has been registered with Lakhera Enterprise engineering dispatch.
                  </p>
                  <div className="inline-block mt-2 px-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-mono text-sm font-bold tracking-wider">
                    Booking ID: {confirmedBooking.id}
                  </div>
                </div>

                {/* Details Recap Card */}
                <div className={`p-5 rounded-2xl border space-y-3 text-xs ${
                  isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-950 border-slate-800 text-slate-200'
                }`}>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Customer:</span>
                    <span className="font-bold text-slate-950">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Phone / WhatsApp:</span>
                    <span className="font-mono text-slate-900 font-bold">{confirmedBooking.phone}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Service:</span>
                    <span className="text-amber-700 font-bold">
                      {SERVICES.find((s) => s.id === confirmedBooking.serviceId)?.title}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Mode:</span>
                    <span className="capitalize font-semibold text-slate-900">{confirmedBooking.consultationMode}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-2">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-mono font-bold text-slate-950">
                      {confirmedBooking.date} · {confirmedBooking.timeSlot}
                    </span>
                  </div>
                  {confirmedBooking.address && (
                    <div className="flex justify-between border-b border-slate-200 pb-2">
                      <span className="text-slate-500">Site Location:</span>
                      <span className="text-slate-900 text-right max-w-xs">{confirmedBooking.address}</span>
                    </div>
                  )}
                </div>

                {/* Reminders & WhatsApp Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => handleDownloadICS(confirmedBooking)}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    <span>Add to Calendar (.ics)</span>
                  </button>

                  <a
                    href={getWhatsAppBookingLink(confirmedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Reminder to WhatsApp</span>
                  </a>
                </div>

                <div className="pt-2 text-center">
                  <button
                    onClick={() => setConfirmedBooking(null)}
                    className="text-xs text-slate-600 hover:text-slate-950 transition-colors underline cursor-pointer"
                  >
                    Schedule Another Consultation
                  </button>
                </div>
              </div>
            )}

            {/* Manage / Reschedule / Cancel Tab */}
            {tab === 'manage' && (
              <div className="space-y-6">
                <form onSubmit={handleLookupBooking} className="flex gap-2">
                  <input
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => setLookupQuery(e.target.value)}
                    placeholder="Enter Booking ID (e.g. LE-2026-...) or registered phone"
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs focus:outline-none font-mono border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                        : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={manageLoading}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    {manageLoading ? 'Searching...' : 'Find Booking'}
                  </button>
                </form>

                {manageMsg && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                      manageMsg.type === 'success'
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-red-50 border-red-300 text-red-800'
                    }`}
                  >
                    {manageMsg.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    )}
                    <span>{manageMsg.text}</span>
                  </div>
                )}

                {managedBooking && (
                  <div className={`border rounded-2xl p-5 space-y-4 ${
                    isLight ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-slate-950 border-slate-800 text-white'
                  }`}>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div>
                        <span className="text-slate-500 text-xs">Reference: </span>
                        <span className="font-mono text-amber-700 font-bold text-sm">
                          {managedBooking.id}
                        </span>
                      </div>
                      <span
                        className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded ${
                          managedBooking.status === 'confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : managedBooking.status === 'rescheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {managedBooking.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block">Customer:</span>
                        <span className="font-bold text-slate-950">{managedBooking.customerName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Phone:</span>
                        <span className="font-mono text-slate-800 font-semibold">{managedBooking.phone}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Service:</span>
                        <span className="text-amber-800 font-bold">
                          {SERVICES.find((s) => s.id === managedBooking.serviceId)?.title}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Current Slot:</span>
                        <span className="font-mono font-bold text-slate-950">
                          {managedBooking.date} ({managedBooking.timeSlot})
                        </span>
                      </div>
                    </div>

                    {managedBooking.status !== 'cancelled' && (
                      <div className="border-t border-slate-200 pt-4 space-y-4">
                        <div className="text-xs font-bold text-slate-900">
                          Reschedule to a Different Slot:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] text-slate-600 block mb-1">New Date:</label>
                            <select
                              value={newRescheduleDate}
                              onChange={(e) => setNewRescheduleDate(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                            >
                              {availableDates.map((d) => (
                                <option key={d.dateStr} value={d.dateStr}>
                                  {d.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="text-[11px] text-slate-600 block mb-1">New Time Slot:</label>
                            <select
                              value={newRescheduleSlot}
                              onChange={(e) => setNewRescheduleSlot(e.target.value)}
                              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                            >
                              {CONSULTATION_SLOTS.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleRescheduleSubmit}
                            disabled={manageLoading}
                            className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
                          >
                            Update Slot
                          </button>

                          <button
                            type="button"
                            onClick={handleCancelBooking}
                            disabled={manageLoading}
                            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                          >
                            Cancel Consultation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
