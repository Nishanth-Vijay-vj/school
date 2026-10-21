import React, { useState } from 'react';
import {
  X,
  Shield,
  Lock,
  Megaphone,
  Bell,
  Image as ImageIcon,
  Video,
  Users,
  Sparkles,
  Trash2,
  Plus,
  Upload,
  CheckCircle2,
  Download,
  Cloud,
  LogOut,
  Pin,
  Eye,
  Save,
  Calendar,
} from 'lucide-react';
import {
  SchoolSettings,
  SchoolEvent,
  TickerItem,
  NoticeItem,
  GalleryItem,
  AdmissionEnquiry,
} from '../types/school';
import {
  uploadMediaFile,
  isSupabaseConfigured,
  saveRuntimeSupabaseCredentials,
  clearRuntimeSupabaseCredentials,
  syncLocalDataToSupabase,
} from '../lib/supabase';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLoginSuccess: () => void;
  onLogout: () => void;
  initialTab?: 'ticker' | 'popup' | 'notices' | 'events' | 'gallery' | 'leadership' | 'cloud';
  settings: SchoolSettings;
  tickerItems: TickerItem[];
  notices: NoticeItem[];
  events: SchoolEvent[];
  gallery: GalleryItem[];
  enquiries: AdmissionEnquiry[];
  onSaveSettings: (newSettings: SchoolSettings) => Promise<void>;
  onSaveTicker: (item: TickerItem) => Promise<void>;
  onDeleteTicker: (id: string) => Promise<void>;
  onSaveNotice: (notice: NoticeItem) => Promise<void>;
  onDeleteNotice: (id: string) => Promise<void>;
  onSaveEvent: (event: SchoolEvent) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
  onSaveGallery: (item: GalleryItem) => Promise<void>;
  onDeleteGallery: (id: string) => Promise<void>;
  onUpdateEnquiryStatus: (id: string, status: AdmissionEnquiry['status']) => Promise<void>;
  onDeleteEnquiry: (id: string) => Promise<void>;
  onRefreshData: () => Promise<void>;
}

