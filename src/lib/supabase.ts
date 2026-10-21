import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  SchoolSettings,
  TickerItem,
  NoticeItem,
  GalleryItem,
  AdmissionEnquiry,
  SchoolEvent,
} from '../types/school';
import {
  DEFAULT_SETTINGS,
  DEFAULT_TICKER_ITEMS,
  DEFAULT_NOTICES,
  DEFAULT_GALLERY_ITEMS,
  DEFAULT_ENQUIRIES,
  DEFAULT_EVENTS,
} from '../data/schoolData';

const DEFAULT_SB_URL = 'https://yyujcbjuixyaqcbbstok.supabase.co';
const DEFAULT_SB_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5dWpjYmp1aXh5YXFjYmJzdG9rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE4Mjg3MDcsImV4cCI6MjEwNzQwNDcwN30.ca7EyBfbUqhIDmp6RY4jAaxPcnbWqoQYkmNQplXN8lk';

const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SB_URL;
const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SB_KEY;

const normalizeSupabaseUrl = (rawUrl: string) =>
  rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

// Allow runtime override via Admin Panel settings if user wants to test keys in browser
const getRuntimeCredentials = () => {
  const storedUrl = normalizeSupabaseUrl(localStorage.getItem('uma_supabase_url') || envUrl || '');
  const storedKey = (localStorage.getItem('uma_supabase_anon_key') || envKey || '').trim();
  const isValid =
    Boolean(storedUrl && storedKey) &&
    storedUrl.startsWith('http') &&
    !storedUrl.includes('your-project-id');
  return { url: storedUrl, key: storedKey, isValid };
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isValid } = getRuntimeCredentials();
  if (!isValid) return null;
  if (!supabaseInstance) {
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = (): boolean => {
  return getRuntimeCredentials().isValid;
};

export const saveRuntimeSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('uma_supabase_url', url.trim());
  localStorage.setItem('uma_supabase_anon_key', key.trim());
  supabaseInstance = null;
};

export const clearRuntimeSupabaseCredentials = () => {
  localStorage.removeItem('uma_supabase_url');
  localStorage.removeItem('uma_supabase_anon_key');
  supabaseInstance = null;
};

// LocalStorage Keys for fallback / instant persistence
const LS_KEYS = {
  SETTINGS: 'uma_school_settings_v1',
  TICKER: 'uma_school_ticker_v1',
  NOTICES: 'uma_school_notices_v1',
  GALLERY: 'uma_school_gallery_v1',
  ENQUIRIES: 'uma_school_enquiries_v1',
  EVENTS: 'uma_school_events_v1',
};

const getLocal = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage quota warning:', err);
  }
};

