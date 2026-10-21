import React, { useState } from 'react';
import {
  X,
  Sparkles,
  MapPin,
  Phone,
  CheckCircle2,
  Send,
  Calendar,
  GraduationCap,
  Building2,
  MessageCircle,
  FileText,
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
  const [activeView, setActiveView] = useState<'poster' | 'form'>(
    settings.popup_image_mode === 'split_form' ? 'form' : 'poster'
  );
  const [studentName, setStudentName] = useState('');
  const [dob, setDob] = useState('');
  const [institution, setInstitution] = useState(
    'UMA Matric Higher Secondary School, Alwarcoil'
  );
  const [gradeApplying, setGradeApplying] = useState('Primary Classes (I – V)');
  const [groupPreference, setGroupPreference] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [altPhone, setAltPhone] = useState('');
  const [address, setAddress] = useState('');
  const [previousSchool, setPreviousSchool] = useState('');
  const [message, setMessage] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setActiveView(settings.popup_image_mode === 'split_form' ? 'form' : 'poster');
    }
  }, [isOpen, settings.popup_image_mode]);

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
        alt_phone: altPhone.trim(),
        address: address.trim(),
        previous_school: previousSchool.trim(),
        message: message.trim(),
      });
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setStudentName('');
    setDob('');
    setParentName('');
    setPhone('');
    setAltPhone('');
    setAddress('');
    setPreviousSchool('');
    setMessage('');
    onClose();
  };

  const whatsappUrl = () => {
    const cleanPhone = '919442941018';
    const text = encodeURIComponent(
      `Hello UMA Matric Higher Secondary School,\n\nI would like to enquire about admission:\n• Student Name: ${studentName}\n• Applying For: ${gradeApplying}${
        isHigherSecondary && groupPreference ? ` (${groupPreference})` : ''
      }\n• Institution: ${institution}\n• Parent Name: ${parentName}\n• Contact: ${phone}\n• Location: ${address}`
    );
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Header Tabs: Poster Mode vs Form Mode */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView('poster')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'poster'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Announcement &amp; Toppers Poster</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('form')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeView === 'form'
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Online Admission Form</span>
            </button>
          </div>

          <button
            onClick={handleResetAndClose}
            className="p-1.5 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors cursor-pointer"
            aria-label="Close Admission Popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Poster Mode Display */}
        {activeView === 'poster' ? (
          <div className="flex-1 flex flex-col items-center p-4 sm:p-6 overflow-y-auto bg-slate-100/60">
            <div className="relative max-w-xl w-full bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <img
                src={settings.popup_banner_url || '/images/sslc_toppers_poster.jpg'}
                alt="UMA Matric Higher Secondary School SSLC 2025-26 Toppers and Admissions Announcement"
                className="w-full max-h-[64vh] object-contain bg-slate-900"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 w-full max-w-xl">
              <button
                type="button"
                onClick={() => setActiveView('form')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-sm transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Fill Online Admission Form</span>
              </button>
              <a
                href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-bold text-sm shadow-2xs transition-all"
              >
                <Phone className="w-4 h-4 text-sky-700" />
                <span>Call: {settings.correspondent_phone}</span>
              </a>
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-2xs transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Enquiry</span>
              </a>
              <button
                type="button"
                onClick={handleResetAndClose}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-semibold text-sm transition-colors cursor-pointer"
              >
                <span>Continue to Website</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto">
            {/* Left Column: Mild Promotional School Admission Info */}
            <div className="lg:w-5/12 bg-gradient-to-br from-sky-50 via-slate-50 to-blue-50/60 text-slate-800 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-200">
          <div className="relative z-10">
            {/* Logo & Header */}
            <div className="flex items-center gap-3 mb-5">
              <img
                src={settings.logo_url || '/logo.png'}
                alt={settings.school_name}
                className="w-14 h-14 rounded-full bg-white p-1 object-contain ring-1 ring-sky-200 shadow-xs shrink-0"
              />
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase text-sky-700 block">
                  {settings.school_motto}
                </span>
                <h4 className="font-serif-display font-bold text-base sm:text-lg leading-snug text-slate-900">
                  {settings.school_name}
                </h4>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-700" />
              <span>{settings.popup_badge || 'ADMISSIONS OPEN'}</span>
            </div>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 leading-tight mb-3">
              {settings.popup_title}
            </h3>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5">
              {settings.popup_subtitle}
            </p>

            {/* Optional Custom Admin Poster Image */}
            {settings.popup_banner_url && (
              <div className="mb-5 rounded-2xl overflow-hidden border border-slate-200 shadow-xs">
                <img
                  src={settings.popup_banner_url}
                  alt="Admission Announcement"
                  className="w-full h-36 object-cover"
                />
              </div>
            )}

            {/* Two Campuses Callout from PDF Page 8 */}
            <div className="space-y-3 mb-5">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <Building2 className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      UMA Matric Higher Secondary School
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-sky-700 shrink-0" />
                      <span>Alwarcoil, Neyyoor Post, Kanyakumari District</span>
                    </div>
                    <div className="text-[11px] text-sky-800 font-medium mt-1">
                      Primary • Middle • High School • Higher Secondary (+1 & +2)
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
                <div className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-slate-900">
                      UMA Kidz Global Horizon
                    </div>
                    <div className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-sky-700 shrink-0" />
                      <span>Madavilagam, Kandanvilai Post, Kanyakumari District</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Contact Footer */}
          <div className="relative z-10 pt-4 border-t border-slate-200 space-y-2 text-xs">
            {settings.popup_admission_date && (
              <div className="flex items-center gap-2 text-sky-800 font-bold">
                <Calendar className="w-4 h-4 shrink-0" />
                <span>Special Admission Date: {settings.popup_admission_date}</span>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-700">
              <a
                href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 hover:text-sky-800 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-sky-700" />
                <span>Correspondent: {settings.correspondent_phone}</span>
              </a>
              <a
                href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 hover:text-sky-800 font-semibold"
              >
                <Phone className="w-3.5 h-3.5 text-teal-700" />
                <span>Principal: {settings.principal_phone}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Online Admission Enquiry Form */}
        <div className="lg:w-7/12 p-6 sm:p-8 overflow-y-auto bg-white">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 px-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-2">
                Admission Enquiry Submitted!
              </h3>
              <p className="text-slate-600 text-sm max-w-md mb-6">
                Thank you, <strong>{parentName}</strong>! Your admission enquiry for{' '}
                <strong>{studentName}</strong> ({gradeApplying}) has been recorded. Our school office
                will contact you shortly on <strong>{phone}</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md justify-center">
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Also Send via WhatsApp</span>
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors cursor-pointer"
                >
                  Continue to Website
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600">
                  Quick Online Registration & Enquiry
                </span>
                <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-slate-900">
                  Admission Application / Enquiry Form
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill in your child&apos;s details below and our admissions desk will reach out to guide you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Student&apos;s Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="Enter child's name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select Institution <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    >
                      <option value="UMA Matric Higher Secondary School, Alwarcoil">
                        UMA Matric Hr. Sec. School (Alwarcoil)
                      </option>
                      <option value="UMA Kidz Global Horizon, Madavilagam">
                        UMA Kidz Global Horizon (Madavilagam)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Class / Level Applying For <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={gradeApplying}
                      onChange={(e) => setGradeApplying(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    >
                      <option value="Pre-KG / LKG / UKG">Kindergarten (Pre-KG / LKG / UKG)</option>
                      <option value="Primary Classes (I – V)">Primary Classes (Std I – V)</option>
                      <option value="Middle School (VI – VIII)">Middle School (Std VI – VIII)</option>
                      <option value="High School (IX – X)">High School (Std IX – X)</option>
                      <option value="Higher Secondary (+1 / Std XI)">
                        Higher Secondary (+1 / Std XI)
                      </option>
                      <option value="Higher Secondary (+2 / Std XII)">
                        Higher Secondary (+2 / Std XII)
                      </option>
                    </select>
                  </div>
                </div>

                {isHigherSecondary && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <label className="block text-xs font-bold text-amber-950 mb-1">
                      Higher Secondary Academic Group Preference <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={groupPreference}
                      onChange={(e) => setGroupPreference(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-lg border border-amber-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 outline-none"
                    >
                      <option value="Mathematics – Computer Science">
                        Group 1: Mathematics – Computer Science
                      </option>
                      <option value="Mathematics – Biology">
                        Group 2: Mathematics – Biology
                      </option>
                      <option value="Computer Science – Biology">
                        Group 3: Computer Science – Biology
                      </option>
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Parent / Guardian Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="Father / Mother / Guardian Name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile / WhatsApp Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Residential Place / Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Town / Village (e.g., Neyyoor, Kandanvilai)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Previous School (if applicable)
                    </label>
                    <input
                      type="text"
                      value={previousSchool}
                      onChange={(e) => setPreviousSchool(e.target.value)}
                      placeholder="Previous school name"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Any Questions / Transport Requirement
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask about school bus routes, fee structure, or campus visit..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-sky-200" />
                    <span>{submitting ? 'Submitting Application...' : 'Submit Admission Enquiry'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Explore Website First
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    )}
  </div>
</div>
  );
};
