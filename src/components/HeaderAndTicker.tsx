import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Megaphone,
  ArrowRight,
  Shield,
  FileText,
  Sparkles,
} from 'lucide-react';
import { SchoolSettings, TickerItem } from '../types/school';

interface HeaderAndTickerProps {
  settings: SchoolSettings;
  tickerItems: TickerItem[];
  enquiryCount?: number;
  activeSection?: string;
  onNavigate?: (section: string) => void;
  onOpenAdmissionModal: () => void;
  onOpenAdminModal: () => void;
  onOpenAdminEnquiries?: () => void;
  isAdminLoggedIn: boolean;
}

interface NavItem {
  id: string;
  label: string;
  href?: string;
  action?: () => void;
  children?: {
    id: string;
    label: string;
    desc?: string;
    href?: string;
    action?: () => void;
  }[];
}

export const HeaderAndTicker: React.FC<HeaderAndTickerProps> = ({
  settings,
  tickerItems,
  enquiryCount = 0,
  activeSection = 'home',
  onNavigate,
  onOpenAdmissionModal,
  onOpenAdminModal,
  onOpenAdminEnquiries,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeTickers = tickerItems.filter((t) => t.is_active);

  // Close mobile drawer on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavClick = (sectionId: string, customAction?: () => void) => {
    if (customAction) {
      customAction();
    } else if (onNavigate) {
      onNavigate(sectionId);
    } else {
      const el = document.getElementById(sectionId);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  // Restored full, authentic school navigation structure
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '#home' },
    {
      id: 'about',
      label: 'About Us',
      children: [
        { id: 'about', label: 'About School', desc: 'Ethos, Legacy & Vision' },
        { id: 'leadership', label: 'Leadership', desc: 'Correspondent & Principal' },
      ],
    },
    {
      id: 'academics',
      label: 'Academics',
      children: [
        { id: 'academics', label: 'Higher Secondary (+1 / +2 Streams)', desc: 'Maths-CS, Bio, Commerce' },
        { id: 'notices', label: 'Digital Notice Board', desc: 'School Circulars & Dates' },
      ],
    },
    { id: 'facilities', label: 'Facilities', href: '#facilities' },
    { id: 'activities', label: 'Activities', href: '#activities' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    {
      id: 'admissions',
      label: 'Admissions',
      children: [
        { id: 'admissions', label: 'Admission Procedure', desc: 'Eligibility & Requirements' },
        { id: 'online-enquiry', label: 'Apply Online', desc: 'Direct Admission Form', action: onOpenAdmissionModal },
      ],
    },
    { id: 'contact', label: 'Contact', href: '#contact' },
  ];

  const handleDropdownEnter = (id: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(id);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/98 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Sleek, Practical Nav Row (60px Desktop, 52px Mobile) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[52px] lg:h-[60px] gap-2 lg:gap-3">
          
          {/* School Brand Identity (Left) */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2 sm:gap-2.5 shrink-0 cursor-pointer group text-left min-w-0"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 border border-sky-100 shadow-2xs p-0.5 bg-sky-50/60 flex items-center justify-center">
              <img
                src={settings.logo_url || '/logo.png'}
                alt={settings.school_name}
                className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div className="flex flex-col justify-center leading-tight min-w-0">
              <span className="text-[12.5px] sm:text-[14px] xl:text-[14.5px] font-bold text-[#0f2d69] tracking-tight uppercase line-clamp-1 group-hover:text-sky-700 transition-colors">
                {settings.school_name}
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-medium text-slate-500 hidden sm:block truncate">
                {settings.school_motto || 'Centre for Excellence'} • Alwarcoil, Kanyakumari
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links with Clean Dropdowns (Center) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isActive =
                activeSection === item.id ||
                (hasChildren && item.children?.some((c) => c.id === activeSection));

              if (hasChildren) {
                return (
                  <div
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(item.id)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button
                      onClick={() => {
                        setActiveDropdown(activeDropdown === item.id ? null : item.id);
                      }}
                      className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs xl:text-[12.5px] font-semibold transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#0f2d69] text-white shadow-2xs'
                          : 'text-slate-700 hover:text-[#0f2d69] hover:bg-slate-100/70'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3 h-3 transition-transform duration-200 opacity-70 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Clean Floating Dropdown */}
                    {activeDropdown === item.id && (
                      <div className="absolute left-0 top-full pt-1.5 w-60 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 ring-1 ring-black/5 overflow-hidden">
                          {item.children?.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleNavClick(child.id, child.action)}
                              className={`w-full text-left px-3.5 py-2 transition-colors cursor-pointer flex flex-col ${
                                activeSection === child.id
                                  ? 'bg-sky-50 text-sky-900 border-l-2 border-[#0f2d69]'
                                  : 'text-slate-800 hover:bg-slate-50 hover:text-[#0f2d69]'
                              }`}
                            >
                              <span className="text-xs font-bold">{child.label}</span>
                              {child.desc && (
                                <span className="text-[10.5px] text-slate-500 font-normal">{child.desc}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.action)}
                  className={`px-2.5 py-1 rounded-full text-xs xl:text-[12.5px] font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f2d69] text-white shadow-2xs'
                      : 'text-slate-700 hover:text-[#0f2d69] hover:bg-slate-100/70'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action CTAs: Admin Portal & Admissions Open (Right) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Admin Portal Button with Live Enquiry Badge */}
            <button
              onClick={onOpenAdminModal}
              className="nav-admin-btn !py-1 !px-2.5 !text-xs"
              title={isAdminLoggedIn ? 'Open Admin Control Panel' : 'School Admin Login'}
            >
              <Shield className="w-3 h-3 text-sky-700" />
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Admin Panel' : 'Admin'}
              </span>
              <span className="sm:hidden">Admin</span>
              {enquiryCount > 0 && (
                <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white animate-pulse">
                  {enquiryCount}
                </span>
              )}
            </button>

            {/* School Admissions Open Action Button */}
            <button
              onClick={onOpenAdmissionModal}
              className="admission-cta-btn !py-1 !px-2.5 sm:!px-3 !text-xs"
              title="Apply for Admission 2026–2027"
            >
              <Sparkles className="w-3 h-3 text-yellow-200 hidden xs:inline" />
              <span className="hidden sm:inline">Admissions Open</span>
              <span className="sm:hidden">Apply</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#0f2d69]" /> : <Menu className="w-5 h-5 text-[#0f2d69]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth, non-blocking, scrollable, with backdrop overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 top-[52px] bg-slate-900/40 backdrop-blur-xs z-30 animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative z-40 bg-white border-t border-slate-200 shadow-2xl max-h-[calc(100vh-52px)] overflow-y-auto px-4 py-3.5 space-y-2.5">
            {/* Quick Status / Enquiry Badge in Drawer */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">School Navigation</span>
              {enquiryCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAdminEnquiries) onOpenAdminEnquiries();
                    else onOpenAdminModal();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200 cursor-pointer"
                >
                  <FileText className="w-3 h-3 text-sky-600" />
                  <span>{enquiryCount} Enquiries</span>
                </button>
              )}
            </div>

            {/* Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = mobileExpandedSection === item.id;
                const isActive =
                  activeSection === item.id ||
                  (hasChildren && item.children?.some((c) => c.id === activeSection));

                if (hasChildren) {
                  return (
                    <div key={item.id} className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50/50">
                      <button
                        onClick={() =>
                          setMobileExpandedSection(isExpanded ? null : item.id)
                        }
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                          isActive ? 'text-[#0f2d69]' : 'text-slate-800'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#0f2d69]' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-2 pb-1.5 pt-0.5 space-y-0.5 bg-white border-t border-slate-100">
                          {item.children?.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleNavClick(child.id, child.action)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                activeSection === child.id
                                  ? 'bg-[#0f2d69] text-white font-bold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex flex-col">
                                <span>{child.label}</span>
                                {child.desc && (
                                  <span className={`text-[10px] ${activeSection === child.id ? 'text-sky-200' : 'text-slate-400'}`}>
                                    {child.desc}
                                  </span>
                                )}
                              </div>
                              <ArrowRight className="w-3 h-3 opacity-60" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.action)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-[#0f2d69] text-white font-bold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer CTAs */}
            <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                <Shield className="w-3 h-3 text-[#0f2d69]" />
                <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmissionModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-yellow-200" />
                <span>Apply Online</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Slim, Compact Important News Ticker (28px height) */}
      {activeTickers.length > 0 && (
        <div className="bg-[#0f2d69] text-white border-t border-sky-950 overflow-hidden shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center h-[28px]">
            <div className="z-10 bg-rose-600 text-white px-2.5 sm:px-3 h-full flex items-center gap-1.5 font-bold text-[10px] tracking-wide uppercase shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 animate-pulse" />
              <Megaphone className="w-3 h-3 hidden sm:inline" />
              <span>News:</span>
            </div>

            <div className="flex-1 overflow-hidden py-0.5 relative">
              <div className="animate-marquee hover:[animation-play-state:paused] flex items-center gap-8 whitespace-nowrap">
                {[...activeTickers, ...activeTickers].map((item, idx) => (
                  <React.Fragment key={`${item.id}-${idx}`}>
                    <button
                      onClick={() => {
                        if (item.link_section === '#admissions') {
                          onOpenAdmissionModal();
                        } else {
                          const target = item.link_section.replace('#', '');
                          if (onNavigate) {
                            onNavigate(target);
                          } else {
                            const el = document.querySelector(item.link_section);
                            el?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-100 hover:text-amber-300 transition-colors cursor-pointer group"
                    >
                      <span className="px-1.5 py-0.2 rounded bg-white/15 text-amber-300 border border-amber-300/30 text-[9px] font-bold uppercase">
                        {item.tag}
                      </span>
                      <span className="group-hover:underline underline-offset-2">{item.text}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-amber-300 inline" />
                    </button>
                    <span className="text-sky-300/40 select-none text-[11px]">|</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center px-2.5 shrink-0 h-full bg-[#0f2d69] z-10 border-l border-white/10">
              <button
                onClick={onOpenAdmissionModal}
                className="px-2 py-0.5 rounded-full bg-amber-400 hover:bg-amber-300 text-[#0f2d69] text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
              >
                Apply Online →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
