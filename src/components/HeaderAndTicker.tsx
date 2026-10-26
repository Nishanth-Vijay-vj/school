import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  Megaphone,
  ArrowRight,
  Shield,
  FileText,
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

  // Close mobile drawer on resize to desktop
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

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', href: '#home' },
    {
      id: 'about',
      label: 'About us',
      children: [
        { id: 'about', label: 'Our Story' },
        { id: 'leadership', label: 'Thoughts of Management' },
      ],
    },
    { id: 'kindergarten', label: 'Kindergarten Wing', action: () => handleNavClick('facilities') },
    {
      id: 'admissions',
      label: 'Admissions',
      children: [
        { id: 'admissions', label: 'Admission Procedure' },
        { id: 'online-admission', label: 'Online Admission', action: onOpenAdmissionModal },
      ],
    },
    {
      id: 'academics',
      label: 'Academics',
      children: [
        { id: 'academics', label: 'Higher Secondary Streams (+1/+2)' },
        { id: 'notices', label: 'Circulars & Notice Board' },
      ],
    },
    {
      id: 'activities',
      label: 'Activities',
      children: [
        { id: 'activities', label: 'Events & Celebrations' },
        { id: 'activities-clubs', label: 'Silambam, Yoga & Clubs', action: () => handleNavClick('activities') },
      ],
    },
    { id: 'facilities', label: 'Facilities', href: '#facilities' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'contact', label: 'Contact Us', href: '#contact' },
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
    <header className="sticky top-0 z-40 bg-white border-b border-[#e8edf6] shadow-xs">
      {/* Rojavanam Single Compact Nav Row (74px on Desktop, 62px on Mobile) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[62px] lg:h-[74px] gap-2 lg:gap-3">
          {/* Left Brand: School Crest + 3-line Text Block matching Rojavanam */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="flex items-center gap-2.5 sm:gap-3 shrink-0 cursor-pointer group text-left"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-xs flex items-center justify-center bg-white">
              <img
                src={settings.logo_url || '/logo.png'}
                alt={settings.school_name}
                className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.png';
                }}
              />
            </div>
            <div className="flex flex-col justify-center leading-tight min-w-0">
              <span className="text-[13px] sm:text-[15px] xl:text-[16px] font-bold text-[#13306d] tracking-tight uppercase line-clamp-1 group-hover:text-sky-800 transition-colors">
                {settings.school_name}
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-[#5f6982] hidden sm:block">
                {settings.school_motto || 'Where Excellence Meets Innovation'}
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-semibold text-[#dc2b2b] tracking-wide">
                [Tamil Nadu Matric Code: 28247 | Estd. 1990]
              </span>
            </div>
          </a>

          {/* Center Navigation Links with Dropdowns (Desktop only) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Main Navigation">
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
                        if (activeDropdown === item.id) {
                          setActiveDropdown(null);
                        } else {
                          setActiveDropdown(item.id);
                        }
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] xl:text-[13.5px] font-medium transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#13306d] text-white font-semibold'
                          : 'text-[#13306d] hover:text-[#08183a] hover:bg-slate-100/80'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === item.id && (
                      <div className="absolute left-0 top-full pt-1.5 w-56 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                        <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 ring-1 ring-black/5 overflow-hidden">
                          {item.children?.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleNavClick(child.id, child.action)}
                              className={`w-full text-left px-4 py-2 text-xs xl:text-[13px] font-medium transition-colors cursor-pointer flex items-center justify-between ${
                                activeSection === child.id
                                  ? 'bg-sky-50 text-sky-900 font-semibold border-l-2 border-[#13306d]'
                                  : 'text-slate-700 hover:bg-slate-50 hover:text-[#13306d]'
                              }`}
                            >
                              <span>{child.label}</span>
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
                  className={`px-2.5 xl:px-3 py-1.5 rounded-full text-[13px] xl:text-[13.5px] font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#13306d] text-white font-semibold'
                      : 'text-[#13306d] hover:text-[#08183a] hover:bg-slate-100/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons: Rojavanam Login & Dews Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Rojavanam Signature Login Button */}
            <button
              onClick={onOpenAdminModal}
              className="nav-login-btn text-xs sm:text-[13px] font-semibold"
              title={isAdminLoggedIn ? 'Open Admin Control Panel' : 'Staff & Admin Login'}
            >
              <Shield className="w-3.5 h-3.5 text-[#0a2d69]" />
              <span className="hidden sm:inline">
                {isAdminLoggedIn ? 'Admin Panel' : 'Login'}
              </span>
              <span className="sm:hidden">Login</span>
              {enquiryCount > 0 && (
                <span className="ml-0.5 inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                  {enquiryCount}
                </span>
              )}
            </button>

            {/* Rojavanam Signature Dews Admission Button */}
            <button
              onClick={onOpenAdmissionModal}
              className="dews-nav-link cursor-pointer text-xs sm:text-[13.5px]"
              title="Apply for Admission (Dews Wing / K-12)"
            >
              <span>Dews</span>
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#13306d]" /> : <Menu className="w-6 h-6 text-[#13306d]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Smooth, non-blocking, scrollable, with backdrop overlay) */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 top-[62px] bg-slate-900/40 backdrop-blur-xs z-30 animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer Menu */}
          <div className="relative z-40 bg-white border-t border-slate-200 shadow-2xl max-h-[calc(100vh-62px)] overflow-y-auto px-4 py-4 space-y-3">
            {/* Quick Actions Header in Mobile Drawer */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Navigation Menu</span>
              {enquiryCount > 0 && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAdminEnquiries) onOpenAdminEnquiries();
                    else onOpenAdminModal();
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200"
                >
                  <FileText className="w-3 h-3" />
                  <span>{enquiryCount} New Forms</span>
                </button>
              )}
            </div>

            {/* Nav list */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = mobileExpandedSection === item.id;
                const isActive =
                  activeSection === item.id ||
                  (hasChildren && item.children?.some((c) => c.id === activeSection));

                if (hasChildren) {
                  return (
                    <div key={item.id} className="rounded-lg overflow-hidden border border-slate-100 bg-slate-50/50">
                      <button
                        onClick={() =>
                          setMobileExpandedSection(isExpanded ? null : item.id)
                        }
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                          isActive ? 'text-[#13306d]' : 'text-slate-800'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#13306d]' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-2 pt-0.5 space-y-1 bg-white border-t border-slate-100">
                          {item.children?.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleNavClick(child.id, child.action)}
                              className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                                activeSection === child.id
                                  ? 'bg-[#13306d] text-white font-bold'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span>{child.label}</span>
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
                    className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? 'bg-[#13306d] text-white font-bold'
                        : 'text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Footer Drawer Actions */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdminModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Shield className="w-3.5 h-3.5 text-[#13306d]" />
                <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmissionModal();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs font-bold shadow-xs"
              >
                <span>Admission / Dews</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rojavanam Slim Important News Ticker (Directly below single nav row) */}
      {activeTickers.length > 0 && (
        <div className="bg-[#0c234b] text-white border-t border-slate-800/20 overflow-hidden shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center h-[34px]">
            <div className="z-10 bg-[#e24b4b] text-white px-3 sm:px-3.5 h-full flex items-center gap-1.5 font-bold text-[10.5px] sm:text-xs tracking-wide uppercase shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-yellow-300 animate-pulse" />
              <Megaphone className="w-3 h-3 hidden sm:inline" />
              <span>Latest News:</span>
            </div>

            <div className="flex-1 overflow-hidden py-1 relative">
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
                      className="inline-flex items-center gap-2 text-xs font-medium text-slate-100 hover:text-amber-300 transition-colors cursor-pointer group"
                    >
                      <span className="px-1.5 py-0.2 rounded bg-white/15 text-amber-300 border border-amber-300/30 text-[9.5px] font-bold uppercase">
                        {item.tag}
                      </span>
                      <span className="group-hover:underline underline-offset-2">{item.text}</span>
                      <ArrowRight className="w-3 h-3 text-amber-300 inline" />
                    </button>
                    <span className="text-slate-500 select-none">|</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center px-3 shrink-0 h-full bg-[#0c234b] z-10 border-l border-white/10">
              <button
                onClick={onOpenAdmissionModal}
                className="px-2.5 py-0.5 rounded-full bg-amber-500 hover:bg-amber-400 text-[#0c234b] text-[11px] font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                Online Admission →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
