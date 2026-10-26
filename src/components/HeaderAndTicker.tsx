import React, { useState } from 'react';
import {
  Phone,
  MapPin,
  Shield,
  Menu,
  X,
  GraduationCap,
  Megaphone,
  ArrowRight,
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

  const activeTickers = tickerItems.filter((t) => t.is_active);

  const navLinks = [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About School', href: '#about' },
    { id: 'leadership', label: 'Leadership', href: '#leadership' },
    { id: 'academics', label: 'Academics (+1/+2)', href: '#academics' },
    { id: 'facilities', label: 'Facilities', href: '#facilities' },
    { id: 'activities', label: 'Activities & Events', href: '#activities' },
    { id: 'gallery', label: 'Gallery', href: '#gallery' },
    { id: 'notices', label: 'Notice Board', href: '#notices' },
    { id: 'admissions', label: 'Admissions', href: '#admissions' },
    { id: 'contact', label: 'Contact Us', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200">
      {/* Tier 1: Slim Mild Top Info Bar */}
      <div className="bg-slate-100/90 text-slate-600 text-xs border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-sky-700 shrink-0" />
              <span>Alwarcoil, Neyyoor Post, Kanyakumari District – 629802</span>
            </span>
            <span className="hidden md:inline text-slate-300">|</span>
            <a
              href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}
              className="hover:text-sky-800 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3 text-sky-700" />
              <span>Correspondent: {settings.correspondent_phone}</span>
            </a>
            <a
              href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}
              className="hidden sm:inline-flex hover:text-sky-800 transition-colors items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3 text-teal-700" />
              <span>Principal: {settings.principal_phone}</span>
            </a>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {enquiryCount > 0 && (
              <button
                onClick={onOpenAdminEnquiries || onOpenAdminModal}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 hover:bg-sky-200 text-xs font-semibold transition-colors cursor-pointer"
                title="View Submitted Admission Forms in Admin Panel"
              >
                <FileText className="w-3 h-3 text-sky-700" />
                <span>Submitted Forms ({enquiryCount})</span>
              </button>
            )}
            <button
              onClick={onOpenAdminModal}
              className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                isAdminLoggedIn
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-300'
              }`}
            >
              <Shield className="w-3 h-3 text-sky-700" />
              <span>{isAdminLoggedIn ? 'Admin Panel' : 'Admin Login'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tier 2: Main School Title Banner (Proportional Single-Row Layout) */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* School Logo + Single-Line Title Banner */}
            <a
              href="#home"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault();
                  onNavigate('home');
                }
              }}
              className="flex items-center gap-3.5 min-w-0 group cursor-pointer"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-sky-50/70 p-1 shadow-xs ring-1 ring-sky-200 shrink-0 flex items-center justify-center">
                <img
                  src={settings.logo_url || '/logo.png'}
                  alt={settings.school_name}
                  className="w-full h-full object-contain rounded-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/logo.png';
                  }}
                />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase text-sky-700">
                    {settings.school_motto || 'CENTRE FOR EXCELLENCE'}
                  </span>
                  <span className="hidden sm:inline text-slate-300">•</span>
                  <span className="hidden sm:inline text-xs text-slate-500 font-medium">
                    Alwarcoil, Kanyakumari District, Tamil Nadu
                  </span>
                </div>
                <h1 className="font-serif-display text-base sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug sm:truncate">
                  {settings.school_name}
                </h1>
              </div>
            </a>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={onOpenAdmissionModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Admissions Open</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 3: Clean Horizontal Desktop Navigation Bar */}
      <nav className="hidden lg:block bg-slate-50/90 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = (activeSection || 'home') === link.id;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={(e) => {
                      if (onNavigate) {
                        e.preventDefault();
                        onNavigate(link.id);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-sky-700 text-white shadow-xs'
                        : 'text-slate-700 hover:text-sky-800 hover:bg-sky-100/60'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
            <span className="text-xs font-medium text-slate-500 hidden xl:inline">
              Vijaya Dasami Admissions: 20 Oct 2026
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-4 space-y-2 shadow-lg">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {navLinks.map((link) => {
              const isActive = (activeSection || 'home') === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(link.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-sky-700 text-white font-bold'
                      : 'bg-slate-50 hover:bg-sky-50 text-slate-700'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* Tier 4: Mild & Professional Important News Ticker Below Title Card */}
      {activeTickers.length > 0 && (
        <div className="bg-sky-50/90 text-slate-800 border-t border-sky-200/80 overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center">
            <div className="z-10 bg-sky-800 text-white px-3 sm:px-3.5 py-1.5 flex items-center gap-1.5 font-bold text-[11px] sm:text-xs tracking-wide uppercase shrink-0">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <Megaphone className="w-3.5 h-3.5 hidden sm:inline" />
              <span>Latest News:</span>
            </div>

            <div className="flex-1 overflow-hidden py-1.5 relative">
              <div className="animate-marquee hover:[animation-play-state:paused] flex items-center gap-6 whitespace-nowrap">
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
                      className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-sky-800 transition-colors cursor-pointer group"
                    >
                      <span className="px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold uppercase">
                        {item.tag}
                      </span>
                      <span className="group-hover:underline underline-offset-2">{item.text}</span>
                      <ArrowRight className="w-3 h-3 text-sky-600 inline" />
                    </button>
                    <span className="text-slate-300 select-none">|</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center px-3 shrink-0 bg-sky-50/95 z-10 border-l border-sky-200/60">
              <button
                onClick={onOpenAdmissionModal}
                className="px-3 py-1 rounded-md bg-sky-700 hover:bg-sky-800 text-white text-[11px] font-semibold transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
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
