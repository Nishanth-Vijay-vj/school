import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Award,
  CheckCircle2,
  Sparkles,
  MapPin,
  Phone,
  ShieldCheck,
  Compass,
  Target,
  Building2,
  FlaskConical,
  Monitor,
  Tv,
  Calculator,
  Trophy,
  Gamepad2,
  Droplets,
  Music,
  Bus,
  HeartPulse,
  Users,
  Calendar,
  FileCheck2,
  ArrowRight,
  Play,
  Shield,
  MessageCircle,
} from 'lucide-react';
import {
  SchoolSettings,
  SchoolEvent,
  TickerItem,
  NoticeItem,
  GalleryItem,
  AdmissionEnquiry,
} from './types/school';
import {
  DEFAULT_SETTINGS,
  DEFAULT_TICKER_ITEMS,
  DEFAULT_NOTICES,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_ENQUIRIES,
  DEFAULT_EVENTS,
  ABOUT_SCHOOL_PARAGRAPHS,
  SCHOOL_VISION,
  SCHOOL_MISSION_POINTS,
  ACADEMIC_OVERVIEW,
  HIGHER_SECONDARY_GROUPS,
  SCHOOL_FACILITIES,
  STUDENT_ACTIVITIES_LIST,
  EVENTS_AND_ACTIVITIES_CATEGORIES,
  ADMISSION_DETAILS,
} from './data/schoolData';
import {
  fetchAllSchoolData,
  updateSchoolSettings,
  addOrUpdateTickerItem,
  deleteTickerItemById,
  addOrUpdateNotice,
  deleteNoticeById,
  addOrUpdateGalleryItem,
  deleteGalleryItemById,
  addOrUpdateEvent,
  deleteEventById,
  submitAdmissionEnquiry,
  updateEnquiryStatusById,
  deleteEnquiryById,
  checkSupabaseHealth,
  SupabaseHealthStatus,
} from './lib/supabase';
import { HeaderAndTicker } from './components/HeaderAndTicker';
import { AdmissionPopupModal } from './components/AdmissionPopupModal';
import { LeadershipSection } from './components/LeadershipSection';
import { GallerySection } from './components/GallerySection';
import { NoticeBoardSection } from './components/NoticeBoardSection';
import { AdminDashboardModal } from './components/AdminDashboardModal';

