import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Play,
  X,
  PlusCircle,
  Sparkles,
  Maximize2,
  Layers,
} from 'lucide-react';
import { GalleryItem } from '../types/school';
import { parseVideoUrl } from '../lib/supabase';

interface GallerySectionProps {
  galleryItems: GalleryItem[];
  onOpenAdminGallery: () => void;
}

const CATEGORIES = [
  'All Categories',
  'Campus & Facilities',
  'Science & Computer Labs',
  'Annual Day & Cultural',
  'Sports & Physical Activities',
  'Events & Celebrations',
  'Student Achievements',
] as const;

export const GallerySection: React.FC<GallerySectionProps> = ({
  galleryItems,
  onOpenAdminGallery,
}) => {
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('All Categories');
  const [activeLightboxItem, setActiveLightboxItem] = useState<GalleryItem | null>(null);

  const filteredItems = galleryItems.filter((item) => {
    const matchesMedia = mediaFilter === 'all' || item.media_type === mediaFilter;
    const matchesCategory =
      categoryFilter === 'All Categories' || item.category === categoryFilter;
    return matchesMedia && matchesCategory;
  });

  const photoCount = galleryItems.filter((i) => i.media_type === 'image').length;
  const videoCount = galleryItems.filter((i) => i.media_type === 'video').length;

  return (
    <section id="gallery" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus Life in Pictures &amp; Videos</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-white">
              Photo &amp; Video Gallery
            </h2>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
              Explore moments of academic excellence, cultural celebrations, sports meets, smart classrooms, and hands-on laboratory learning at UMA Matric Higher Secondary School.
            </p>
          </div>

          <button
            onClick={onOpenAdminGallery}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-sky-600 hover:text-white text-sky-200 border border-sky-400/30 text-xs sm:text-sm font-bold transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Admin: Add Photos / Videos</span>
          </button>
        </div>

        {/* Media Type Tabs & Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-8 border-b border-white/10">
          {/* Media Type Switcher */}
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-800/80 border border-slate-700 self-start">
            <button
              onClick={() => setMediaFilter('all')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mediaFilter === 'all'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Media ({galleryItems.length})</span>
            </button>
            <button
              onClick={() => setMediaFilter('image')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mediaFilter === 'image'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Pictures ({photoCount})</span>
            </button>
            <button
              onClick={() => setMediaFilter('video')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                mediaFilter === 'video'
                  ? 'bg-sky-600 text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Videos ({videoCount})</span>
            </button>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-3xl border border-slate-800 mt-8">
            <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-300">No media items match this filter</h3>
            <p className="text-sm text-slate-500 mt-1">
              Try selecting &ldquo;All Categories&rdquo; or upload new pictures and videos from the Admin Panel.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {filteredItems.map((item) => {
              const videoInfo =
                item.media_type === 'video' ? parseVideoUrl(item.media_url) : null;
              const displayThumb =
                item.media_type === 'image'
                  ? item.media_url
                  : item.thumbnail_url ||
                    videoInfo?.thumbnailUrl ||
                    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=800&q=80';

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLightboxItem(item)}
                  className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-amber-400/60 shadow-lg flex flex-col cursor-pointer transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Thumbnail Container */}
                  <div className="relative h-56 overflow-hidden bg-slate-950">
                    {item.media_type === 'video' &&
                    !item.thumbnail_url &&
                    !videoInfo?.isYouTube ? (
                      <video
                        src={item.media_url}
                        className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                        muted
                        playsInline
                        preload="metadata"
                      />
                    ) : (
                      <img
                        src={displayThumb}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    {/* Top Media Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider shadow ${
                          item.media_type === 'video'
                            ? 'bg-red-600 text-white'
                            : 'bg-slate-950/80 text-amber-300 border border-amber-400/30'
                        }`}
                      >
                        {item.media_type === 'video' ? (
                          <>
                            <Video className="w-3 h-3" />
                            <span>Video</span>
                          </>
                        ) : (
                          <>
                            <ImageIcon className="w-3 h-3" />
                            <span>Photo</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Center Play / Zoom Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      {item.media_type === 'video' ? (
                        <div className="w-14 h-14 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-slate-950/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                          <Maximize2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Category Tag at bottom of image */}
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Caption */}
                  <div className="p-4 flex-1 flex flex-col justify-between bg-slate-900">
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal for Photo / Video Playback */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  {activeLightboxItem.category} •{' '}
                  {activeLightboxItem.media_type === 'video' ? 'Video Clip' : 'Photograph'}
                </span>
                <h3 className="font-serif-display text-xl font-bold text-white">
                  {activeLightboxItem.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveLightboxItem(null)}
                className="p-2 rounded-full bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-black flex items-center justify-center max-h-[72vh] overflow-hidden">
              {activeLightboxItem.media_type === 'video' ? (
                (() => {
                  const info = parseVideoUrl(activeLightboxItem.media_url);
                  if (info.isYouTube) {
                    return (
                      <div className="w-full aspect-video">
                        <iframe
                          src={info.embedUrl}
                          title={activeLightboxItem.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    );
                  }
                  return (
                    <video
                      src={activeLightboxItem.media_url}
                      controls
                      autoPlay
                      className="max-h-[70vh] w-full object-contain"
                    />
                  );
                })()
              ) : (
                <img
                  src={activeLightboxItem.media_url}
                  alt={activeLightboxItem.title}
                  className="max-h-[70vh] w-auto object-contain"
                />
              )}
            </div>

            {activeLightboxItem.description && (
              <div className="px-6 py-4 bg-slate-900 text-slate-300 text-sm">
                {activeLightboxItem.description}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
