import React from 'react';
import { Quote, Phone, Award, Camera, UserCheck } from 'lucide-react';
import { SchoolSettings } from '../types/school';

interface LeadershipSectionProps {
  settings: SchoolSettings;
  onEditInAdmin: () => void;
}

export const LeadershipSection: React.FC<LeadershipSectionProps> = ({
  settings,
  onEditInAdmin,
}) => {
  return (
    <section id="leadership" className="py-20 bg-gradient-to-b from-slate-100 to-white relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase tracking-widest mb-3">
            <Award className="w-4 h-4 text-sky-700" />
            <span>Visionary Guidance &amp; Academic Stewardship</span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900">
            Messages from Our Leadership
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Shaping well-rounded individuals with strong values, discipline, confidence, and academic excellence at Alwarcoil, Kanyakumari District.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* CORRESPONDENT'S CARD */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between relative group hover:shadow-xl transition-shadow">
            <div className="h-2.5 bg-gradient-to-r from-sky-700 via-sky-400 to-sky-700" />
            <div className="p-6 sm:p-9 flex-1 flex flex-col">
              {/* Top Profile Header with Portrait */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
                <div className="relative shrink-0">
                  <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 ring-4 ring-sky-200 shadow-md flex flex-col items-center justify-center text-white relative">
                    {settings.correspondent_photo_url ? (
                      <img
                        src={settings.correspondent_photo_url}
                        alt={settings.correspondent_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-sky-400/20 border border-sky-400/50 flex items-center justify-center mb-2.5">
                          <UserCheck className="w-8 h-8 text-sky-300" />
                        </div>
                        <span className="font-serif-display font-bold text-sm text-sky-200 leading-tight">
                          {settings.correspondent_name}
                        </span>
                        <span className="text-[10px] text-sky-200 mt-1 uppercase tracking-wider">
                          {settings.correspondent_title}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={onEditInAdmin}
                      title="Admin: Change Correspondent Portrait"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/75 hover:bg-sky-600 text-white transition-colors opacity-85 group-hover:opacity-100 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase tracking-wider mb-2">
                    Correspondent&apos;s Message
                  </span>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {settings.correspondent_name}
                  </h3>
                  <p className="text-sm font-bold text-amber-700 mt-0.5">
                    {settings.correspondent_qualifications}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {settings.correspondent_title} • UMA Matric Higher Secondary School, Alwarcoil
                  </p>
                  <p className="text-xs text-slate-500">Kanyakumari District, Tamil Nadu</p>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <a href={`tel:${settings.correspondent_phone.replace(/\s+/g, '')}`}>
                      {settings.correspondent_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="mt-6 relative flex-1">
                <Quote className="w-10 h-10 text-amber-500/15 absolute -top-2 -left-2 pointer-events-none" />
                <div className="space-y-3.5 text-slate-700 text-sm sm:text-[15px] leading-relaxed relative z-10 whitespace-pre-line">
                  {settings.correspondent_message}
                </div>
              </div>

              {/* Signature Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-serif-display font-bold text-slate-900">
                    {settings.correspondent_name}{' '}
                    <span className="text-xs font-sans font-semibold text-slate-500">
                      {settings.correspondent_qualifications}
                    </span>
                  </div>
                  <div className="text-xs text-amber-700 font-semibold">
                    {settings.correspondent_title}, UMA Matric Higher Secondary School
                  </div>
                </div>
                <img
                  src={settings.logo_url || '/logo.png'}
                  alt="Logo"
                  className="w-10 h-10 object-contain opacity-80"
                />
              </div>
            </div>
          </div>

          {/* PRINCIPAL'S CARD */}
          <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden flex flex-col justify-between relative group hover:shadow-xl transition-shadow">
            <div className="h-2.5 bg-gradient-to-r from-teal-700 via-teal-400 to-teal-700" />
            <div className="p-6 sm:p-9 flex-1 flex flex-col">
              {/* Top Profile Header with Portrait */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-slate-100">
                <div className="relative shrink-0">
                  <div className="w-36 h-44 sm:w-40 sm:h-48 rounded-2xl overflow-hidden bg-slate-900 ring-4 ring-teal-200 shadow-md flex flex-col items-center justify-center text-white relative">
                    {settings.principal_photo_url ? (
                      <img
                        src={settings.principal_photo_url}
                        alt={settings.principal_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <div className="w-16 h-16 rounded-full bg-teal-400/20 border border-teal-400/50 flex items-center justify-center mb-2.5">
                          <UserCheck className="w-8 h-8 text-teal-300" />
                        </div>
                        <span className="font-serif-display font-bold text-sm text-teal-200 leading-tight">
                          {settings.principal_name}
                        </span>
                        <span className="text-[10px] text-sky-200 mt-1 uppercase tracking-wider">
                          {settings.principal_title}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={onEditInAdmin}
                      title="Admin: Change Principal Portrait"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-950/75 hover:bg-teal-600 text-white transition-colors opacity-85 group-hover:opacity-100 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <span className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold uppercase tracking-wider mb-2">
                    Principal&apos;s Message
                  </span>
                  <h3 className="font-serif-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {settings.principal_name}
                  </h3>
                  <p className="text-sm font-bold text-amber-700 mt-0.5">
                    {settings.principal_qualifications}
                  </p>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {settings.principal_title} • UMA Matric Higher Secondary School, Alwarcoil
                  </p>
                  <p className="text-xs text-slate-500">Kanyakumari District, Tamil Nadu</p>

                  <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    <a href={`tel:${settings.principal_phone.replace(/\s+/g, '')}`}>
                      {settings.principal_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Message Body */}
              <div className="mt-6 relative flex-1">
                <Quote className="w-10 h-10 text-amber-500/15 absolute -top-2 -left-2 pointer-events-none" />
                <div className="space-y-3.5 text-slate-700 text-sm sm:text-[15px] leading-relaxed relative z-10 whitespace-pre-line">
                  {settings.principal_message}
                </div>
              </div>

              {/* Signature Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="text-xs italic text-slate-500 mb-0.5">With warm wishes,</div>
                  <div className="font-serif-display font-bold text-slate-900">
                    {settings.principal_name}{' '}
                    <span className="text-xs font-sans font-semibold text-slate-500">
                      {settings.principal_qualifications}
                    </span>
                  </div>
                  <div className="text-xs text-amber-700 font-semibold">
                    {settings.principal_title}, UMA Matric Higher Secondary School
                  </div>
                </div>
                <img
                  src={settings.logo_url || '/logo.png'}
                  alt="Logo"
                  className="w-10 h-10 object-contain opacity-80"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