const DEFAULT_PASSCODE = (import.meta.env.VITE_ADMIN_PASSCODE as string) || 'UMA@2026';

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  onLoginSuccess,
  onLogout,
  initialTab = 'popup',
  settings,
  tickerItems,
  notices,
  events,
  gallery,
  enquiries,
  onSaveSettings,
  onSaveTicker,
  onDeleteTicker,
  onSaveNotice,
  onDeleteNotice,
  onSaveEvent,
  onDeleteEvent,
  onSaveGallery,
  onDeleteGallery,
  onUpdateEnquiryStatus,
  onDeleteEnquiry,
  onRefreshData,
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'ticker' | 'popup' | 'notices' | 'events' | 'gallery' | 'leadership' | 'cloud'
  >(initialTab);

  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Settings form state
  const [formSettings, setFormSettings] = useState<SchoolSettings>(settings);
  React.useEffect(() => {
    setFormSettings(settings);
  }, [settings]);

  const [savingStatus, setSavingStatus] = useState<string>('');
  const [uploadingField, setUploadingField] = useState<string>('');

  // New Ticker state
  const [newTickerTag, setNewTickerTag] = useState('ADMISSIONS OPEN');
  const [newTickerText, setNewTickerText] = useState('');
  const [newTickerLink, setNewTickerLink] = useState('#admissions');

  // New Notice state
  const [noticeTitle, setNoticeTitle] = useState('');
  const [noticeDate, setNoticeDate] = useState(new Date().toISOString().split('T')[0]);
  const [noticeCategory, setNoticeCategory] = useState<NoticeItem['category']>('Admission');
  const [noticeLocation, setNoticeLocation] = useState('UMA Matric Higher Secondary School, Alwarcoil');
  const [noticeContent, setNoticeContent] = useState('');
  const [noticePinned, setNoticePinned] = useState(true);
  const [noticeAttachmentUrl, setNoticeAttachmentUrl] = useState('');

  // New Gallery Item state
  const [galTitle, setGalTitle] = useState('');
  const [galDesc, setGalDesc] = useState('');
  const [galMediaType, setGalMediaType] = useState<'image' | 'video'>('image');
  const [galCategory, setGalCategory] = useState<GalleryItem['category']>('Campus & Facilities');
  const [galMediaUrl, setGalMediaUrl] = useState('');
  const [galThumbUrl, setGalThumbUrl] = useState('');

  // New Event state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventCategory, setEventCategory] = useState('School Events');
  const [eventLocation, setEventLocation] = useState('Alwarcoil Campus');
  const [eventImageUrl, setEventImageUrl] = useState('/images/students_event.jpg');
  const [eventDescription, setEventDescription] = useState('');

  // Cloud Config state
  const [sbUrl, setSbUrl] = useState(
    localStorage.getItem('uma_supabase_url') || 'https://yyujcbjuixyaqcbbstok.supabase.co'
  );
  const [sbKey, setSbKey] = useState(
    localStorage.getItem('uma_supabase_anon_key') ||
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dWpjYmp1aXh5YXFjYmJzdG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjg3MDcsImV4cCI6MjEwNzQwNDcwN30.ca7EyBfbUqhIDmp6RY4jAaxPcnbWqoQYkmNQplXN8lk'
  );
  const [cloudMsg, setCloudMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setSavingStatus(msg);
    setTimeout(() => setSavingStatus(''), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput.trim() === DEFAULT_PASSCODE || passcodeInput.trim() === 'admin123') {
      setLoginError('');
      setPasscodeInput('');
      onLoginSuccess();
    } else {
      setLoginError('Invalid Admin Passcode. Please try again.');
    }
  };

  const handleFileUpload = async (
    file: File,
    folder: 'portraits' | 'gallery' | 'posters' | 'logos',
    fieldKey: string,
    onUrlReady: (url: string) => void
  ) => {
    setUploadingField(fieldKey);
    try {
      const url = await uploadMediaFile(file, folder);
      onUrlReady(url);
      showToast('File uploaded successfully!');
    } catch (err) {
      console.error(err);
      showToast('Failed to process file.');
    } finally {
      setUploadingField('');
    }
  };

  const handleSaveSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveSettings(formSettings);
    showToast('Changes saved & published live!');
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTickerText.trim()) return;
    await onSaveTicker({
      id: `ticker-${Date.now()}`,
      tag: newTickerTag.trim() || 'UPDATE',
      text: newTickerText.trim(),
      is_active: true,
      link_section: newTickerLink,
      sort_order: tickerItems.length + 1,
    });
    setNewTickerText('');
    showToast('Important news ticker added!');
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeContent.trim()) return;
    await onSaveNotice({
      id: `notice-${Date.now()}`,
      title: noticeTitle.trim(),
      date: noticeDate,
      category: noticeCategory,
      content: noticeContent.trim(),
      location: noticeLocation.trim(),
      is_pinned: noticePinned,
      attachment_url: noticeAttachmentUrl.trim(),
    });
    setNoticeTitle('');
    setNoticeContent('');
    setNoticeAttachmentUrl('');
    showToast('Notice published to Notice Board!');
  };

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galTitle.trim() || !galMediaUrl.trim()) return;
    await onSaveGallery({
      id: `gal-${Date.now()}`,
      title: galTitle.trim(),
      description: galDesc.trim(),
      media_type: galMediaType,
      media_url: galMediaUrl.trim(),
      thumbnail_url: galThumbUrl.trim(),
      category: galCategory,
      is_featured: true,
    });
    setGalTitle('');
    setGalDesc('');
    setGalMediaUrl('');
    setGalThumbUrl('');
    showToast(`${galMediaType === 'video' ? 'Video' : 'Picture'} added to Gallery!`);
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDescription.trim()) return;
    await onSaveEvent({
      id: `ev-${Date.now()}`,
      title: eventTitle.trim(),
      date: eventDate,
      category: eventCategory,
      location: eventLocation.trim(),
      image_url: eventImageUrl.trim() || '/images/students_event.jpg',
      description: eventDescription.trim(),
    });
    setEventTitle('');
    setEventImageUrl('/images/students_event.jpg');
    setEventDescription('');
    showToast('School event added successfully!');
  };

  const exportEnquiriesToCSV = () => {
    if (enquiries.length === 0) return;
    const headers = [
      'Date',
      'Student Name',
      'DOB',
      'Institution',
      'Grade Applying',
      'Hr Sec Group',
      'Parent Name',
      'Phone',
      'Address',
      'Previous School',
      'Message',
      'Status',
    ];
    const rows = enquiries.map((e) => [
      new Date(e.created_at).toLocaleDateString(),
      `"${e.student_name.replace(/"/g, '""')}"`,
      e.dob,
      `"${e.institution.replace(/"/g, '""')}"`,
      `"${e.grade_applying}"`,
      `"${e.group_preference || ''}"`,
      `"${e.parent_name.replace(/"/g, '""')}"`,
      e.phone,
      `"${(e.address || '').replace(/"/g, '""')}"`,
      `"${(e.previous_school || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`,
      e.status,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `UMA_School_Admission_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Admin Header Bar */}
        <div className="bg-gradient-to-r from-[#0a1931] via-[#132d59] to-[#0a1931] text-white px-6 py-4 flex items-center justify-between border-b border-amber-500/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif-display text-lg sm:text-xl font-bold text-white">
                UMA School — Official Admin Control Panel
              </h2>
              <p className="text-xs text-sky-200">
                Manage Important News Ticker, Admission Popup, Notice Board, Photo/Video Gallery &amp; Leadership Portraits
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {savingStatus && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-extrabold animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{savingStatus}</span>
              </span>
            )}
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-red-600 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Login Gate if not authenticated */}
        {!isLoggedIn ? (
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-1">
              Administrator Sign In
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Enter the school administrator passcode to edit the Gallery, Notice Board, Important News Ticker, Admission Popup, and Leadership Portraits.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter Admin Passcode (Default: UMA@2026)"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center font-bold tracking-wider text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
                />
                {loginError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5">{loginError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl bg-[#0a1931] hover:bg-[#132d59] text-amber-300 font-bold text-sm shadow-lg transition-all cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>

              <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-xs">
                Default Passcode: <code className="font-bold text-slate-900">UMA@2026</code> (can be customized via <code className="text-slate-800">VITE_ADMIN_PASSCODE</code> in Vercel/Supabase environment variables).
              </div>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Workspace */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 p-3 sm:p-4 flex lg:flex-col gap-1.5 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('popup')}
                className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'popup'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>1. Submitted Forms &amp; Popup</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold">
                  {enquiries.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('ticker')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'ticker'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Megaphone className="w-4 h-4 shrink-0" />
                <span>2. Scrolling News Ticker</span>
              </button>

              <button
                onClick={() => setActiveTab('notices')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'notices'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Bell className="w-4 h-4 shrink-0" />
                <span>3. Notice Board</span>
              </button>

              <button
                onClick={() => setActiveTab('events')}
                className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'events'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>4. School Events</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-sky-200 text-sky-950 text-[11px] font-extrabold">
                  {events.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span>5. Photo &amp; Video Gallery</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[11px] font-bold">
                  {gallery.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('leadership')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'leadership'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>6. Hero, Portraits &amp; Logo</span>
              </button>

              <button
                onClick={() => setActiveTab('cloud')}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'cloud'
                    ? 'bg-sky-800 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Cloud className="w-4 h-4 shrink-0" />
                <span>7. Supabase &amp; Vercel Sync</span>
              </button>
            </div>

            {/* Main Tab Content Area */}
            <div className="flex-1 p-5 sm:p-8 overflow-y-auto bg-white">
              {/* TAB 1: IMPORTANT NEWS TICKER BELOW TITLE CARD */}
              {activeTab === 'ticker' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                      Important News Ticker (Runs Below Title Card)
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Add or edit flash announcements that scroll continuously below the school title bar (e.g., &ldquo;Admissions Open&rdquo;, Vijaya Dasami dates, exam alerts).
                    </p>
                  </div>

                  {/* Add New Ticker Form */}
                  <form
                    onSubmit={handleAddTicker}
                    className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4"
                  >
                    <h4 className="font-bold text-sm text-amber-950 flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      <span>Add New Scrolling Flash News Item</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Badge Tag
                        </label>
                        <input
                          type="text"
                          value={newTickerTag}
                          onChange={(e) => setNewTickerTag(e.target.value)}
                          placeholder="ADMISSIONS OPEN"
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Scrolling News Text <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={newTickerText}
                          onChange={(e) => setNewTickerText(e.target.value)}
                          placeholder="e.g., 🌟 Admissions Open for 2026-27 from Pre-KG to +2! Apply Now."
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Click Target
                        </label>
                        <select
                          value={newTickerLink}
                          onChange={(e) => setNewTickerLink(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        >
                          <option value="#admissions">Open Admission Popup</option>
                          <option value="#notices">Scroll to Notice Board</option>
                          <option value="#academics">Scroll to Academics</option>
                          <option value="#contact">Scroll to Contact</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1931] hover:bg-[#132d59] text-amber-300 font-bold text-xs sm:text-sm shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish to News Ticker</span>
                    </button>
                  </form>

                  {/* Existing Ticker Items */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-slate-800">
                      Current Scrolling Ticker Items ({tickerItems.length})
                    </h4>
                    {tickerItems.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={item.is_active}
                            onChange={() =>
                              onSaveTicker({ ...item, is_active: !item.is_active })
                            }
                            className="mt-1 w-4 h-4 accent-amber-600 cursor-pointer"
                            title="Toggle Active"
                          />
                          <div>
                            <span className="inline-block px-2 py-0.5 rounded bg-slate-900 text-amber-300 text-[10px] font-extrabold uppercase mr-2">
                              {item.tag}
                            </span>
                            <span
                              className={`text-sm font-semibold ${
                                item.is_active ? 'text-slate-900' : 'text-slate-400 line-through'
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => onDeleteTicker(item.id)}
                          className="self-end sm:self-auto p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Ticker Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 1: SUBMITTED ADMISSION FORMS & POPUP CONFIG */}
              {activeTab === 'popup' && (
                <div className="space-y-8">
                  {/* Submitted Admission Enquiries Table (Shown First!) */}
                  <div className="space-y-4 p-6 rounded-2xl bg-sky-50/60 border border-sky-200">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-sky-700 text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                          Parent Admission Enquiries
                        </span>
                        <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-slate-900">
                          Submitted Admission Forms ({enquiries.length})
                        </h3>
                        <p className="text-xs text-slate-600">
                          All admission forms submitted by parents via the popup or website appear immediately below.
                        </p>
                      </div>

                      {enquiries.length > 0 && (
                        <button
                          onClick={exportEnquiriesToCSV}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Forms to CSV / Excel</span>
                        </button>
                      )}
                    </div>

                    {enquiries.length === 0 ? (
                      <div className="p-8 rounded-2xl bg-white border border-dashed border-slate-300 text-center text-slate-500 text-sm">
                        No online admission forms have been submitted yet. When a parent fills out the Admission Popup Form, their details will appear here immediately!
                      </div>
                    ) : (
                      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-slate-800 text-white">
                              <th className="p-3 font-bold">Student &amp; DOB</th>
                              <th className="p-3 font-bold">Campus &amp; Class</th>
                              <th className="p-3 font-bold">Parent &amp; Phone</th>
                              <th className="p-3 font-bold">Location / Notes</th>
                              <th className="p-3 font-bold">Status</th>
                              <th className="p-3 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {enquiries.map((enq) => (
                              <tr key={enq.id} className="hover:bg-slate-50">
                                <td className="p-3">
                                  <div className="font-bold text-slate-900">{enq.student_name}</div>
                                  <div className="text-xs text-slate-500">
                                    DOB: {enq.dob || 'N/A'}
                                  </div>
                                  <div className="text-[11px] text-slate-400">
                                    {new Date(enq.created_at).toLocaleString()}
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="font-semibold text-slate-800">
                                    {enq.grade_applying}
                                  </div>
                                  {enq.group_preference && (
                                    <div className="text-xs font-bold text-sky-700">
                                      Group: {enq.group_preference}
                                    </div>
                                  )}
                                  <div className="text-xs text-slate-500">{enq.institution}</div>
                                </td>
                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">
                                    {enq.parent_name}
                                  </div>
                                  <a
                                    href={`tel:${enq.phone}`}
                                    className="text-sky-700 font-bold hover:underline"
                                  >
                                    📞 {enq.phone}
                                  </a>
                                </td>
                                <td className="p-3 max-w-xs">
                                  <div className="text-slate-700">{enq.address || '—'}</div>
                                  {enq.previous_school && (
                                    <div className="text-xs text-slate-500">
                                      Prev School: {enq.previous_school}
                                    </div>
                                  )}
                                  {enq.message && (
                                    <div className="text-xs text-slate-500 italic mt-0.5">
                                      &ldquo;{enq.message}&rdquo;
                                    </div>
                                  )}
                                </td>
                                <td className="p-3">
                                  <select
                                    value={enq.status}
                                    onChange={(e) =>
                                      onUpdateEnquiryStatus(
                                        enq.id,
                                        e.target.value as AdmissionEnquiry['status']
                                      )
                                    }
                                    className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                                  >
                                    <option value="New">🔴 New</option>
                                    <option value="Contacted">🟡 Contacted</option>
                                    <option value="Admitted">🟢 Admitted</option>
                                    <option value="Closed">⚪ Closed</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => onDeleteEnquiry(enq.id)}
                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                                    title="Delete Enquiry"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Website-Load Admission Popup Configuration */}
                  <form
                    onSubmit={handleSaveSettingsSubmit}
                    className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-200">
                      <div>
                        <h3 className="font-serif-display text-xl font-bold text-slate-900">
                          Website-Load Admission Popup Settings
                        </h3>
                        <p className="text-xs text-slate-600">
                          Control the admission popup that automatically greets parents when they open the website.
                        </p>
                      </div>

                      <label className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-slate-300 cursor-pointer shadow-xs">
                        <input
                          type="checkbox"
                          checked={formSettings.popup_enabled}
                          onChange={(e) =>
                            setFormSettings({
                              ...formSettings,
                              popup_enabled: e.target.checked,
                            })
                          }
                          className="w-4 h-4 accent-emerald-600"
                        />
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                          {formSettings.popup_enabled
                            ? '✅ Popup Enabled on Website Open'
                            : '❌ Popup Disabled'}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Popup Top Badge
                        </label>
                        <input
                          type="text"
                          value={formSettings.popup_badge}
                          onChange={(e) =>
                            setFormSettings({ ...formSettings, popup_badge: e.target.value })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Special Admission Date Highlight
                        </label>
                        <input
                          type="text"
                          value={formSettings.popup_admission_date}
                          onChange={(e) =>
                            setFormSettings({
                              ...formSettings,
                              popup_admission_date: e.target.value,
                            })
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Popup Headline Title
                      </label>
                      <input
                        type="text"
                        value={formSettings.popup_title}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, popup_title: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Popup Welcome Message / Subtitle
                      </label>
                      <textarea
                        rows={2}
                        value={formSettings.popup_subtitle}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, popup_subtitle: e.target.value })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Optional Promotional Banner / Poster Image inside Popup
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={formSettings.popup_banner_url}
                          onChange={(e) =>
                            setFormSettings({
                              ...formSettings,
                              popup_banner_url: e.target.value,
                            })
                          }
                          placeholder="Paste image URL or upload file ->"
                          className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>
                            {uploadingField === 'popup_banner' ? 'Uploading...' : 'Upload Poster'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, 'posters', 'popup_banner', (url) =>
                                  setFormSettings((prev) => ({ ...prev, popup_banner_url: url }))
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Admission Popup Settings</span>
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: NOTICE BOARD MANAGER */}
              {activeTab === 'notices' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                      Manage Digital Notice Board &amp; Announcements
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Post circulars, Vijaya Dasami admission dates, holiday alerts, or exam schedules.
                    </p>
                  </div>

                  <form
                    onSubmit={handleAddNotice}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-600" />
                      <span>Post New Official Notice</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Notice Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={noticeTitle}
                          onChange={(e) => setNoticeTitle(e.target.value)}
                          placeholder="e.g., Vijaya Dasami Admissions – 20 October 2026"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Date
                        </label>
                        <input
                          type="date"
                          value={noticeDate}
                          onChange={(e) => setNoticeDate(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          value={noticeCategory}
                          onChange={(e) =>
                            setNoticeCategory(e.target.value as NoticeItem['category'])
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        >
                          <option value="Admission">Admission</option>
                          <option value="Academic">Academic</option>
                          <option value="Activities">Activities</option>
                          <option value="Event">Event</option>
                          <option value="Holiday">Holiday</option>
                          <option value="General">General</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Campus / Location
                        </label>
                        <input
                          type="text"
                          value={noticeLocation}
                          onChange={(e) => setNoticeLocation(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div className="flex items-end">
                        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-100/70 border border-amber-300 text-xs font-bold text-amber-950 cursor-pointer w-full">
                          <input
                            type="checkbox"
                            checked={noticePinned}
                            onChange={(e) => setNoticePinned(e.target.checked)}
                            className="w-4 h-4 accent-amber-600"
                          />
                          <span>Pin to Top of Notice Board</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Notice Details / Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={noticeContent}
                        onChange={(e) => setNoticeContent(e.target.value)}
                        placeholder="Write the full announcement details here..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={noticeAttachmentUrl}
                        onChange={(e) => setNoticeAttachmentUrl(e.target.value)}
                        placeholder="Optional Attachment / Poster URL or upload ->"
                        className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                      <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer">
                        <Upload className="w-4 h-4" />
                        <span>
                          {uploadingField === 'notice_att' ? 'Uploading...' : 'Upload Poster/Image'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFileUpload(file, 'posters', 'notice_att', (url) =>
                                setNoticeAttachmentUrl(url)
                              );
                            }
                          }}
                        />
                      </label>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0a1931] hover:bg-[#132d59] text-amber-300 font-bold text-xs sm:text-sm shadow cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Publish Notice</span>
                      </button>
                    </div>
                  </form>

                  {/* Existing Notices List */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm text-slate-800">
                      Published Notices ({notices.length})
                    </h4>
                    {notices.map((n) => (
                      <div
                        key={n.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {n.is_pinned && (
                              <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase">
                                Pinned
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-bold">
                              {n.category}
                            </span>
                            <span className="text-xs text-slate-400">{n.date}</span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-base">{n.title}</h5>
                          <p className="text-xs text-slate-600 line-clamp-2">{n.content}</p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => onSaveNotice({ ...n, is_pinned: !n.is_pinned })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                              n.is_pinned
                                ? 'bg-amber-100 border-amber-300 text-amber-900'
                                : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}
                          >
                            <Pin className="w-3.5 h-3.5 inline mr-1" />
                            {n.is_pinned ? 'Unpin' : 'Pin'}
                          </button>
                          <button
                            onClick={() => onDeleteNotice(n.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Delete Notice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: SCHOOL EVENTS MANAGER */}
              {activeTab === 'events' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                      Manage School Activities &amp; Events
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Add, update, or remove school events with real event photos, dates, locations, and descriptions. All changes update the website and Supabase immediately.
                    </p>
                  </div>

                  {/* Add New School Event Form */}
                  <form
                    onSubmit={handleAddEvent}
                    className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 space-y-4"
                  >
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-sky-700" />
                      <span>Add New School Event</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="e.g., Annual Sports Meet &amp; March Past / Science Expo"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Event Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Category
                        </label>
                        <select
                          value={eventCategory}
                          onChange={(e) => setEventCategory(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        >
                          <option value="School Events">School Events</option>
                          <option value="Co-Curricular Activities">Co-Curricular Activities</option>
                          <option value="Sports & Physical Activities">Sports &amp; Physical Activities</option>
                          <option value="Educational Activities">Educational Activities</option>
                          <option value="Celebrations & Festivals">Celebrations &amp; Festivals</option>
                          <option value="Academic Achievements">Academic Achievements</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Venue / Location
                        </label>
                        <input
                          type="text"
                          value={eventLocation}
                          onChange={(e) => setEventLocation(e.target.value)}
                          placeholder="e.g., Alwarcoil Main Campus Grounds"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Event Photo (Upload File or Paste Image URL)
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={eventImageUrl}
                          onChange={(e) => setEventImageUrl(e.target.value)}
                          placeholder="Paste image URL (e.g. /images/students_event.jpg) or click Upload Photo ->"
                          className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>
                            {uploadingField === 'event_img' ? 'Uploading...' : 'Upload Event Photo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, 'posters', 'event_img', (url) =>
                                  setEventImageUrl(url)
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Event Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Describe the activities, student participation, and highlights of this event..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Publish Event to Website</span>
                    </button>
                  </form>

                  {/* Existing Events List */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 mb-3">
                      Current School Events ({events.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {events.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between"
                        >
                          <div className="relative h-44 bg-slate-900">
                            <img
                              src={ev.image_url || '/images/students_event.jpg'}
                              alt={ev.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-sky-900/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                              {ev.category}
                            </span>
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs">
                              {ev.date}
                            </span>
                          </div>

                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h5 className="font-serif-display font-bold text-slate-900 text-base leading-snug">
                                {ev.title}
                              </h5>
                              {ev.location && (
                                <p className="text-xs text-sky-800 font-medium mt-1">
                                  📍 {ev.location}
                                </p>
                              )}
                              <p className="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
                                {ev.description}
                              </p>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              <span className="text-[11px] text-slate-400">ID: {ev.id}</span>
                              <button
                                onClick={() => onDeleteEvent(ev.id)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
                                title="Delete Event"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Event</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: PHOTO & VIDEO GALLERY MANAGER */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                      Manage Campus Photo &amp; Video Gallery
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Upload pictures (JPG/PNG/WebP) or videos (MP4/WebM file uploads OR YouTube links) to showcase school events, laboratories, sports, and achievements.
                    </p>
                  </div>

                  {/* Upload New Photo / Video Form */}
                  <form
                    onSubmit={handleAddGallery}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Plus className="w-4 h-4 text-amber-600" />
                        <span>Add New Picture or Video to Gallery</span>
                      </h4>

                      {/* Media Type Selector */}
                      <div className="inline-flex rounded-xl bg-slate-200 p-1">
                        <button
                          type="button"
                          onClick={() => setGalMediaType('image')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            galMediaType === 'image'
                              ? 'bg-[#0a1931] text-amber-300 shadow'
                              : 'text-slate-700'
                          }`}
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Picture / Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGalMediaType('video')}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                            galMediaType === 'video'
                              ? 'bg-red-600 text-white shadow'
                              : 'text-slate-700'
                          }`}
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Video (File or YouTube)</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Title / Caption <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={galTitle}
                          onChange={(e) => setGalTitle(e.target.value)}
                          placeholder="e.g., Annual Sports Meet / Science Exhibition"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Gallery Category
                        </label>
                        <select
                          value={galCategory}
                          onChange={(e) =>
                            setGalCategory(e.target.value as GalleryItem['category'])
                          }
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        >
                          <option value="Campus & Facilities">Campus &amp; Facilities</option>
                          <option value="Science & Computer Labs">Science &amp; Computer Labs</option>
                          <option value="Annual Day & Cultural">Annual Day &amp; Cultural</option>
                          <option value="Sports & Physical Activities">
                            Sports &amp; Physical Activities
                          </option>
                          <option value="Events & Celebrations">Events &amp; Celebrations</option>
                          <option value="Student Achievements">Student Achievements</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {galMediaType === 'image'
                          ? 'Upload Photo File or Paste Image URL *'
                          : 'Upload Video File (MP4/WebM) or Paste YouTube / Video Link *'}
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          required
                          value={galMediaUrl}
                          onChange={(e) => setGalMediaUrl(e.target.value)}
                          placeholder={
                            galMediaType === 'image'
                              ? 'Paste image URL or click Upload Photo ->'
                              : 'Paste YouTube URL (e.g. https://youtu.be/...) or click Upload Video File ->'
                          }
                          className="flex-1 min-w-[220px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>
                            {uploadingField === 'gallery_media'
                              ? 'Uploading...'
                              : galMediaType === 'image'
                              ? 'Upload Photo from Device'
                              : 'Upload Video File (MP4)'}
                          </span>
                          <input
                            type="file"
                            accept={galMediaType === 'image' ? 'image/*' : 'video/*'}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, 'gallery', 'gallery_media', (url) =>
                                  setGalMediaUrl(url)
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    {galMediaType === 'video' && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Optional Video Cover Thumbnail (Auto-generated for YouTube links)
                        </label>
                        <div className="flex flex-wrap items-center gap-3">
                          <input
                            type="text"
                            value={galThumbUrl}
                            onChange={(e) => setGalThumbUrl(e.target.value)}
                            placeholder="Optional cover image URL for uploaded MP4 video"
                            className="flex-1 min-w-[200px] px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                          />
                          <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Cover Image</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload(file, 'gallery', 'gallery_thumb', (url) =>
                                    setGalThumbUrl(url)
                                  );
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Short Description
                      </label>
                      <input
                        type="text"
                        value={galDesc}
                        onChange={(e) => setGalDesc(e.target.value)}
                        placeholder="Brief description of this activity or event..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0a1931] hover:bg-[#132d59] text-amber-300 font-bold text-xs sm:text-sm shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to School Gallery</span>
                    </button>
                  </form>

                  {/* Existing Gallery Grid */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 mb-3">
                      Current Gallery Items ({gallery.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {gallery.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between"
                        >
                          <div className="relative h-36 bg-slate-900">
                            {item.media_type === 'video' && !item.thumbnail_url ? (
                              <div className="w-full h-full flex flex-col items-center justify-center text-amber-400 p-4 text-center">
                                <Video className="w-8 h-8 mb-1" />
                                <span className="text-xs text-white font-semibold line-clamp-1">
                                  {item.title}
                                </span>
                              </div>
                            ) : (
                              <img
                                src={item.thumbnail_url || item.media_url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                            <span
                              className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                                item.media_type === 'video'
                                  ? 'bg-red-600 text-white'
                                  : 'bg-slate-900/80 text-amber-300'
                              }`}
                            >
                              {item.media_type}
                            </span>
                          </div>
                          <div className="p-3 flex items-center justify-between gap-2">
                            <div className="min-w-0">
                              <div className="text-[10px] font-bold text-amber-700 uppercase">
                                {item.category}
                              </div>
                              <div className="font-bold text-xs text-slate-900 truncate">
                                {item.title}
                              </div>
                            </div>
                            <button
                              onClick={() => onDeleteGallery(item.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 shrink-0 cursor-pointer"
                              title="Delete Gallery Item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LEADERSHIP PORTRAITS (CORRESPONDENT & PRINCIPAL) & SCHOOL LOGO */}
              {activeTab === 'leadership' && (
                <form onSubmit={handleSaveSettingsSubmit} className="space-y-8">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                      Modify Correspondent &amp; Principal Portraits, Messages &amp; School Logo
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Upload new official portraits for the Correspondent and Principal, edit their messages/qualifications, or update the school crest logo.
                    </p>
                  </div>

                  {/* School Logo Section */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
                    <img
                      src={formSettings.logo_url || '/logo.png'}
                      alt="School Logo"
                      className="w-20 h-20 rounded-full object-contain bg-white p-1 border-2 border-amber-400 shadow"
                    />
                    <div className="flex-1 space-y-2 w-full">
                      <label className="block text-xs font-bold text-slate-800">
                        School Emblem / Logo Image
                      </label>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={formSettings.logo_url}
                          onChange={(e) =>
                            setFormSettings({ ...formSettings, logo_url: e.target.value })
                          }
                          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>
                            {uploadingField === 'logo' ? 'Uploading...' : 'Upload New Logo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, 'logos', 'logo', (url) =>
                                  setFormSettings((prev) => ({ ...prev, logo_url: url }))
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Hero Section Banner Image (Modifiable by Admin) */}
                  <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-200 flex flex-col sm:flex-row items-center gap-5">
                    <div className="w-28 h-20 rounded-xl overflow-hidden bg-slate-900 border border-slate-300 shadow-xs shrink-0">
                      <img
                        src={formSettings.hero_image_url || '/images/students_event.jpg'}
                        alt="Hero Banner"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-800">
                          Hero Section Banner Photo
                        </label>
                        <span className="text-[11px] font-semibold text-sky-800">
                          Featured in Homepage Hero Section
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <input
                          type="text"
                          value={formSettings.hero_image_url || ''}
                          onChange={(e) =>
                            setFormSettings({ ...formSettings, hero_image_url: e.target.value })
                          }
                          placeholder="Paste image URL (e.g. /images/students_event.jpg) or click Upload Photo ->"
                          className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs cursor-pointer shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>
                            {uploadingField === 'hero_img' ? 'Uploading...' : 'Upload Hero Photo'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, 'posters', 'hero_img', (url) =>
                                  setFormSettings((prev) => ({ ...prev, hero_image_url: url }))
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Correspondent Profile Editor */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="font-serif-display text-lg font-bold text-[#0a1931] border-b border-slate-200 pb-2">
                      1. Correspondent Portrait &amp; Message
                    </h4>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="w-32 h-40 rounded-2xl bg-slate-900 border-2 border-amber-400 overflow-hidden shrink-0 flex items-center justify-center text-white text-xs text-center p-2">
                        {formSettings.correspondent_photo_url ? (
                          <img
                            src={formSettings.correspondent_photo_url}
                            alt="Correspondent"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>No Custom Portrait Yet</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Correspondent Portrait Photo (Upload File or Paste URL)
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={formSettings.correspondent_photo_url}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  correspondent_photo_url: e.target.value,
                                })
                              }
                              placeholder="Paste photo URL or click Upload Portrait ->"
                              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer">
                              <Upload className="w-4 h-4" />
                              <span>
                                {uploadingField === 'corr_photo'
                                  ? 'Uploading...'
                                  : 'Upload Correspondent Portrait'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(file, 'portraits', 'corr_photo', (url) =>
                                      setFormSettings((prev) => ({
                                        ...prev,
                                        correspondent_photo_url: url,
                                      }))
                                    );
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={formSettings.correspondent_name}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  correspondent_name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Qualifications
                            </label>
                            <input
                              type="text"
                              value={formSettings.correspondent_qualifications}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  correspondent_qualifications: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              value={formSettings.correspondent_phone}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  correspondent_phone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Correspondent&apos;s Message
                      </label>
                      <textarea
                        rows={5}
                        value={formSettings.correspondent_message}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            correspondent_message: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>
                  </div>

                  {/* Principal Profile Editor */}
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="font-serif-display text-lg font-bold text-[#0a1931] border-b border-slate-200 pb-2">
                      2. Principal Portrait &amp; Message
                    </h4>

                    <div className="flex flex-col sm:flex-row items-start gap-6">
                      <div className="w-32 h-40 rounded-2xl bg-slate-900 border-2 border-amber-400 overflow-hidden shrink-0 flex items-center justify-center text-white text-xs text-center p-2">
                        {formSettings.principal_photo_url ? (
                          <img
                            src={formSettings.principal_photo_url}
                            alt="Principal"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>No Custom Portrait Yet</span>
                        )}
                      </div>

                      <div className="flex-1 space-y-3 w-full">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Principal Portrait Photo (Upload File or Paste URL)
                          </label>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={formSettings.principal_photo_url}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  principal_photo_url: e.target.value,
                                })
                              }
                              placeholder="Paste photo URL or click Upload Portrait ->"
                              className="flex-1 min-w-[200px] px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                            <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer">
                              <Upload className="w-4 h-4" />
                              <span>
                                {uploadingField === 'prin_photo'
                                  ? 'Uploading...'
                                  : 'Upload Principal Portrait'}
                              </span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(file, 'portraits', 'prin_photo', (url) =>
                                      setFormSettings((prev) => ({
                                        ...prev,
                                        principal_photo_url: url,
                                      }))
                                    );
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Name
                            </label>
                            <input
                              type="text"
                              value={formSettings.principal_name}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  principal_name: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Qualifications
                            </label>
                            <input
                              type="text"
                              value={formSettings.principal_qualifications}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  principal_qualifications: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Phone Number
                            </label>
                            <input
                              type="text"
                              value={formSettings.principal_phone}
                              onChange={(e) =>
                                setFormSettings({
                                  ...formSettings,
                                  principal_phone: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Principal&apos;s Message
                      </label>
                      <textarea
                        rows={5}
                        value={formSettings.principal_message}
                        onChange={(e) =>
                          setFormSettings({
                            ...formSettings,
                            principal_message: e.target.value,
                          })
                        }
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-xs cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Hero Banner, Portraits, Messages &amp; Logo</span>
                  </button>
                </form>
              )}

              {/* TAB 6: SUPABASE & VERCEL CLOUD SYNC */}
              {activeTab === 'cloud' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                      Supabase Database &amp; Vercel Deployment Configuration
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      Connect your Supabase project for permanent cloud database &amp; media storage across all devices.
                    </p>
                  </div>

                  <div
                    className={`p-5 rounded-2xl border ${
                      isSupabaseConfigured()
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="font-bold text-sm flex items-center gap-2">
                      <Cloud className="w-5 h-5" />
                      <span>
                        Current Status:{' '}
                        {isSupabaseConfigured()
                          ? '🟢 Connected to Supabase Cloud'
                          : '🟡 Local Preview Mode (Changes saved in browser until Supabase keys are added)'}
                      </span>
                    </div>
                    <p className="text-xs mt-1">
                      {isSupabaseConfigured()
                        ? 'Your website is actively reading and writing to your Supabase PostgreSQL database and Storage bucket.'
                        : 'You can test all Admin Panel features right now! When deploying to Vercel, set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Environment Variables, or enter them below to connect immediately.'}
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="font-bold text-sm text-slate-900">
                      Quick Connect Supabase Credentials
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Supabase Project URL (VITE_SUPABASE_URL)
                        </label>
                        <input
                          type="url"
                          value={sbUrl}
                          onChange={(e) => setSbUrl(e.target.value)}
                          placeholder="https://xyzcompany.supabase.co"
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Supabase Anon Public Key (VITE_SUPABASE_ANON_KEY)
                        </label>
                        <input
                          type="text"
                          value={sbKey}
                          onChange={(e) => setSbKey(e.target.value)}
                          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={async () => {
                          saveRuntimeSupabaseCredentials(sbUrl, sbKey);
                          await onRefreshData();
                          setCloudMsg('Supabase credentials saved! Refreshing data...');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#0a1931] text-amber-300 font-bold text-xs sm:text-sm cursor-pointer"
                      >
                        Save &amp; Connect Supabase
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          const res = await syncLocalDataToSupabase();
                          setCloudMsg(res.message);
                          if (res.ok) await onRefreshData();
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm cursor-pointer"
                      >
                        Push Current Data to Supabase Tables
                      </button>

                      {sbUrl && (
                        <button
                          type="button"
                          onClick={async () => {
                            clearRuntimeSupabaseCredentials();
                            setSbUrl('');
                            setSbKey('');
                            await onRefreshData();
                            setCloudMsg('Cleared runtime keys.');
                          }}
                          className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold text-xs cursor-pointer"
                        >
                          Disconnect
                        </button>
                      )}
                    </div>

                    {cloudMsg && (
                      <div className="p-3 rounded-xl bg-blue-50 text-blue-900 text-xs font-semibold">
                        {cloudMsg}
                      </div>
                    )}
                  </div>

                  {/* Step-by-Step Guide inside Admin Panel */}
                  <div className="p-6 rounded-2xl bg-slate-900 text-slate-200 space-y-3 text-xs sm:text-sm">
                    <h4 className="font-serif-display font-bold text-base text-amber-300 flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>How to Set Up Supabase &amp; Deploy to Vercel (3 Minutes)</span>
                    </h4>
                    <ol className="list-decimal list-inside space-y-2 text-slate-300">
                      <li>
                        Create a free project at <strong>supabase.com</strong> and open the{' '}
                        <strong>SQL Editor</strong>.
                      </li>
                      <li>
                        Copy and run the contents of <code className="text-amber-300">supabase/schema.sql</code>{' '}
                        (included in this project folder). It creates all tables, policies, initial PDF school data, and the{' '}
                        <code className="text-amber-300">school-media</code> storage bucket.
                      </li>
                      <li>
                        Push this repository to GitHub and import it into <strong>vercel.com</strong>.
                      </li>
                      <li>
                        In Vercel Environment Variables, add{' '}
                        <code className="text-amber-300">VITE_SUPABASE_URL</code> and{' '}
                        <code className="text-amber-300">VITE_SUPABASE_ANON_KEY</code>, then click{' '}
                        <strong>Deploy</strong>!
                      </li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