// Compress image file to clean data URL for fallback when Supabase isn't connected yet
const compressImageToDataUrl = (file: File, maxWidth = 1000, quality = 0.82): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Upload File to Supabase Storage ('school-media' bucket) or fallback locally
export const uploadMediaFile = async (
  file: File,
  folder: 'portraits' | 'gallery' | 'posters' | 'logos'
): Promise<string> => {
  const supabase = getSupabaseClient();
  if (supabase) {
    const ext = file.name.split('.').pop() || 'bin';
    const safeName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from('school-media').upload(safeName, file, {
      cacheControl: '3600',
      upsert: true,
    });
    if (!error) {
      const { data } = supabase.storage.from('school-media').getPublicUrl(safeName);
      if (data?.publicUrl) {
        return data.publicUrl;
      }
    } else {
      console.warn('Supabase storage upload fell back to local storage:', error.message);
    }
  }

  // Fallback for local preview mode
  if (file.type.startsWith('image/')) {
    return await compressImageToDataUrl(file, folder === 'portraits' ? 700 : 1200);
  }
  // For video files in local mode without Supabase, use object URL or data URL if small
  if (file.size <= 4 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
  return URL.createObjectURL(file);
};

// Fetch all school data (from Supabase if connected, else LocalStorage with PDF defaults)
export const fetchAllSchoolData = async (): Promise<{
  settings: SchoolSettings;
  tickerItems: TickerItem[];
  notices: NoticeItem[];
  gallery: GalleryItem[];
  enquiries: AdmissionEnquiry[];
  events: SchoolEvent[];
  source: 'supabase' | 'local';
}> => {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const [settingsRes, tickerRes, noticesRes, galleryRes, enquiriesRes, eventsRes] = await Promise.all([
        supabase.from('school_settings').select('*').eq('id', 1).maybeSingle(),
        supabase.from('ticker_items').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('notices')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('date', { ascending: false }),
        supabase.from('gallery_items').select('*').order('created_at', { ascending: false }),
        supabase.from('admission_enquiries').select('*').order('created_at', { ascending: false }),
        supabase.from('school_events').select('*').order('date', { ascending: false }),
      ]);

      const localEnquiries = getLocal<AdmissionEnquiry[]>(LS_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);
      const remoteEnquiries: AdmissionEnquiry[] = enquiriesRes.data || [];
      const mergedEnquiriesMap = new Map<string, AdmissionEnquiry>();
      [...remoteEnquiries, ...localEnquiries].forEach((item) => {
        mergedEnquiriesMap.set(item.id, item);
      });
      const enquiries = Array.from(mergedEnquiriesMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const localEvents = getLocal<SchoolEvent[]>(LS_KEYS.EVENTS, DEFAULT_EVENTS);
      const events: SchoolEvent[] =
        eventsRes.data && eventsRes.data.length > 0
          ? eventsRes.data
          : localEvents;

      if (!settingsRes.error) {
        const settings: SchoolSettings = settingsRes.data
          ? { ...DEFAULT_SETTINGS, ...settingsRes.data }
          : getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS);

        const tickerItems: TickerItem[] =
          tickerRes.data && tickerRes.data.length > 0
            ? tickerRes.data
            : getLocal(LS_KEYS.TICKER, DEFAULT_TICKER_ITEMS);

        const notices: NoticeItem[] =
          noticesRes.data && noticesRes.data.length > 0
            ? noticesRes.data
            : getLocal(LS_KEYS.NOTICES, DEFAULT_NOTICES);

        const gallery: GalleryItem[] =
          galleryRes.data && galleryRes.data.length > 0
            ? galleryRes.data
            : getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);

        return {
          settings,
          tickerItems,
          notices,
          gallery,
          enquiries,
          events,
          source: 'supabase',
        };
      }
    } catch (err) {
      console.warn('Error fetching from Supabase, using local store:', err);
    }
  }

  return {
    settings: getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS),
    tickerItems: getLocal(LS_KEYS.TICKER, DEFAULT_TICKER_ITEMS),
    notices: getLocal(LS_KEYS.NOTICES, DEFAULT_NOTICES),
    gallery: getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS),
    enquiries: getLocal(LS_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES),
    events: getLocal(LS_KEYS.EVENTS, DEFAULT_EVENTS),
    source: 'local',
  };
};

// Update School Settings (Leadership Portraits, Messages, Admission Popup Config, Logo)
export const updateSchoolSettings = async (settings: SchoolSettings): Promise<SchoolSettings> => {
  const updated = { ...settings, id: 1 };
  setLocal(LS_KEYS.SETTINGS, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    const { error } = await supabase.from('school_settings').upsert({
      ...updated,
      updated_at: new Date().toISOString(),
    });
    if (error) console.warn('Supabase settings upsert error:', error.message);
  }
  return updated;
};

// Ticker CRUD
export const saveTickerItemsList = async (items: TickerItem[]): Promise<TickerItem[]> => {
  setLocal(LS_KEYS.TICKER, items);
  return items;
};

export const addOrUpdateTickerItem = async (item: TickerItem, currentList: TickerItem[]): Promise<TickerItem[]> => {
  const supabase = getSupabaseClient();
  let updatedList: TickerItem[];
  const exists = currentList.some((i) => i.id === item.id);

  if (supabase) {
    const payload = {
      tag: item.tag,
      text: item.text,
      is_active: item.is_active,
      link_section: item.link_section,
      sort_order: item.sort_order,
    };
    if (exists && !item.id.startsWith('ticker-')) {
      await supabase.from('ticker_items').update(payload).eq('id', item.id);
    } else {
      const { data } = await supabase.from('ticker_items').insert(payload).select().single();
      if (data) item = data;
    }
  }

  if (exists) {
    updatedList = currentList.map((i) => (i.id === item.id ? item : i));
  } else {
    updatedList = [...currentList, item];
  }
  setLocal(LS_KEYS.TICKER, updatedList);
  return updatedList;
};

