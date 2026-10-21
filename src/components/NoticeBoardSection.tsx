import React, { useState } from 'react';
import {
  Bell,
  Pin,
  Calendar,
  MapPin,
  Sparkles,
  PlusCircle,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';
import { NoticeItem } from '../types/school';

interface NoticeBoardSectionProps {
  notices: NoticeItem[];
  onOpenAdminNotices: () => void;
  onOpenAdmissionModal: () => void;
}

export const NoticeBoardSection: React.FC<NoticeBoardSectionProps> = ({
  notices,
  onOpenAdminNotices,
  onOpenAdmissionModal,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Admission', 'Academic', 'Activities', 'Event', 'Holiday', 'General'];

  const filteredNotices = notices.filter(
    (n) => selectedCategory === 'All' || n.category === selectedCategory
  );

  const badgeColor = (cat: NoticeItem['category']) => {
    switch (cat) {
      case 'Admission':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Activities':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Event':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Holiday':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <section id="notices" className="py-20 bg-amber-50/50 border-y border-amber-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 text-xs font-extrabold uppercase tracking-widest mb-3">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              <span>Official Circulars & Updates</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
              Digital Notice Board & News
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              Stay updated with the latest admission dates, academic schedules, special assemblies, and announcements from UMA Matric Higher Secondary School &amp; UMA Kidz Global Horizon.
            </p>
          </div>

          <button
            onClick={onOpenAdminNotices}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0a1931] hover:bg-[#152f59] text-amber-300 text-xs sm:text-sm font-bold shadow transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Admin: Post / Edit Notice</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Featured Vijaya Dasami Admissions Highlight Card (from PDF Page 8) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0a1931] via-[#122b54] to-[#0a1931] text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/70 relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-extrabold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Special Announcement</span>
            </div>

            <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-3">
              Vijaya Dasami Admissions – 20 October 2026
            </h3>

            <p className="text-slate-200 text-sm leading-relaxed mb-5">
              Admissions are open on the auspicious occasion of <strong>Vijaya Dasami</strong> at both of our premier educational campuses:
            </p>

            <div className="space-y-3.5 mb-6">
              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="font-bold text-amber-300 text-base">
                  1. UMA Matric Higher Secondary School
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Alwarcoil, Kanyakumari District, Tamil Nadu</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                <div className="font-bold text-amber-300 text-base">
                  2. UMA Kidz Global Horizon
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-200 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Madavilagam, Kandanvilai Post, Kanyakumari District, Tamil Nadu</span>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-sky-200 italic mb-6">
              &ldquo;Parents are warmly invited to enrol their children and begin their educational journey with us.&rdquo;
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/15">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                  Auspicious Admission Date
                </div>
                <div className="text-base font-extrabold text-amber-300">20 October 2026</div>
              </div>
              <button
                onClick={onOpenAdmissionModal}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Apply Online Now</span>
              </button>
            </div>
          </div>

          {/* Right Live Notice Board Feed */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow-xl border border-slate-200/90 overflow-hidden">
            {/* Notice Board Header & Category Filter */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-display font-bold text-lg text-white">
                    School Notice Board
                  </h3>
                  <p className="text-xs text-slate-400">
                    Managed live by School Administration ({filteredNotices.length} active notices)
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Notices List */}
            <div className="divide-y divide-slate-100 max-h-[540px] overflow-y-auto p-4 sm:p-6 space-y-4">
              {filteredNotices.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-sm">
                  No notices posted in this category yet.
                </div>
              ) : (
                filteredNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      notice.is_pinned
                        ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                        : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {notice.is_pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wider">
                            <Pin className="w-3 h-3" />
                            <span>Pinned</span>
                          </span>
                        )}
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${badgeColor(
                            notice.category
                          )}`}
                        >
                          {notice.category}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{notice.date}</span>
                      </div>
                    </div>

                    <h4 className="font-serif-display text-lg font-bold text-slate-900 mb-1.5">
                      {notice.title}
                    </h4>

                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {notice.content}
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                      {notice.location && (
                        <span className="inline-flex items-center gap-1 font-medium text-slate-600">
                          <MapPin className="w-3.5 h-3.5 text-amber-600" />
                          <span>{notice.location}</span>
                        </span>
                      )}

                      {notice.attachment_url && (
                        <a
                          href={notice.attachment_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-bold text-blue-700 hover:underline"
                        >
                          <span>View Attachment / Poster</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
