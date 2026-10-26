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
  ChevronLeft,
  ChevronRight,
  Megaphone,
  FileText,
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

  // Active Page / Section Routing State (Mirroring Rojavanam's modular section architecture)
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const raw = window.location.hash.replace('#', '').trim().toLowerCase();
      if (!raw || raw === 'home') {
        setActiveSection('home');
        return;
      }
      const validSections = [
        'home',
        'about',
        'leadership',
        'academics',
        'facilities',
        'activities',
        'events',
        'gallery',
        'notices',
        'admissions',
        'contact',
      ];
      if (validSections.includes(raw)) {
        setActiveSection(raw === 'events' ? 'activities' : raw);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (sec: string) => {
    const raw = sec.replace('#', '').trim().toLowerCase();
    const normalized = raw === 'events' ? 'activities' : raw;
    setActiveSection(normalized);
    window.location.hash = normalized === 'home' ? '' : `#${normalized}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Rojavanam-style Hero Media Slider State
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      id: 1,
      image: settings.hero_image_url || '/images/students_event.jpg',
      badge: settings.popup_badge || 'ADMISSIONS OPEN 2026–2027',
      kicker: 'WELCOME TO',
      title: 'Empowering Young Minds with Knowledge, Values & Excellence',
      subtitle: `Welcome to ${settings.school_name}, Alwarcoil, Kanyakumari District. A Centre for Excellence offering child-centred education from Primary to Higher Secondary.`,
      primaryBtnText: 'Apply for Admission',
      primaryAction: () => setAdmissionPopupOpen(true),
      secondaryBtnText: 'Discover About Us',
      secondaryAction: () => navigateTo('about'),
    },
    {
      id: 2,
      image: '/images/sslc_toppers_poster.jpg',
      badge: 'SSLC 2025–2026 TOPPERS & DISTINCTIONS',
      kicker: 'ACADEMIC EXCELLENCE',
      title: 'Hearty Congratulations to our SSLC Board Exam Toppers!',
      subtitle: 'Celebrating our outstanding 100% board pass track record, nurturing academic rigor and career readiness in science & computer streams.',
      primaryBtnText: 'Academic Groups (+1 & +2)',
      primaryAction: () => navigateTo('academics'),
      secondaryBtnText: 'Photo & Video Gallery',
      secondaryAction: () => navigateTo('gallery'),
    },
    {
      id: 3,
      image: settings.popup_banner_url || '/images/students_event.jpg',
      badge: 'VIJAYA DASAMI SPECIAL ADMISSIONS',
      kicker: 'SPECIAL ANNOUNCEMENT',
      title: 'Admissions Open for Primary, High & Higher Secondary Classes',
      subtitle: 'Mathematics – Computer Science | Mathematics – Biology | Computer Science – Biology. Experience state-of-the-art labs and dedicated coaching.',
      primaryBtnText: 'Online Admission Form',
      primaryAction: () => setAdmissionPopupOpen(true),
      secondaryBtnText: 'Campus Facilities',
      secondaryAction: () => navigateTo('facilities'),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Section Navigation Buttons (Connected to respective sections & Supabase data tables)
  const sectionJumpItems = [
    {
      id: 'about',
      label: 'About Our School',
      desc: 'Legacy, Vision & Mission',
      icon: BookOpen,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      action: () => navigateTo('about'),
      tag: 'Overview',
    },
    {
      id: 'leadership',
      label: 'Leadership Desk',
      desc: 'Correspondent & Principal',
      icon: Users,
      iconColor: 'text-teal-600 bg-teal-50 border-teal-200',
      action: () => navigateTo('leadership'),
      tag: 'Management',
    },
    {
      id: 'academics',
      label: 'Academics (+1 / +2)',
      desc: 'Maths-CS, Bio, CS-Bio',
      icon: GraduationCap,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      action: () => navigateTo('academics'),
      tag: '3 Streams',
    },
    {
      id: 'facilities',
      label: 'Campus Facilities',
      desc: 'Smart Labs, Sports & Library',
      icon: Building2,
      iconColor: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      action: () => navigateTo('facilities'),
      tag: '15+ Modern',
    },
    {
      id: 'activities',
      label: 'Events & Activities',
      desc: 'Silambam, Yoga, Karate & Clubs',
      icon: Trophy,
      iconColor: 'text-orange-600 bg-orange-50 border-orange-200',
      action: () => navigateTo('activities'),
      tag: `${events.length} Events`,
    },
    {
      id: 'gallery',
      label: 'Photo & Video Gallery',
      desc: 'Campus Life & Celebrations',
      icon: Play,
      iconColor: 'text-rose-600 bg-rose-50 border-rose-200',
      action: () => navigateTo('gallery'),
      tag: `${gallery.length} Media`,
    },
    {
      id: 'notices',
      label: 'Digital Notice Board',
      desc: 'Official School Circulars',
      icon: Megaphone,
      iconColor: 'text-sky-600 bg-sky-50 border-sky-200',
      action: () => navigateTo('notices'),
      tag: `${notices.length} Notices`,
    },
    {
      id: 'admissions',
      label: 'Online Admissions',
      desc: 'Apply for 2026–2027',
      icon: FileText,
      iconColor: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      action: () => navigateTo('admissions'),
      tag: 'Enrol Now',
    },
  ];

  const sectionMeta: Record<string, { title: string; subtitle: string }> = {
    about: {
      title: 'About Our Institution',
      subtitle: 'Legacy, foundational educational ethos, and holistic vision since 1990',
    },
    leadership: {
      title: 'School Leadership & Management',
      subtitle: 'Visionary guidance and messages from our Correspondent and Principal',
    },
    academics: {
      title: 'Academic Programme & Higher Secondary Streams',
      subtitle: 'Tamil & English medium curriculum, specialized +1 & +2 groups, and modern teaching aids',
    },
    facilities: {
      title: 'Campus Infrastructure & Facilities',
      subtitle: 'State-of-the-art science laboratories, computer centre, library, transport, and playgrounds',
    },
    activities: {
      title: "Students' Activities, Events & Achievements",
      subtitle: 'Co-curricular clubs, annual celebrations, sports meets, and district-level distinctions',
    },
    gallery: {
      title: 'Photo & Video Gallery',
      subtitle: 'Vibrant glimpses of campus celebrations, academic events, classroom learning, and video features',
    },
    notices: {
      title: 'Digital Notice Board & Circulars',
      subtitle: 'Official announcements, academic calendars, holiday circulars, and exam notifications',
    },
    admissions: {
      title: 'Online Admissions 2026–2027',
      subtitle: 'Eligibility criteria, admission procedure, required documents, and online enquiry application',
    },
    contact: {
      title: 'Contact Information & Campus Map',
      subtitle: 'Direct telephone contacts, official campus location in Alwarcoil, and enquiry desk',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Sticky School Header + Title Card + Scrolling Important News Ticker */}
      <HeaderAndTicker
        settings={settings}
        tickerItems={tickerItems}
        enquiryCount={enquiries.length}
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenAdmissionModal={() => setAdmissionPopupOpen(true)}
        onOpenAdminModal={() => openAdminAtTab('popup')}
        onOpenAdminEnquiries={() => openAdminAtTab('popup')}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Dedicated Section Header Banner (Rendered when viewing a specific section) */}
      {activeSection !== 'home' && (
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-10 sm:py-12 border-b border-sky-800/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 uppercase tracking-wider mb-2">
                  <button
                    onClick={() => navigateTo('home')}
                    className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <span>Home</span>
                  </button>
                  <span>/</span>
                  <span className="text-amber-300">
                    {sectionMeta[activeSection]?.title || activeSection}
                  </span>
                </div>
                <h1 className="font-serif-display text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  {sectionMeta[activeSection]?.title || activeSection}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  {sectionMeta[activeSection]?.subtitle}
                </p>
              </div>

              <button
                onClick={() => navigateTo('home')}
                className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 backdrop-blur-sm transition-colors cursor-pointer"
              >
                <span>← Back to Home</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Rojavanam-Style Full-Bleed Hero Media Carousel (Rendered on Home) */}
      {activeSection === 'home' && (
        <>
          <section className="relative overflow-hidden bg-slate-950 text-white min-h-[540px] sm:min-h-[620px] lg:min-h-[660px] flex items-center">
          {/* Carousel Background Images with Cross-Fade */}
          <div className="absolute inset-0">
            {heroSlides.map((slide, idx) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/students_event.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/75 to-slate-900/50" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40" />
              </div>
            ))}
          </div>

          {/* Hero Slider Arrow Navigation */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer hover:scale-105"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Hero Slide Content Overlay */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-28 w-full">
            <div className="max-w-3xl space-y-5 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs font-bold tracking-wider uppercase backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{heroSlides[currentSlide].badge}</span>
              </div>

              <div className="text-sky-300 text-xs sm:text-sm font-bold tracking-widest uppercase">
                {heroSlides[currentSlide].kicker} {settings.school_name.toUpperCase()}
              </div>

              <h1 className="font-serif-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.12] tracking-tight drop-shadow-md">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-sm sm:text-lg text-slate-200 leading-relaxed max-w-2xl font-normal drop-shadow-sm">
                {heroSlides[currentSlide].subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2 sm:pt-4">
                <button
                  onClick={heroSlides[currentSlide].primaryAction}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 cursor-pointer"
                >
                  <GraduationCap className="w-5 h-5" />
                  <span>{heroSlides[currentSlide].primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={heroSlides[currentSlide].secondaryAction}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/30 backdrop-blur-md font-semibold text-sm sm:text-base transition-colors cursor-pointer"
                >
                  <span>{heroSlides[currentSlide].secondaryBtnText}</span>
                </button>

                {isAdminLoggedIn && (
                  <button
                    onClick={() => openAdminAtTab('leadership')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm border border-white/20 transition-colors cursor-pointer"
                  >
                    <span>Edit Hero Picture</span>
                  </button>
                )}
              </div>

            {/* Institutional Stats Bar (Matching Rojavanam stats) */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/15">
              <div>
                <div className="text-xl sm:text-3xl font-bold text-amber-300 font-serif-display">
                  1990+
                </div>
                <div className="text-xs text-slate-300 mt-0.5">Established Legacy</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-amber-300 font-serif-display">
                  100%
                </div>
                <div className="text-xs text-slate-300 mt-0.5">SSLC Pass Record</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-amber-300 font-serif-display">
                  3 Groups
                </div>
                <div className="text-xs text-slate-300 mt-0.5">Maths-CS, Bio, CS-Bio</div>
              </div>
              <div>
                <div className="text-xl sm:text-3xl font-bold text-amber-300 font-serif-display">
                  15+
                </div>
                <div className="text-xs text-slate-300 mt-0.5">Campus Facilities</div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Dots Indicator */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide ? 'w-8 bg-amber-400' : 'w-2.5 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        {/* Rojavanam-Style Curved Wave Bottom Separator */}
        <div className="absolute bottom-0 left-0 right-0 z-10 overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1440 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-8 sm:h-12 text-slate-50 fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C360,55 1080,55 1440,0 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* 3. Section Quick-Access Action Buttons Hub (Connected to Every Section's Data API) */}
      <section className="bg-slate-50 pt-2 pb-12 sm:pb-16 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-12 relative z-20">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 sm:p-6 shadow-xl border border-slate-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-widest">
                  Quick Navigation Hub
                </span>
                <h3 className="font-serif-display font-bold text-base sm:text-lg text-slate-900">
                  Explore UMA School Campus &amp; Portals
                </h3>
              </div>
              <button
                onClick={() => setAdmissionPopupOpen(true)}
                className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <span>Online Admission 2026–27</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {sectionJumpItems.map((item) => {
                const IconComp = item.icon;
                const cardBody = (
                  <div className="bg-slate-50/70 hover:bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center border ${item.iconColor} shadow-2xs`}>
                          <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 group-hover:bg-sky-50 group-hover:text-sky-700 transition-colors">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="font-serif-display font-bold text-xs sm:text-sm text-slate-900 group-hover:text-sky-700 transition-colors leading-snug">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {item.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-bold text-sky-700 group-hover:text-sky-800">
                      <span>View Section</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );

                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="text-left cursor-pointer h-full"
                  >
                    {cardBody}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

          {/* Concise Rojavanam-Style About Preview on Home */}
          <section id="about" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                <div className="lg:col-span-6 space-y-5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold uppercase tracking-widest">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span>About Our Institution</span>
                  </div>

                  <h2 className="font-serif-display text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                    Welcome to <span className="text-sky-700">{settings.school_name}</span>
                  </h2>

                  <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md relative group">
                    <img
                      src={settings.hero_image_url || '/images/students_event.jpg'}
                      alt="UMA School Campus"
                      className="w-full h-56 sm:h-64 object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        {settings.school_motto || 'CENTRE FOR EXCELLENCE'}
                      </span>
                      <h4 className="font-serif-display text-sm sm:text-base font-bold">
                        Inspiring Young Minds in Alwarcoil, Kanyakumari
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl font-extrabold text-sky-800 font-serif-display">1990+</b>
                      <small className="text-xs text-slate-600 font-medium">Established</small>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl font-extrabold text-sky-800 font-serif-display">1500+</b>
                      <small className="text-xs text-slate-600 font-medium">Students</small>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl font-extrabold text-sky-800 font-serif-display">40+</b>
                      <small className="text-xs text-slate-600 font-medium">Educators</small>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl font-extrabold text-sky-800 font-serif-display">100%</b>
                      <small className="text-xs text-slate-600 font-medium">SSLC Pass</small>
                    </div>
                  </div>

                  <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {ABOUT_SCHOOL_PARAGRAPHS[0]}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => navigateTo('about')}
                      className="px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors shadow-xs"
                    >
                      <span>Read Full School Story &amp; Leadership</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => navigateTo('academics')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>Explore Academics &amp; Streams</span>
                    </button>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-6">
                  {/* Vision Card */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-amber-50 border border-amber-200/80 shadow-md">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow">
                        <Compass className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif-display text-xl font-extrabold text-slate-900">
                        Our Vision
                      </h3>
                    </div>
                    <p className="text-slate-800 text-sm sm:text-base leading-relaxed font-medium">
                      {SCHOOL_VISION}
                    </p>
                  </div>

                  {/* Mission Card */}
                  <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-2xl bg-sky-500 text-slate-950 flex items-center justify-center shadow">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif-display text-xl font-extrabold text-white">
                        Our Mission
                      </h3>
                    </div>
                    <ul className="space-y-2.5">
                      {SCHOOL_MISSION_POINTS.slice(0, 3).map((point, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Quick Contacts Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sky-900">Correspondent: {settings.correspondent_name}</div>
                        <div className="text-sky-700 font-semibold">{settings.correspondent_phone}</div>
                      </div>
                      <a
                        href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
                        className="p-2 rounded-xl bg-sky-700 text-white hover:bg-sky-800 transition-colors"
                        title="Call Correspondent"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-teal-900">Principal: {settings.principal_name}</div>
                        <div className="text-teal-700 font-semibold">{settings.principal_phone}</div>
                      </div>
                      <a
                        href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}
                        className="p-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 transition-colors"
                        title="Call Principal"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Concise Highlights Grid on Home */}
          <section className="py-14 bg-slate-50 border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-700">
                  Campus Updates &amp; Highlights
                </span>
                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Latest From UMA Matric School
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Latest Notices Preview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                        <h4 className="font-serif-display font-bold text-slate-900 text-base">Digital Notice Board</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold">
                        {notices.length} Notices
                      </span>
                    </div>
                    <div className="space-y-3">
                      {notices.slice(0, 2).map((n) => (
                        <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="text-[10px] font-bold text-sky-700 uppercase">{n.category} • {n.date}</div>
                          <div className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{n.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.content}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('notices')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View All Notices &amp; Circulars</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 2. Upcoming Events Preview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-500" />
                        <h4 className="font-serif-display font-bold text-slate-900 text-base">Events &amp; Activities</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        {events.length} Events
                      </span>
                    </div>
                    <div className="space-y-3">
                      {events.slice(0, 2).map((ev) => (
                        <div key={ev.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                          <img
                            src={ev.image_url || '/images/students_event.jpg'}
                            alt={ev.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold text-amber-600">{ev.date}</div>
                            <div className="text-xs font-bold text-slate-900 truncate">{ev.title}</div>
                            <div className="text-[11px] text-slate-500 truncate">{ev.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('activities')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View All Activities &amp; Events</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3. Media Gallery Preview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Play className="w-4 h-4 text-rose-500" />
                        <h4 className="font-serif-display font-bold text-slate-900 text-base">Campus Gallery</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        {gallery.length} Media
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {gallery.slice(0, 4).map((g) => (
                        <div key={g.id} className="relative rounded-xl overflow-hidden h-16 bg-slate-100">
                          <img src={g.media_url} alt={g.title} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold uppercase">
                            {g.media_type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('gallery')}
                    className="mt-5 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Open Photo &amp; Video Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Dedicated Section View: About School */}
      {activeSection === 'about' && (
        <>
          <section id="about" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left Column: About Media Card & Quick Contact Spotlight */}
                <div className="lg:col-span-6 space-y-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-900 text-xs font-extrabold uppercase tracking-widest">
                    <BookOpen className="w-4 h-4 text-blue-700" />
                    <span>About Our Institution</span>
                  </div>

                  <h2 className="font-serif-display text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                    Welcome to <span className="text-sky-700">{settings.school_name}</span>
                  </h2>

                  {/* Rojavanam-Style About Media Card with Image & Badges */}
                  <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-md relative group">
                    <img
                      src={settings.hero_image_url || '/images/students_event.jpg'}
                      alt="UMA School Campus"
                      className="w-full h-64 sm:h-72 object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                            {settings.school_motto || 'CENTRE FOR EXCELLENCE'}
                          </span>
                          <h4 className="font-serif-display text-base sm:text-lg font-bold">
                            Inspiring Young Minds in Alwarcoil
                          </h4>
                        </div>
                        {isAdminLoggedIn && (
                          <button
                            onClick={() => openAdminAtTab('leadership')}
                            className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-sky-600 text-white backdrop-blur-xs transition-colors cursor-pointer"
                          >
                            Update Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 4 Stats Cards matching rojavanam */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl sm:text-2xl font-extrabold text-sky-800 font-serif-display">1990+</b>
                      <small className="text-xs text-slate-600 font-medium">Established</small>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl sm:text-2xl font-extrabold text-sky-800 font-serif-display">1500+</b>
                      <small className="text-xs text-slate-600 font-medium">Students</small>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl sm:text-2xl font-extrabold text-sky-800 font-serif-display">40+</b>
                      <small className="text-xs text-slate-600 font-medium">Educators</small>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                      <b className="block text-xl sm:text-2xl font-extrabold text-sky-800 font-serif-display">100%</b>
                      <small className="text-xs text-slate-600 font-medium">SSLC Pass</small>
                    </div>
                  </div>

                  <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                    {ABOUT_SCHOOL_PARAGRAPHS.map((para, idx) => (
                      <p key={idx}>{para}</p>
                    ))}
                  </div>

                  {/* Quick Contacts Bar */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-sky-900">Correspondent: {settings.correspondent_name}</div>
                        <div className="text-sky-700 font-semibold">{settings.correspondent_phone}</div>
                      </div>
                      <a
                        href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
                        className="p-2 rounded-xl bg-sky-700 text-white hover:bg-sky-800 transition-colors"
                        title="Call Correspondent"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-teal-900">Principal: {settings.principal_name}</div>
                        <div className="text-teal-700 font-semibold">{settings.principal_phone}</div>
                      </div>
                      <a
                        href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}
                        className="p-2 rounded-xl bg-teal-700 text-white hover:bg-teal-800 transition-colors"
                        title="Call Principal"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
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

          {/* Leadership Section */}
          <LeadershipSection
            settings={settings}
            onEditInAdmin={() => openAdminAtTab('leadership')}
          />
        </>
      )}

      {/* Dedicated Section View: Leadership */}
      {activeSection === 'leadership' && (
        <LeadershipSection
          settings={settings}
          onEditInAdmin={() => openAdminAtTab('leadership')}
        />
      )}

      {/* Dedicated Section View: Digital Notice Board */}
      {activeSection === 'notices' && (
        <NoticeBoardSection
          notices={notices}
          onOpenAdminNotices={() => openAdminAtTab('notices')}
          onOpenAdmissionModal={() => setAdmissionPopupOpen(true)}
        />
      )}

      {/* 6. Academic Information, Highlights & Higher Secondary Departments (PDF Pages 3 & 4) */}
      {activeSection === 'academics' && (
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
      )}

      {/* 7. School Facilities Section (PDF Page 4) */}
      {activeSection === 'facilities' && (
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
      )}

      {/* 8. Students' Activities, Achievements & Annual Events (PDF Pages 4, 5, 6) */}
      {activeSection === 'activities' && (
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

            <button
              onClick={() => navigateTo('gallery')}
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all cursor-pointer"
            >
              View Achievements Gallery →
            </button>
          </div>
        </div>
      </section>
      )}

      {/* 9. Photo & Video Gallery Section */}
      {activeSection === 'gallery' && (
        <GallerySection
          galleryItems={gallery}
          onOpenAdminGallery={() => openAdminAtTab('gallery')}
        />
      )}

      {/* 10. Admission Details, Process & Documents Required (PDF Pages 6 & 7) */}
      {activeSection === 'admissions' && (
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
      )}

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

          {/* Quick Footer Section Nav Links */}
          <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-2 text-xs text-slate-400">
            <button onClick={() => navigateTo('home')} className="hover:text-white transition-colors cursor-pointer">Home</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('about')} className="hover:text-white transition-colors cursor-pointer">About School</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('leadership')} className="hover:text-white transition-colors cursor-pointer">Leadership</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('academics')} className="hover:text-white transition-colors cursor-pointer">Academics (+1/+2)</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('facilities')} className="hover:text-white transition-colors cursor-pointer">Facilities</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('activities')} className="hover:text-white transition-colors cursor-pointer">Activities &amp; Events</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('gallery')} className="hover:text-white transition-colors cursor-pointer">Photo &amp; Video Gallery</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('notices')} className="hover:text-white transition-colors cursor-pointer">Notice Board</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('admissions')} className="hover:text-white transition-colors cursor-pointer">Admissions</button>
            <span className="text-slate-600">•</span>
            <button onClick={() => navigateTo('contact')} className="hover:text-white transition-colors cursor-pointer">Contact Us</button>
          </div>

          {/* Footer Bottom */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
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