export const deleteTickerItemById = async (id: string, currentList: TickerItem[]): Promise<TickerItem[]> => {
  const supabase = getSupabaseClient();
  if (supabase && !id.startsWith('ticker-')) {
    await supabase.from('ticker_items').delete().eq('id', id);
  }
  const updated = currentList.filter((i) => i.id !== id);
  setLocal(LS_KEYS.TICKER, updated);
  return updated;
};

// Notices CRUD
export const addOrUpdateNotice = async (notice: NoticeItem, currentList: NoticeItem[]): Promise<NoticeItem[]> => {
  const supabase = getSupabaseClient();
  const exists = currentList.some((n) => n.id === notice.id);

  if (supabase) {
    const payload = {
      title: notice.title,
      date: notice.date,
      category: notice.category,
      content: notice.content,
      location: notice.location || '',
      is_pinned: notice.is_pinned,
      attachment_url: notice.attachment_url || '',
    };
    if (exists && !notice.id.startsWith('notice-')) {
      await supabase.from('notices').update(payload).eq('id', notice.id);
    } else {
      const { data } = await supabase.from('notices').insert(payload).select().single();
      if (data) notice = data;
    }
  }

  const updated = exists
    ? currentList.map((n) => (n.id === notice.id ? notice : n))
    : [notice, ...currentList];
  setLocal(LS_KEYS.NOTICES, updated);
  return updated;
};

export const deleteNoticeById = async (id: string, currentList: NoticeItem[]): Promise<NoticeItem[]> => {
  const supabase = getSupabaseClient();
  if (supabase && !id.startsWith('notice-')) {
    await supabase.from('notices').delete().eq('id', id);
  }
  const updated = currentList.filter((n) => n.id !== id);
  setLocal(LS_KEYS.NOTICES, updated);
  return updated;
};

// Gallery CRUD
export const addOrUpdateGalleryItem = async (
  item: GalleryItem,
  currentList: GalleryItem[]
): Promise<GalleryItem[]> => {
  const supabase = getSupabaseClient();
  const exists = currentList.some((g) => g.id === item.id);

  if (supabase) {
    const payload = {
      title: item.title,
      description: item.description,
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || '',
      category: item.category,
      is_featured: item.is_featured,
    };
    if (exists && !item.id.startsWith('gal-')) {
      await supabase.from('gallery_items').update(payload).eq('id', item.id);
    } else {
      const { data } = await supabase.from('gallery_items').insert(payload).select().single();
      if (data) item = data;
    }
  }

  const updated = exists
    ? currentList.map((g) => (g.id === item.id ? item : g))
    : [item, ...currentList];
  setLocal(LS_KEYS.GALLERY, updated);
  return updated;
};

export const deleteGalleryItemById = async (
  id: string,
  currentList: GalleryItem[]
): Promise<GalleryItem[]> => {
  const supabase = getSupabaseClient();
  if (supabase && !id.startsWith('gal-')) {
    await supabase.from('gallery_items').delete().eq('id', id);
  }
  const updated = currentList.filter((g) => g.id !== id);
  setLocal(LS_KEYS.GALLERY, updated);
  return updated;
};

// Events CRUD
export const addOrUpdateEvent = async (
  event: SchoolEvent,
  currentList: SchoolEvent[]
): Promise<SchoolEvent[]> => {
  const supabase = getSupabaseClient();
  const exists = currentList.some((e) => e.id === event.id);

  if (supabase) {
    const payload = {
      title: event.title,
      date: event.date,
      category: event.category,
      description: event.description,
      image_url: event.image_url || '',
      location: event.location || '',
    };
    if (exists && !event.id.startsWith('ev-')) {
      await supabase.from('school_events').update(payload).eq('id', event.id);
    } else {
      const { data } = await supabase.from('school_events').insert(payload).select().single();
      if (data) event = data;
    }
  }

  const updated = exists
    ? currentList.map((e) => (e.id === event.id ? event : e))
    : [event, ...currentList];
  setLocal(LS_KEYS.EVENTS, updated);
  return updated;
};

