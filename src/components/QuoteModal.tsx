import React, { useState, useRef } from 'react';
import { SERVICES, WORKSHOP_INFO } from '../data/servicesData';
import { supabase } from '../lib/supabase';
import {
  X,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Ruler,
  Layers,
  Paperclip,
  Trash2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedServiceId?: string;
}

interface UploadedFile {
  name: string;
  size: string;
  type: string;
  base64?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  preSelectedServiceId,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [serviceId, setServiceId] = useState<string>(preSelectedServiceId || SERVICES[0].id);
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('Commercial');
  const [location, setLocation] = useState<string>('Bhopal, MP');

  // Dimensions
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [length, setLength] = useState<string>('');
  const [unit, setUnit] = useState<'feet' | 'meters' | 'inches'>('feet');
  const [quantity, setQuantity] = useState<number>(1);

  // Material & Automation Preferences
  const [material, setMaterial] = useState<string>('Galvanized Iron (GI) Standard');
  const [motorRequired, setMotorRequired] = useState<string>('Yes - Automatic Maxwell Motor');
  const [finish, setFinish] = useState<string>('Industrial Powder Coating');
  const [notes, setNotes] = useState<string>('');

  // Files
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    if (!selected) return;

    const newFiles: UploadedFile[] = [];
    Array.from(selected).forEach((file) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const reader = new FileReader();
      reader.onload = () => {
        newFiles.push({
          name: file.name,
          size: `${sizeMB} MB`,
          type: file.type,
          base64: reader.result as string,
        });
        if (newFiles.length === selected.length) {
          setFiles((prev) => [...prev, ...newFiles]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!customerName.trim() || !phone.trim() || !serviceId) {
      setError('Please provide your name, phone number, and selected service.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        serviceId,
        propertyType,
        dimensions: {
          width: width.trim(),
          height: height.trim(),
          length: length.trim(),
          unit,
          quantity,
        },
        materialPreference: `${material} | Motor: ${motorRequired} | Finish: ${finish}`,
        location: location.trim(),
        notes: notes.trim(),
        filesCount: files.length,
      };

      let quoteId = '';

      try {
        const res = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          quoteId = data.quoteId;
        }
      } catch (networkErr) {
        console.warn('API quote endpoint unreachable, falling back to direct persistence:', networkErr);
      }

      // If Netlify serverless function was unavailable (e.g. static Netlify drop), handle client-side
      if (!quoteId) {
        quoteId = `LQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        try {
          await supabase.from('quotes').insert({
            id: quoteId,
            customer_name: payload.customerName,
            phone: payload.phone,
            email: payload.email,
            service_id: payload.serviceId,
            property_type: payload.propertyType,
            dimensions: payload.dimensions,
            material_preference: payload.materialPreference,
            location: payload.location,
            notes: payload.notes,
            files_count: payload.filesCount,
            status: 'received',
          });
        } catch (sbErr) {
          console.warn('Client direct quote Supabase note:', sbErr);
        }
      }

      setSubmittedQuoteId(quoteId);
    } catch (err: any) {
      setError(err?.message || 'Error submitting quote request.');
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppQuoteLink = () => {
    const selectedService = SERVICES.find((s) => s.id === serviceId)?.title || 'Fabrication Work';
    const dimText = `${width || '-'} W x ${height || '-'} H ${length ? `x ${length} L` : ''} ${unit} (Qty: ${quantity})`;
    const msg = `Hello Lakhera Enterprise, I would like to request an itemized quotation.\nService: ${selectedService}\nProperty: ${propertyType}\nDimensions: ${dimText}\nMaterials: ${material}\nMotor Option: ${motorRequired}\nFinish: ${finish}\nSite Location: ${location}\nCustomer: ${customerName} (${phone})\nNotes: ${notes || 'None'}\n${files.length > 0 ? `Attached ${files.length} design files.` : ''}`;
    return `${WORKSHOP_INFO.whatsappBase}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className={`relative w-full max-w-3xl my-8 rounded-3xl shadow-2xl overflow-hidden border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900 shadow-slate-300/60'
          : 'bg-slate-900 border-slate-800 text-white'
      }`}>
        {/* Modal Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold font-display">
              Request Project Quotation
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isLight ? 'text-slate-500 hover:text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[80vh] overflow-y-auto">
          {submittedQuoteId ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold font-display">Quote Request Submitted</h4>
              <p className={`text-xs max-w-md mx-auto ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                Our estimation and engineering team in Bhopal is reviewing your specifications and blueprint files. We provide accurate itemized calculations based on actual steel weights and motor loads.
              </p>
              <div className="inline-block px-4 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-amber-400 font-mono text-sm font-bold">
                Reference ID: {submittedQuoteId}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={getWhatsAppQuoteLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Quote Directly to WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className={`px-5 py-3 text-xs font-semibold rounded-xl transition-colors cursor-pointer border ${
                    isLight
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                  }`}
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Service & Property Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Service Required *
                  </label>
                  <select
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
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

                <div>
                  <label className="block text-xs font-bold mb-1.5">
                    Property / Application Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500 shadow-sm'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    }`}
                  >
                    <option value="Commercial">Commercial Showroom / Retail Shop</option>
                    <option value="Industrial">Industrial Factory / Workshop</option>
                    <option value="Warehouse">Logistics Warehouse / Godown</option>
                    <option value="Residential">Residential Villa / Bungalow</option>
                  </select>
                </div>
              </div>

              {/* Dimensions Section */}
              <div className={`p-4 rounded-2xl space-y-3 border ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950/70 border-slate-800'
              }`}>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Approximate Opening Dimensions</span>
                  </div>
                  <div className={`flex items-center gap-1 p-0.5 rounded-lg border ${
                    isLight ? 'bg-white border-slate-300' : 'bg-slate-900 border-slate-700'
                  }`}>
                    {(['feet', 'meters', 'inches'] as const).map((u) => (
                      <button
                        type="button"
                        key={u}
                        onClick={() => setUnit(u)}
                        className={`px-2 py-0.5 text-[11px] rounded capitalize ${
                          unit === u
                            ? 'bg-amber-400 text-slate-950 font-bold'
                            : isLight
                            ? 'text-slate-600 hover:text-slate-950'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1 font-medium">Width ({unit})</label>
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="e.g. 12"
                      className={`w-full rounded-lg px-2.5 py-1.5 font-mono text-xs border ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1 font-medium">Height ({unit})</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 10"
                      className={`w-full rounded-lg px-2.5 py-1.5 font-mono text-xs border ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1 font-medium">Length / Span</label>
                    <input
                      type="text"
                      value={length}
                      onChange={(e) => setLength(e.target.value)}
                      placeholder="For sheds/railings"
                      className={`w-full rounded-lg px-2.5 py-1.5 font-mono text-xs border ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1 font-medium">Quantity</label>
                    <input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                      className={`w-full rounded-lg px-2.5 py-1.5 font-mono text-xs border ${
                        isLight
                          ? 'bg-white border-slate-300 text-slate-900'
                          : 'bg-slate-900 border-slate-700 text-white'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Material & Specs Preferences */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Material / Steel Grade
                  </label>
                  <select
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Galvanized Iron (GI) Standard">Galvanized Iron (GI) Prime</option>
                    <option value="Mild Steel (MS) Grade A">Mild Steel (MS) Tata/Jindal</option>
                    <option value="Stainless Steel SS 304">Stainless Steel Grade 304</option>
                    <option value="Stainless Steel SS 316">Stainless Steel Marine 316</option>
                    <option value="Fiber Laser Cut Steel Sheet">Fiber Laser Cut Steel Plate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Motor Automation
                  </label>
                  <select
                    value={motorRequired}
                    onChange={(e) => setMotorRequired(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Yes - Automatic Maxwell Motor">Yes - Maxwell Motor + Remotes</option>
                    <option value="Manual Gear Drive">Manual Gear Pull</option>
                    <option value="Not Applicable">Not Applicable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Surface Treatment
                  </label>
                  <select
                    value={finish}
                    onChange={(e) => setFinish(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 shadow-sm'
                        : 'bg-slate-950 border-slate-700 text-white'
                    }`}
                  >
                    <option value="Industrial Powder Coating">Industrial Powder Coating</option>
                    <option value="Red Oxide Anti-Rust Primer">Red Oxide Anti-Rust Primer</option>
                    <option value="Polyurethane Metallic Enamel">Polyurethane Metallic Enamel</option>
                    <option value="Satin Brush / Mirror Polish (SS)">Satin Brush / Mirror Polish (SS)</option>
                  </select>
                </div>
              </div>

              {/* File Upload Zone */}
              <div>
                <label className="block text-xs font-bold mb-1.5 flex items-center justify-between">
                  <span>Attach Site Photos, Blueprints or CAD Drawings (Optional)</span>
                  <span className="text-[11px] text-slate-500 font-normal">PDF, DWG, JPG, PNG (Max 15MB)</span>
                </label>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed p-4 rounded-2xl text-center cursor-pointer transition-colors ${
                    isLight
                      ? 'border-slate-300 hover:border-amber-500 bg-slate-50/70'
                      : 'border-slate-700 hover:border-amber-400/60 bg-slate-950/60'
                  }`}
                >
                  <Upload className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <span className={`text-xs font-bold block ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                    Click to select blueprints, elevation drawings, or site images
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Allows our engineers to calculate structural steel tonnage accurately
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.dwg,.dxf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {/* Uploaded File List */}
                {files.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    {files.map((f, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs border ${
                          isLight ? 'bg-slate-50 border-slate-200' : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <Paperclip className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className={`truncate font-medium ${isLight ? 'text-slate-900' : 'text-slate-200'}`}>{f.name}</span>
                          <span className="text-slate-500 font-mono text-[11px]">({f.size})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customer Contact Details */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 border-t pt-4 ${
                isLight ? 'border-slate-200' : 'border-slate-800'
              }`}>
                <div>
                  <label className="block text-xs font-bold mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Name / Company"
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98260 00000"
                    className={`w-full rounded-xl px-3 py-2 text-xs font-mono focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">
                    Site Location (Bhopal/MP)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mandideep / Bhopal"
                    className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                      isLight
                        ? 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                        : 'bg-slate-950 border-slate-700 text-white focus:border-amber-400'
                    }`}
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold mb-1">
                  Specific Requirements & Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mention gauge thickness preferences, installation timeline, or custom architectural requests."
                  className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none border ${
                    isLight
                      ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-amber-500'
                      : 'bg-slate-950 border-slate-700 text-white placeholder-slate-500 focus:border-amber-400'
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-200 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                >
                  {loading ? 'Submitting to Engineering Yard...' : 'Submit Quote Request'}
                </button>

                <a
                  href={getWhatsAppQuoteLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send via WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