const FacilityIcon: React.FC<{ name: string }> = ({ name }) => {
  const props = { className: 'w-6 h-6 text-amber-500' };
  switch (name) {
    case 'Building2':
      return <Building2 {...props} />;
    case 'FlaskConical':
      return <FlaskConical {...props} />;
    case 'Monitor':
      return <Monitor {...props} />;
    case 'Tv':
      return <Tv {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Calculator':
      return <Calculator {...props} />;
    case 'Trophy':
      return <Trophy {...props} />;
    case 'Gamepad2':
      return <Gamepad2 {...props} />;
    case 'Droplets':
      return <Droplets {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'ShieldCheck':
      return <ShieldCheck {...props} />;
    case 'Music':
      return <Music {...props} />;
    case 'Bus':
      return <Bus {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    default:
      return <Users {...props} />;
  }
};

export function App() {
  const [settings, setSettings] = useState<SchoolSettings>(DEFAULT_SETTINGS);
  const [tickerItems, setTickerItems] = useState<TickerItem[]>(DEFAULT_TICKER_ITEMS);
  const [notices, setNotices] = useState<NoticeItem[]>(DEFAULT_NOTICES);
  const [events, setEvents] = useState<SchoolEvent[]>(DEFAULT_EVENTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(DEFAULT_GALLERY_ITEMS);
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(DEFAULT_ENQUIRIES);

  // Modals state
  const [admissionPopupOpen, setAdmissionPopupOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<
    'ticker' | 'popup' | 'notices' | 'events' | 'gallery' | 'leadership' | 'cloud'
  >('popup');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem('uma_admin_logged_in') === 'true';
  });
  const [dbHealth, setDbHealth] = useState<SupabaseHealthStatus | null>(null);

  const loadData = async () => {
    const data = await fetchAllSchoolData();
    setSettings(data.settings);
    setTickerItems(data.tickerItems);
    setNotices(data.notices);
    if (data.events) {
      setEvents(data.events);
    }
    setGallery(data.gallery);
    setEnquiries(data.enquiries);
    if (data.connectionStatus) {
      setDbHealth({
        status: data.connectionStatus,
        message:
          data.errorMessage ||
          (data.source === 'supabase'
            ? 'Connected to Supabase PostgreSQL database'
            : 'Supabase unreachable or not configured'),
        checkedAt: new Date().toISOString(),
      });
    }
    return data;
  };

  useEffect(() => {
    loadData().then((data) => {
      // Automatically show the admission form popup whenever opening the website if enabled by Admin
      if (data.settings.popup_enabled) {
        const timer = setTimeout(() => {
          setAdmissionPopupOpen(true);
        }, 450);
        return () => clearTimeout(timer);
      }
    });
  }, []);

  const openAdminAtTab = (
    tab: 'ticker' | 'popup' | 'notices' | 'events' | 'gallery' | 'leadership' | 'cloud'
  ) => {
    setAdminTab(tab);
    setAdminModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Sticky School Header + Title Card + Scrolling Important News Ticker */}
      <HeaderAndTicker
        settings={settings}
        tickerItems={tickerItems}
        enquiryCount={enquiries.length}
        onOpenAdmissionModal={() => setAdmissionPopupOpen(true)}
        onOpenAdminModal={() => openAdminAtTab('popup')}
        onOpenAdminEnquiries={() => openAdminAtTab('popup')}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* 2. Mild, Welcoming Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50/90 via-white to-blue-50/60 text-slate-900 border-b border-slate-200/80 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-900 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-sky-700" />
                <span>{settings.popup_badge || 'Admissions Open 2026–2027'}</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.15] tracking-tight">
                Nurturing Knowledge, Character, Confidence &amp;{' '}
                <span className="text-sky-700">Excellence</span>
              </h2>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                Welcome to <strong className="text-slate-800">{settings.school_name}</strong>, located at{' '}
                <strong className="text-slate-800">Alwarcoil, Kanyakumari District, Tamil Nadu</strong>. We provide a safe,
                caring, and inspiring learning environment from Primary to Higher Secondary levels.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <button
                  onClick={() => setAdmissionPopupOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm sm:text-base shadow-sm transition-all cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>Apply for Admission</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href="#gallery"
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-sm sm:text-base shadow-2xs transition-all"
                >
                  <Play className="w-4 h-4 text-sky-700 fill-sky-700" />
                  <span>Photo &amp; Video Gallery</span>
                </a>
              </div>

              {/* Key Institutional Stats Bar */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-800 font-serif-display">
                    Primary – +2
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Complete K-12 Matriculation</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-800 font-serif-display">
                    3 Groups
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Maths-CS, Maths-Bio, CS-Bio</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-800 font-serif-display">
                    15+
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Modern Campus Facilities</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-sky-800 font-serif-display">
                    100%
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Holistic Value Education</div>
                </div>
              </div>
            </div>

            {/* Hero Right Emblem & Vijaya Dasami Spotlight Card */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-lg relative">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-full bg-sky-50 p-1 ring-2 ring-sky-200 shadow-xs shrink-0">
                    <img
                      src={settings.logo_url || '/logo.png'}
                      alt={settings.school_name}
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-sky-700">
                      {settings.school_motto}
                    </span>
                    <h3 className="font-serif-display text-lg font-bold text-slate-900 leading-snug">
                      {settings.school_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Alwarcoil, Neyyoor Post, Kanyakumari District – 629802
                    </p>
                  </div>
                </div>

                {/* Hero Banner Photo (Modifiable by Admin) */}
                <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 relative group shadow-2xs">
                  <img
                    src={settings.hero_image_url || '/images/students_event.jpg'}
                    alt="Campus Life at UMA Matric Higher Secondary School"
                    className="w-full h-44 object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end justify-between p-3 text-white">
                    <span className="text-[11px] font-bold tracking-wide">
                      Campus Life &amp; Student Excellence
                    </span>
                    <button
                      onClick={() => openAdminAtTab('leadership')}
                      className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-sky-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                      title="Admin: Change Hero Picture"
                    >
                      Update Picture
                    </button>
                  </div>
                </div>

                <div className="py-4 space-y-3.5">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-900 text-xs font-bold">
                    <Calendar className="w-3.5 h-3.5 text-sky-700" />
                    <span>{settings.popup_title}</span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {settings.popup_subtitle}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="font-bold text-sky-800">Correspondent</div>
                      <div className="text-slate-800 font-semibold mt-0.5">
                        {settings.correspondent_name}
                      </div>
                      <a
                        href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
                        className="text-sky-700 font-bold mt-1 inline-block"
                      >
                        📞 {settings.correspondent_phone}
                      </a>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="font-bold text-teal-800">Principal</div>
                      <div className="text-slate-800 font-semibold mt-0.5">
                        {settings.principal_name}
                      </div>
                      <a
                        href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}
                        className="text-sky-700 font-bold mt-1 inline-block"
                      >
                        📞 {settings.principal_phone}
                      </a>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setAdmissionPopupOpen(true)}
                  className="w-full py-3 px-6 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
                >
                  Open Online Admission Form →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Our School, Vision & Mission Section (PDF Pages 1, 2, 3) */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: About Our School */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold uppercase tracking-widest">
                <BookOpen className="w-4 h-4 text-blue-700" />
                <span>About Our Institution</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                Committed to Holistic Education &amp; Responsible Citizenship
              </h2>

              <div className="space-y-4 text-slate-700 text-base leading-relaxed">
                {ABOUT_SCHOOL_PARAGRAPHS.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0a1931] to-[#16325e] text-white shadow-lg border-l-4 border-amber-400">
                <p className="font-serif-display italic text-base sm:text-lg text-amber-200">
                  &ldquo;At UMA Matric Higher Secondary School, we envision an educational journey
                  where every student is inspired to learn, achieve, lead and make a positive
                  difference in society.&rdquo;
                </p>
              </div>
            </div>

            {/* Right Column: Our Vision & Our Mission */}
            <div className="lg:col-span-6 space-y-6">
              {/* Vision Card */}
              <div className="p-7 sm:p-8 rounded-3xl bg-amber-50 border border-amber-200/80 shadow-md">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-extrabold text-slate-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-slate-800 text-base leading-relaxed font-medium">
                  {SCHOOL_VISION}
                </p>
              </div>

              {/* Mission Card */}
              <div className="p-7 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow">
                    <Target className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-display text-2xl font-extrabold text-white">
                    Our Mission
                  </h3>
                </div>
                <ul className="space-y-3">
                  {SCHOOL_MISSION_POINTS.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership Messages & Portraits (Correspondent & Principal) */}
      <LeadershipSection
        settings={settings}
        onEditInAdmin={() => openAdminAtTab('leadership')}
      />

      {/* 5. Digital Notice Board & News Announcements (PDF Page 8) */}
      <NoticeBoardSection
        notices={notices}
        onOpenAdminNotices={() => openAdminAtTab('notices')}
        onOpenAdmissionModal={() => setAdmissionPopupOpen(true)}
      />

      {/* 6. Academic Information, Highlights & Higher Secondary Departments (PDF Pages 3 & 4) */}
      <section id="academics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs font-extrabold uppercase tracking-widest mb-3">
              <GraduationCap className="w-4 h-4 text-blue-700" />
              <span>Structured Child-Centred Curriculum</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Academic Programme &amp; Departments
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg">
              {ACADEMIC_OVERVIEW.programme}
            </p>
          </div>

          {/* 10 Academic Highlights Grid */}
          <div className="mb-16 bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
            <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
              <Award className="w-6 h-6 text-amber-600" />
              <span>Key Academic Highlights</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACADEMIC_OVERVIEW.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0a1931] text-amber-300 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-800 font-medium text-sm sm:text-base">{item}</span>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm sm:text-base font-bold text-[#0a1931] bg-amber-100/70 py-3 px-4 rounded-xl">
              {ACADEMIC_OVERVIEW.aim}
            </p>
          </div>

          {/* Higher Secondary (+1 & +2) Academic Groups */}
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-widest text-amber-600">
                Higher Secondary Section (Std XI &amp; XII)
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Higher Secondary Departments &amp; Academic Groups
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                Our Higher Secondary section offers the following specialized academic groups:
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {HIGHER_SECONDARY_GROUPS.map((grp) => (
                <div
                  key={grp.number}
                  className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform"
                >
                  <div>
                    <div className={`bg-gradient-to-r ${grp.color} text-white p-6`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-extrabold uppercase tracking-wider">
                          Group {grp.number}
                        </span>
                        <GraduationCap className="w-6 h-6 text-amber-300" />
                      </div>
                      <h4 className="font-serif-display text-2xl font-extrabold text-white">
                        {grp.title}
                      </h4>
                      <p className="text-xs text-white/90 font-medium mt-1">{grp.code}</p>
                    </div>

                    <div className="p-6 space-y-4">
                      <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                        {grp.description}
                      </p>
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                          Future Pathways
                        </div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">
                          {grp.careerPaths}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6">
                    <button
                      onClick={() => setAdmissionPopupOpen(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-950 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      Enquire for {grp.title} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. School Facilities Section (PDF Page 4) */}
      <section id="facilities" className="py-20 bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-widest mb-3">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>Supportive &amp; Student-Friendly Campus</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              World-Class School Facilities
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg">
              UMA Matric Higher Secondary School provides a supportive and student-friendly environment with facilities designed to promote effective learning and the overall development of students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SCHOOL_FACILITIES.map((fac, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#0a1931] flex items-center justify-center shrink-0 shadow">
                  <FacilityIcon name={fac.icon} />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-lg text-slate-900">
                    {fac.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    {fac.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Students' Activities, Achievements & Annual Events (PDF Pages 4, 5, 6) */}
      <section id="activities" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-extrabold uppercase tracking-widest mb-3">
              <Trophy className="w-4 h-4 text-emerald-700" />
              <span>Beyond the Classroom</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Students&apos; Activities, Events &amp; Achievements
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg">
              At UMA Matric Higher Secondary School, students are encouraged to participate actively in academic, co-curricular, cultural, sports and social activities to develop confidence, creativity, leadership skills, and teamwork.
            </p>
          </div>

          {/* 4 Event & Activity Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* School Events */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-3">
                School Events
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {EVENTS_AND_ACTIVITIES_CATEGORIES.schoolEvents.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Co-Curricular Activities */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold mb-4">
                <Music className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-3">
                Co-Curricular Activities
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {EVENTS_AND_ACTIVITIES_CATEGORIES.coCurricular.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sports & Physical Activities */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-3">
                Sports &amp; Physical Activities
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {EVENTS_AND_ACTIVITIES_CATEGORIES.sportsAndPhysical.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Educational Activities */}
            <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-serif-display text-xl font-bold text-slate-900 mb-3">
                Educational Activities
              </h3>
              <ul className="space-y-2 text-sm text-slate-700">
                {EVENTS_AND_ACTIVITIES_CATEGORIES.educationalActivities.map((ev, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                    <span>{ev}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dynamic School Events Showcase with Real Event Images & Admin Controls */}
          <div className="mb-14">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                  Campus Life in Action
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  School Events &amp; Celebrations
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
                  Glimpses of vibrant school events, academic toppers celebrations, student assemblies, and cultural festivals.
                </p>
              </div>

              <button
                onClick={() => openAdminAtTab('events')}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Admin: Add / Manage Events</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div className="relative h-52 bg-slate-900 overflow-hidden">
                    <img
                      src={ev.image_url || '/images/students_event.jpg'}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-sky-800/90 text-white text-[11px] font-bold uppercase tracking-wider backdrop-blur-xs">
                      {ev.category}
                    </span>
                    <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-semibold backdrop-blur-xs flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-300" />
                      <span>{ev.date}</span>
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif-display font-bold text-slate-900 text-lg leading-snug group-hover:text-sky-800 transition-colors">
                        {ev.title}
                      </h4>
                      {ev.location && (
                        <div className="flex items-center gap-1.5 text-xs text-sky-700 font-semibold mt-1.5">
                          <MapPin className="w-3.5 h-3.5 shrink-0" />
                          <span>{ev.location}</span>
                        </div>
                      )}
                      <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed line-clamp-3">
                        {ev.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => setAdmissionPopupOpen(true)}
                        className="text-xs font-bold text-sky-700 hover:text-sky-900 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Learn More / Enquire</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => openAdminAtTab('events')}
                        className="text-[11px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
                      >
                        Admin Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Achievements Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-slate-800 to-sky-900 text-white p-8 sm:p-10 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <span className="px-3 py-1 rounded-full bg-sky-200 text-sky-950 text-xs font-extrabold uppercase tracking-wider">
                Students&apos; Achievements
              </span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                Recognised at School, Inter-School, District &amp; State Levels
              </h3>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Our students are encouraged to participate in various competitions and events at the school, inter-school, district and state levels. Their achievements in academics, sports, cultural activities and various competitions are recognised and celebrated by the school. We take pride in nurturing students who strive for excellence, discipline, creativity and responsible citizenship.
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {STUDENT_ACTIVITIES_LIST.slice(0, 6).map((act, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-amber-200"
                  >
                    ✓ {act}
                  </span>
                ))}
              </div>
            </div>

            <a
              href="#gallery"
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all"
            >
              View Achievements Gallery →
            </a>
          </div>
        </div>
      </section>

      {/* 9. Photo & Video Gallery Section */}
      <GallerySection
        galleryItems={gallery}
        onOpenAdminGallery={() => openAdminAtTab('gallery')}
      />

      {/* 10. Admission Details, Process & Documents Required (PDF Pages 6 & 7) */}
      <section id="admissions" className="py-20 bg-gradient-to-b from-amber-50/60 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-widest mb-3 shadow-xs">
              <Sparkles className="w-4 h-4" />
              <span>Admissions Open • Enrol Today</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Admission Details &amp; Procedure
            </h2>
            <p className="mt-3 text-slate-600 text-base sm:text-lg">
              {ADMISSION_DETAILS.intro}
            </p>
          </div>

          {/* Classes Offered Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
            {ADMISSION_DETAILS.classesOffered.map((cls, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200/80 hover:border-amber-400 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#0a1931] text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-3">
                    {cls.badge}
                  </span>
                  <h3 className="font-serif-display text-xl font-bold text-slate-900">
                    {cls.level}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    {cls.subtitle}
                  </p>
                </div>
                <button
                  onClick={() => setAdmissionPopupOpen(true)}
                  className="mt-5 text-left text-xs font-extrabold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Apply for {cls.level}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Admission Process & Documents Required */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 5-Step Admission Process */}
            <div className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200 shadow-lg">
              <h3 className="font-serif-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0a1931] text-amber-400 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span>Step-by-Step Admission Process</span>
              </h3>

              <div className="space-y-4">
                {ADMISSION_DETAILS.processSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shrink-0 mt-0.5 shadow">
                      {idx + 1}
                    </div>
                    <p className="text-slate-700 text-sm sm:text-base pt-1">{step}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setAdmissionPopupOpen(true)}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#0a1931] hover:bg-[#132d59] text-amber-300 font-bold text-sm shadow-lg transition-all cursor-pointer"
                >
                  Fill Online Admission Enquiry Form
                </button>
              </div>
            </div>

            {/* Documents Required Checklist */}
            <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-9 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <FileCheck2 className="w-5 h-5" />
                  </div>
                  <span>Documents Required</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mb-6">
                  Parents may be requested to submit the following documents at the time of admission:
                </p>

                <ul className="space-y-3">
                  {ADMISSION_DETAILS.documentsRequired.map((doc, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-slate-100"
                    >
                      <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-xs sm:text-sm text-amber-200 leading-relaxed">
                <strong>Note for Parents:</strong> {ADMISSION_DETAILS.parentNote}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Contact Us & Location Section (PDF Pages 7 & 8) */}
      <section id="contact" className="py-20 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Contact Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">
                  Get in Touch With Us
                </span>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-white mt-1">
                  Contact Information
                </h2>
                <p className="text-slate-300 text-sm mt-2">
                  For admissions, enquiries and further information, please contact the Principal or Correspondent. We look forward to welcoming your child to the UMA family!
                </p>
              </div>

              {/* Main Campus Card */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-white text-base">
                      UMA Matric Higher Secondary School
                    </h3>
                    <p className="text-sm text-slate-300 mt-0.5">
                      Alwarcoil, Neyyoor Post
                      <br />
                      Kanyakumari District, Tamil Nadu – 629802
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
                  >
                    <div className="text-[11px] font-bold uppercase text-amber-400">
                      Correspondent
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      📞 {settings.correspondent_phone}
                    </div>
                  </a>

                  <a
                    href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}
                    className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 transition-colors"
                  >
                    <div className="text-[11px] font-bold uppercase text-sky-400">Principal</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      📞 {settings.principal_phone}
                    </div>
                  </a>
                </div>
              </div>

              {/* Sister Institution Card */}
              <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-extrabold uppercase text-amber-400">
                    Sister Institution (Vijaya Dasami Admissions)
                  </div>
                  <h4 className="font-bold text-white text-sm mt-0.5">
                    UMA Kidz Global Horizon
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Madavilagam, Kandanvilai Post, Kanyakumari District, Tamil Nadu
                  </p>
                </div>
              </div>

              {/* Social Media Callout from PDF Page 8 */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-orange-500/10 border border-amber-400/30 text-xs sm:text-sm text-amber-200 italic">
                &ldquo;Follow us on social media for the latest news, announcements, events,
                achievements and activities of UMA Matric Higher Secondary School and UMA Kidz
                Global Horizon.&rdquo;
              </div>
            </div>

            {/* Map Embed Column */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
              <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Campus Location — Alwarcoil, Neyyoor Post, Kanyakumari District – 629802</span>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=UMA+Matric+Higher+Secondary+School+Alwarcoil+Neyyoor+Kanyakumari+629802"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  Open in Google Maps →
                </a>
              </div>
              <iframe
                title="UMA Matric Higher Secondary School Location Map"
                src="https://www.google.com/maps?q=Alwarcoil,Neyyoor,Kanyakumari,Tamil+Nadu+629802&output=embed"
                className="w-full h-[380px] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <img
                src={settings.logo_url || '/logo.png'}
                alt={settings.school_name}
                className="w-9 h-9 rounded-full bg-white p-0.5 object-contain"
              />
              <span>
                © {new Date().getFullYear()} <strong>{settings.school_name}</strong>, Alwarcoil,
                Kanyakumari District. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdmissionPopupOpen(true)}
                className="hover:text-amber-300 transition-colors cursor-pointer"
              >
                Admission Form
              </button>
              <span>•</span>
              <button
                onClick={() => openAdminAtTab('ticker')}
                className="hover:text-amber-300 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>School Admin Portal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Quick Action Buttons (Bottom Right) */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
        <a
          href="https://wa.me/919442941018?text=Hello%20UMA%20Matric%20Higher%20Secondary%20School%2C%20I%20would%20like%20to%20enquire%20about%20admissions."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-xl transition-transform hover:scale-105"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp Enquiry</span>
        </a>

        <button
          onClick={() => setAdmissionPopupOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-2xl border-2 border-white transition-transform hover:scale-105 cursor-pointer"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Admission Form</span>
        </button>
      </div>

      {/* Admission Popup Modal (Opens automatically on website load when enabled by Admin) */}
      <AdmissionPopupModal
        isOpen={admissionPopupOpen}
        onClose={() => setAdmissionPopupOpen(false)}
        settings={settings}
        onSubmitEnquiry={async (enquiryData) => {
          const res = await submitAdmissionEnquiry(enquiryData, enquiries);
          setEnquiries(res.data);
        }}
      />

      {/* Admin Panel Dashboard Modal */}
      <AdminDashboardModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        isLoggedIn={isAdminLoggedIn}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          sessionStorage.setItem('uma_admin_logged_in', 'true');
        }}
        onLogout={() => {
          setIsAdminLoggedIn(false);
          sessionStorage.removeItem('uma_admin_logged_in');
        }}
        initialTab={adminTab}
        settings={settings}
        tickerItems={tickerItems}
        notices={notices}
        events={events}
        gallery={gallery}
        enquiries={enquiries}
        dbHealth={dbHealth}
        onCheckDbHealth={async () => {
          const status = await checkSupabaseHealth();
          setDbHealth(status);
          return status;
        }}
        onSaveSettings={async (newSettings) => {
          const res = await updateSchoolSettings(newSettings);
          setSettings(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onSaveTicker={async (item) => {
          const res = await addOrUpdateTickerItem(item, tickerItems);
          setTickerItems(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onDeleteTicker={async (id) => {
          const res = await deleteTickerItemById(id, tickerItems);
          setTickerItems(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onSaveNotice={async (notice) => {
          const res = await addOrUpdateNotice(notice, notices);
          setNotices(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onDeleteNotice={async (id) => {
          const res = await deleteNoticeById(id, notices);
          setNotices(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onSaveEvent={async (event) => {
          const res = await addOrUpdateEvent(event, events);
          setEvents(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onDeleteEvent={async (id) => {
          const res = await deleteEventById(id, events);
          setEvents(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onSaveGallery={async (item) => {
          const res = await addOrUpdateGalleryItem(item, gallery);
          setGallery(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onDeleteGallery={async (id) => {
          const res = await deleteGalleryItemById(id, gallery);
          setGallery(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onUpdateEnquiryStatus={async (id, status) => {
          const res = await updateEnquiryStatusById(id, status, enquiries);
          setEnquiries(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onDeleteEnquiry={async (id) => {
          const res = await deleteEnquiryById(id, enquiries);
          setEnquiries(res.data);
          return { syncedToSupabase: res.syncedToSupabase, error: res.error };
        }}
        onRefreshData={async () => {
          await loadData();
        }}
      />
    </div>
  );
}

export default App;