export const deleteEventById = async (
  id: string,
  currentList: SchoolEvent[]
): Promise<SchoolEvent[]> => {
  const supabase = getSupabaseClient();
  if (supabase && !id.startsWith('ev-')) {
    await supabase.from('school_events').delete().eq('id', id);
  }
  const updated = currentList.filter((e) => e.id !== id);
  setLocal(LS_KEYS.EVENTS, updated);
  return updated;
};

// Admission Enquiries CRUD
export const submitAdmissionEnquiry = async (
  enquiryData: Omit<AdmissionEnquiry, 'id' | 'status' | 'created_at'>,
  currentList: AdmissionEnquiry[]
): Promise<AdmissionEnquiry[]> => {
  let newEnquiry: AdmissionEnquiry = {
    ...enquiryData,
    id: `enq-${Date.now()}`,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('admission_enquiries')
      .insert({
        student_name: enquiryData.student_name,
        dob: enquiryData.dob,
        institution: enquiryData.institution,
        grade_applying: enquiryData.grade_applying,
        group_preference: enquiryData.group_preference,
        parent_name: enquiryData.parent_name,
        phone: enquiryData.phone,
        alt_phone: enquiryData.alt_phone,
        address: enquiryData.address,
        previous_school: enquiryData.previous_school,
        message: enquiryData.message,
        status: 'New',
      })
      .select()
      .single();
    if (!error && data) {
      newEnquiry = data;
    }
  }

  const updated = [newEnquiry, ...currentList];
  setLocal(LS_KEYS.ENQUIRIES, updated);
  return updated;
};

export const updateEnquiryStatusById = async (
  id: string,
  status: AdmissionEnquiry['status'],
  currentList: AdmissionEnquiry[]
): Promise<AdmissionEnquiry[]> => {
  const supabase = getSupabaseClient();
  if (supabase && !id.startsWith('enq-')) {
    await supabase.from('admission_enquiries').update({ status }).eq('id', id);
  }
  const updated = currentList.map((e) => (e.id === id ? { ...e, status } : e));
  setLocal(LS_KEYS.ENQUIRIES, updated);
  return updated;
};

export const deleteEnquiryById = async (
  id: string,
  currentList: AdmissionEnquiry[]
): Promise<AdmissionEnquiry[]> => {
  const supabase = getSupabaseClient();
  if (supabase && !id.startsWith('enq-')) {
    await supabase.from('admission_enquiries').delete().eq('id', id);
  }
  const updated = currentList.filter((e) => e.id !== id);
  setLocal(LS_KEYS.ENQUIRIES, updated);
  return updated;
};

// Helper to extract YouTube embed URL and thumbnail if a video is a YouTube link
export const parseVideoUrl = (
  url: string
): { isYouTube: boolean; embedUrl: string; thumbnailUrl: string } => {
  if (!url) return { isYouTube: false, embedUrl: '', thumbnailUrl: '' };
  const ytRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/i;
  const match = url.match(ytRegex);
  if (match && match[1]) {
    const videoId = match[1];
    return {
      isYouTube: true,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }
  return {
    isYouTube: false,
    embedUrl: url,
    thumbnailUrl: '',
  };
};

// Push current local data to Supabase tables
export const syncLocalDataToSupabase = async (): Promise<{ ok: boolean; message: string }> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, message: 'Supabase credentials are not configured yet.' };
  }
  try {
    const settings = getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const { error: settingsErr } = await supabase.from('school_settings').upsert({
      ...settings,
      id: 1,
      updated_at: new Date().toISOString(),
    });
    if (settingsErr) throw settingsErr;

    const gallery = getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const { count: existingGalleryCount } = await supabase
      .from('gallery_items')
      .select('*', { count: 'exact', head: true });

    if (!existingGalleryCount || existingGalleryCount === 0) {
      await supabase.from('gallery_items').insert(
        gallery.map((g) => ({
          title: g.title,
          description: g.description,
          media_type: g.media_type,
          media_url: g.media_url,
          thumbnail_url: g.thumbnail_url || '',
          category: g.category,
          is_featured: g.is_featured,
        }))
      );
    }

    return { ok: true, message: 'Successfully synced school data to Supabase Cloud!' };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.message || 'Failed to sync to Supabase. Did you run supabase/schema.sql first?',
    };
  }
};
