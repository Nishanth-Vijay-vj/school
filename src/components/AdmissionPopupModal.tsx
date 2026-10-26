import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Phone,
  CheckCircle2,
  Send,
  MessageCircle,
  FileText,
  ArrowLeft,
  Calendar,
  MapPin,
} from 'lucide-react';
import { SchoolSettings, AdmissionEnquiry } from '../types/school';

interface AdmissionPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SchoolSettings;
  onSubmitEnquiry: (
    data: Omit<AdmissionEnquiry, 'id' | 'status' | 'created_at'>
  ) => Promise<void>;
}

export const AdmissionPopupModal: React.FC<AdmissionPopupModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSubmitEnquiry,
}) => {
  // Mode: 'poster' (clean announcement card) or 'form' (compact single-column enquiry)
  const [view, setView] = useState<'poster' | 'form'>('poster');

  // Form Fields
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [institution, setInstitution] = useState('UMA Matric Higher Secondary School, Alwarcoil');
  const [gradeApplying, setGradeApplying] = useState('Primary Classes (I – V)');
  const [groupPreference, setGroupPreference] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const isHigherSecondary = gradeApplying.includes('Higher Secondary');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !parentName.trim() || !phone.trim()) return;
    setSubmitting(true);
    try {
      await onSubmitEnquiry({
        student_name: studentName.trim(),
        dob,
        institution,
        grade_applying: gradeApplying,
        group_preference: isHigherSecondary ? groupPreference || 'Mathematics – Computer Science' : '',
        parent_name: parentName.trim(),
        phone: phone.trim(),
        alt_phone: '',
        address: address.trim(),
        previous_school: '',
        message: message.trim(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setView('poster');
    setStudentName('');
    setDob('');
    setParentName('');
    setPhone('');
    setAddress('');
    setMessage('');
    onClose();
  };

  const whatsappUrl = () => {
    const cleanPhone = '919442941018';
    const text = encodeURIComponent(
      `Hello UMA Matric Higher Secondary School,\n\nI would like to enquire about Admissions 2026–2027:\n• Student Name: ${studentName || 'Prospective Student'}\n• Class Applying: ${gradeApplying}${
        isHigherSecondary && groupPreference ? ` (${groupPreference})` : ''
      }\n• Parent Name: ${parentName || 'Parent'}\n• Phone: ${phone || ''}\n• Location: ${address || 'Kanyakumari District'}`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Sleek Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-slate-100 bg-slate-50/90 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              {view === 'form' ? 'Online Admission Enquiry' : settings.popup_badge || 'Admissions Open 2026–2027'}
            </span>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto">
          {submitted ? (
            /* Submission Confirmation Screen */
            <div className="py-6 px-2 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3 shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Admission Enquiry Received!
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mb-5 leading-relaxed">
                Thank you, <strong>{parentName}</strong>! We have received your enquiry for{' '}
                <strong>{studentName}</strong> ({gradeApplying}). Our admissions team will contact you shortly on <strong>{phone}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Office</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Close &amp; Browse
                </button>
              </div>
            </div>
          ) : view === 'poster' ? (
            /* Mode 1: Clean Practical Announcement Poster View */
            <div className="space-y-3.5">
              {/* Announcement Poster Image */}
              <div className="rounded-xl overflow-hidden border border-slate-200 shadow-xs bg-slate-900">
                <img
                  src={settings.popup_banner_url || '/images/sslc_toppers_poster.jpg'}
                  alt="UMA Matric School Admissions Announcement &amp; SSLC Toppers"
                  className="w-full max-h-[46vh] object-contain mx-auto"
                />
              </div>

              {/* Quick Info Strip */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-2.5 flex items-center justify-between text-xs text-sky-950">
                <div className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span className="truncate">Alwarcoil Campus • Kanyakumari</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-sky-900 shrink-0">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  <span>2026–2027</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => setView('form')}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Apply / Quick Online Enquiry</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:9442941018"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-700" />
                    <span>Call Office</span>
                  </a>

                  <a
                    href={whatsappUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full text-center py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Continue to Website →
                </button>
              </div>
            </div>
          ) : (
            /* Mode 2: Compact Single-Column Online Enquiry Form */
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <button
                  type="button"
                  onClick={() => setView('poster')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>View Poster</span>
                </button>
                <span className="text-[11px] text-slate-500">Quick 30-sec form</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="e.g. R. Ananya"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 focus:ring-1 focus:ring-sky-600 outline-hidden bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Class Applying For <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={gradeApplying}
                      onChange={(e) => setGradeApplying(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 outline-hidden bg-slate-50/50"
                    >
                      <option value="Pre-KG / LKG / UKG">Kindergarten (Pre-KG / LKG / UKG)</option>
                      <option value="Primary Classes (I – V)">Primary Classes (I – V)</option>
                      <option value="Middle School (VI – VIII)">Middle School (VI – VIII)</option>
                      <option value="High School (IX – X)">High School (IX – X)</option>
                      <option value="Higher Secondary (+1)">Higher Secondary (+1)</option>
                      <option value="Higher Secondary (+2)">Higher Secondary (+2)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Campus Preference
                    </label>
                    <select
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 outline-hidden bg-slate-50/50"
                    >
                      <option value="UMA Matric Higher Secondary School, Alwarcoil">
                        UMA Matric HSS, Alwarcoil
                      </option>
                      <option value="UMA Kidz Global Horizon, Madavilagam">
                        UMA Kidz, Madavilagam
                      </option>
                    </select>
                  </div>
                </div>

                {isHigherSecondary && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      +1 / +2 Stream Group <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={groupPreference}
                      onChange={(e) => setGroupPreference(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 outline-hidden bg-slate-50/50"
                    >
                      <option value="Mathematics – Computer Science">Group 1: Maths – Computer Science</option>
                      <option value="Mathematics – Biology">Group 2: Maths – Biology</option>
                      <option value="Computer Science – Biology">Group 3: Computer Science – Biology</option>
                      <option value="Commerce – Accountancy – Computer Applications">Group 4: Commerce &amp; Computer Applications</option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent / Guardian Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Father / Mother name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 outline-hidden bg-slate-50/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 outline-hidden bg-slate-50/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Town / Area / Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Neyyoor, Nagercoil, Thuckalay"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-sky-600 outline-hidden bg-slate-50/50"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-700 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Submitting...' : 'Submit Enquiry'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setView('poster')}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
