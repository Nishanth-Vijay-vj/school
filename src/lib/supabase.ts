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

export const normalizeSupabaseUrl = (rawUrl: string) =>
  rawUrl.trim().replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '');

// Allow runtime override via Admin Panel settings
export const getRuntimeCredentials = () => {
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
    supabaseInstance = createClient(url, key, {
      auth: { persistSession: false },
    });
  }
  return supabaseInstance;
};

export const isSupabaseConfigured = (): boolean => {
  return getRuntimeCredentials().isValid;
};

export const saveRuntimeSupabaseCredentials = (url: string, key: string) => {
  localStorage.setItem('uma_supabase_url', normalizeSupabaseUrl(url));
  localStorage.setItem('uma_supabase_anon_key', key.trim());
  supabaseInstance = null;
};

export const clearRuntimeSupabaseCredentials = () => {
  localStorage.removeItem('uma_supabase_url');
  localStorage.removeItem('uma_supabase_anon_key');
  supabaseInstance = null;
};

// Health Status Diagnostics
export interface SupabaseHealthStatus {
  status: 'connected' | 'paused_or_unreachable' | 'tables_missing' | 'unconfigured';
  message: string;
  details?: string;
  url?: string;
  checkedAt: string;
}

export const checkSupabaseHealth = async (): Promise<SupabaseHealthStatus> => {
  const { url, key, isValid } = getRuntimeCredentials();
  if (!isValid || !url || !key) {
    return {
      status: 'unconfigured',
      message: 'No Supabase credentials configured. Running in Local Storage preview mode.',
      checkedAt: new Date().toISOString(),
    };
  }

  try {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return {
        status: 'unconfigured',
        message: 'Could not initialize Supabase client.',
        url,
        checkedAt: new Date().toISOString(),
      };
    }

    // Attempt query with 6-second timeout
    const queryPromise = supabase.from('school_settings').select('id').limit(1);
    const timeoutPromise = new Promise<{ data: null; error: { message: string } }>((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out after 6 seconds')), 6000)
    );

    const { error } = (await Promise.race([queryPromise, timeoutPromise])) as any;

    if (error) {
      if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
        return {
          status: 'tables_missing',
          message:
            'Connected to Supabase, but database tables do not exist yet. Please run supabase/schema.sql in the Supabase SQL Editor.',
          details: error.message,
          url,
          checkedAt: new Date().toISOString(),
        };
      }
      return {
        status: 'paused_or_unreachable',
        message: `Database query failed: ${error.message}`,
        details: error.details || error.hint || error.code || error.message,
        url,
        checkedAt: new Date().toISOString(),
      };
    }

    return {
      status: 'connected',
      message: 'Connected to Supabase PostgreSQL database and tables are ready!',
      url,
      checkedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    const isPausedOrDns =
      errMsg.includes('ENOTFOUND') ||
      errMsg.includes('Failed to fetch') ||
      errMsg.includes('NetworkError') ||
      errMsg.includes('Load failed') ||
      errMsg.includes('timed out');

    return {
      status: 'paused_or_unreachable',
      message: isPausedOrDns
        ? 'Supabase project is unreachable (DNS ENOTFOUND). The project may be paused in your Supabase Dashboard.'
        : `Connection error: ${errMsg}`,
      details: errMsg,
      url,
      checkedAt: new Date().toISOString(),
    };
  }
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
    try {
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
    } catch (err) {
      console.warn('Supabase storage upload exception:', err);
    }
  }

  // Fallback for local preview mode
  if (file.type.startsWith('image/')) {
    return await compressImageToDataUrl(file, folder === 'portraits' ? 700 : 1200);
  }
  // For video files in local mode without Supabase
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
  connectionStatus: SupabaseHealthStatus['status'];
  errorMessage?: string;
}> => {
  const { isValid } = getRuntimeCredentials();
  if (!isValid) {
    return {
      settings: getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS),
      tickerItems: getLocal(LS_KEYS.TICKER, DEFAULT_TICKER_ITEMS),
      notices: getLocal(LS_KEYS.NOTICES, DEFAULT_NOTICES),
      gallery: getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS),
      enquiries: getLocal(LS_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES),
      events: getLocal(LS_KEYS.EVENTS, DEFAULT_EVENTS),
      source: 'local',
      connectionStatus: 'unconfigured',
    };
  }

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      // 6-second timeout so page never freezes if DNS is offline
      const queryPromise = Promise.all([
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

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Database connection timed out after 6 seconds')), 6000)
      );

      const [settingsRes, tickerRes, noticesRes, galleryRes, enquiriesRes, eventsRes] =
        await Promise.race([queryPromise, timeoutPromise]);

      if (settingsRes.error) {
        if (settingsRes.error.code === '42P01') {
          return {
            settings: getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS),
            tickerItems: getLocal(LS_KEYS.TICKER, DEFAULT_TICKER_ITEMS),
            notices: getLocal(LS_KEYS.NOTICES, DEFAULT_NOTICES),
            gallery: getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS),
            enquiries: getLocal(LS_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES),
            events: getLocal(LS_KEYS.EVENTS, DEFAULT_EVENTS),
            source: 'local',
            connectionStatus: 'tables_missing',
            errorMessage: 'Tables missing. Run supabase/schema.sql in Supabase SQL Editor.',
          };
        }
        throw settingsRes.error;
      }

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

      const events: SchoolEvent[] =
        eventsRes.data && eventsRes.data.length > 0
          ? eventsRes.data
          : getLocal(LS_KEYS.EVENTS, DEFAULT_EVENTS);

      // In Supabase mode, show real enquiries from the DB
      const enquiries: AdmissionEnquiry[] =
        enquiriesRes.data !== null && enquiriesRes.data !== undefined
          ? enquiriesRes.data
          : getLocal<AdmissionEnquiry[]>(LS_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES);

      // Cache as offline fallback
      setLocal(LS_KEYS.SETTINGS, settings);
      setLocal(LS_KEYS.TICKER, tickerItems);
      setLocal(LS_KEYS.NOTICES, notices);
      setLocal(LS_KEYS.GALLERY, gallery);
      setLocal(LS_KEYS.EVENTS, events);
      setLocal(LS_KEYS.ENQUIRIES, enquiries);

      return {
        settings,
        tickerItems,
        notices,
        gallery,
        enquiries,
        events,
        source: 'supabase',
        connectionStatus: 'connected',
      };
    } catch (err: any) {
      const errMsg = err?.message || String(err);
      console.warn('Could not fetch from Supabase, using local fallback:', errMsg);
      return {
        settings: getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS),
        tickerItems: getLocal(LS_KEYS.TICKER, DEFAULT_TICKER_ITEMS),
        notices: getLocal(LS_KEYS.NOTICES, DEFAULT_NOTICES),
        gallery: getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS),
        enquiries: getLocal(LS_KEYS.ENQUIRIES, DEFAULT_ENQUIRIES),
        events: getLocal(LS_KEYS.EVENTS, DEFAULT_EVENTS),
        source: 'local',
        connectionStatus: 'paused_or_unreachable',
        errorMessage: errMsg,
      };
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
    connectionStatus: 'unconfigured',
  };
};

export interface MutationResult<T> {
  data: T;
  syncedToSupabase: boolean;
  error?: string;
}

// Update School Settings
export const updateSchoolSettings = async (
  settings: SchoolSettings
): Promise<MutationResult<SchoolSettings>> => {
  const updated = { ...settings, id: 1 };
  setLocal(LS_KEYS.SETTINGS, updated);

  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('school_settings').upsert({
        ...updated,
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error('Supabase settings upsert error:', error.message);
        return { data: updated, syncedToSupabase: false, error: error.message };
      }
      return { data: updated, syncedToSupabase: true };
    } catch (err: any) {
      const errMsg = err?.message || 'Database unreachable';
      console.error('Supabase settings exception:', errMsg);
      return { data: updated, syncedToSupabase: false, error: errMsg };
    }
  }
  return {
    data: updated,
    syncedToSupabase: false,
    error: 'Supabase credentials not configured. Saved in local storage only.',
  };
};

// Ticker CRUD
export const saveTickerItemsList = async (
  items: TickerItem[]
): Promise<MutationResult<TickerItem[]>> => {
  setLocal(LS_KEYS.TICKER, items);
  return { data: items, syncedToSupabase: false };
};

export const addOrUpdateTickerItem = async (
  item: TickerItem,
  currentList: TickerItem[]
): Promise<MutationResult<TickerItem[]>> => {
  const supabase = getSupabaseClient();
  let updatedList: TickerItem[];
  const exists = currentList.some((i) => i.id === item.id);
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase) {
    try {
      const payload = {
        tag: item.tag,
        text: item.text,
        is_active: item.is_active,
        link_section: item.link_section,
        sort_order: item.sort_order,
      };
      if (exists && !item.id.startsWith('ticker-')) {
        const { error } = await supabase.from('ticker_items').update(payload).eq('id', item.id);
        if (error) errorMsg = error.message;
        else synced = true;
      } else {
        const { data, error } = await supabase.from('ticker_items').insert(payload).select().single();
        if (error) errorMsg = error.message;
        else if (data) {
          item = data;
          synced = true;
        }
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else {
    errorMsg = 'Supabase not configured';
  }

  if (exists) {
    updatedList = currentList.map((i) => (i.id === item.id ? item : i));
  } else {
    updatedList = [...currentList, item];
  }
  setLocal(LS_KEYS.TICKER, updatedList);
  return { data: updatedList, syncedToSupabase: synced, error: errorMsg };
};

export const deleteTickerItemById = async (
  id: string,
  currentList: TickerItem[]
): Promise<MutationResult<TickerItem[]>> => {
  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase && !id.startsWith('ticker-')) {
    try {
      const { error } = await supabase.from('ticker_items').delete().eq('id', id);
      if (error) errorMsg = error.message;
      else synced = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else if (!supabase) {
    errorMsg = 'Supabase not configured';
  } else {
    synced = true; // Local item removed
  }

  const updated = currentList.filter((i) => i.id !== id);
  setLocal(LS_KEYS.TICKER, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

// Notices CRUD
export const addOrUpdateNotice = async (
  notice: NoticeItem,
  currentList: NoticeItem[]
): Promise<MutationResult<NoticeItem[]>> => {
  const supabase = getSupabaseClient();
  const exists = currentList.some((n) => n.id === notice.id);
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase) {
    try {
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
        const { error } = await supabase.from('notices').update(payload).eq('id', notice.id);
        if (error) errorMsg = error.message;
        else synced = true;
      } else {
        const { data, error } = await supabase.from('notices').insert(payload).select().single();
        if (error) errorMsg = error.message;
        else if (data) {
          notice = data;
          synced = true;
        }
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else {
    errorMsg = 'Supabase not configured';
  }

  const updated = exists
    ? currentList.map((n) => (n.id === notice.id ? notice : n))
    : [notice, ...currentList];
  setLocal(LS_KEYS.NOTICES, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

export const deleteNoticeById = async (
  id: string,
  currentList: NoticeItem[]
): Promise<MutationResult<NoticeItem[]>> => {
  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase && !id.startsWith('notice-')) {
    try {
      const { error } = await supabase.from('notices').delete().eq('id', id);
      if (error) errorMsg = error.message;
      else synced = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else if (!supabase) {
    errorMsg = 'Supabase not configured';
  } else {
    synced = true;
  }

  const updated = currentList.filter((n) => n.id !== id);
  setLocal(LS_KEYS.NOTICES, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

// Gallery CRUD
export const addOrUpdateGalleryItem = async (
  item: GalleryItem,
  currentList: GalleryItem[]
): Promise<MutationResult<GalleryItem[]>> => {
  const supabase = getSupabaseClient();
  const exists = currentList.some((g) => g.id === item.id);
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase) {
    try {
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
        const { error } = await supabase.from('gallery_items').update(payload).eq('id', item.id);
        if (error) errorMsg = error.message;
        else synced = true;
      } else {
        const { data, error } = await supabase
          .from('gallery_items')
          .insert(payload)
          .select()
          .single();
        if (error) errorMsg = error.message;
        else if (data) {
          item = data;
          synced = true;
        }
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else {
    errorMsg = 'Supabase not configured';
  }

  const updated = exists
    ? currentList.map((g) => (g.id === item.id ? item : g))
    : [item, ...currentList];
  setLocal(LS_KEYS.GALLERY, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

export const deleteGalleryItemById = async (
  id: string,
  currentList: GalleryItem[]
): Promise<MutationResult<GalleryItem[]>> => {
  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase && !id.startsWith('gal-')) {
    try {
      const { error } = await supabase.from('gallery_items').delete().eq('id', id);
      if (error) errorMsg = error.message;
      else synced = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else if (!supabase) {
    errorMsg = 'Supabase not configured';
  } else {
    synced = true;
  }

  const updated = currentList.filter((g) => g.id !== id);
  setLocal(LS_KEYS.GALLERY, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

// Events CRUD
export const addOrUpdateEvent = async (
  event: SchoolEvent,
  currentList: SchoolEvent[]
): Promise<MutationResult<SchoolEvent[]>> => {
  const supabase = getSupabaseClient();
  const exists = currentList.some((e) => e.id === event.id);
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase) {
    try {
      const payload = {
        title: event.title,
        date: event.date,
        category: event.category,
        description: event.description,
        image_url: event.image_url || '',
        location: event.location || '',
      };
      if (exists && !event.id.startsWith('ev-')) {
        const { error } = await supabase.from('school_events').update(payload).eq('id', event.id);
        if (error) errorMsg = error.message;
        else synced = true;
      } else {
        const { data, error } = await supabase
          .from('school_events')
          .insert(payload)
          .select()
          .single();
        if (error) errorMsg = error.message;
        else if (data) {
          event = data;
          synced = true;
        }
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else {
    errorMsg = 'Supabase not configured';
  }

  const updated = exists
    ? currentList.map((e) => (e.id === event.id ? event : e))
    : [event, ...currentList];
  setLocal(LS_KEYS.EVENTS, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

export const deleteEventById = async (
  id: string,
  currentList: SchoolEvent[]
): Promise<MutationResult<SchoolEvent[]>> => {
  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase && !id.startsWith('ev-')) {
    try {
      const { error } = await supabase.from('school_events').delete().eq('id', id);
      if (error) errorMsg = error.message;
      else synced = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else if (!supabase) {
    errorMsg = 'Supabase not configured';
  } else {
    synced = true;
  }

  const updated = currentList.filter((e) => e.id !== id);
  setLocal(LS_KEYS.EVENTS, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

// Admission Enquiries CRUD
export const submitAdmissionEnquiry = async (
  enquiryData: Omit<AdmissionEnquiry, 'id' | 'status' | 'created_at'>,
  currentList: AdmissionEnquiry[]
): Promise<MutationResult<AdmissionEnquiry[]>> => {
  let newEnquiry: AdmissionEnquiry = {
    ...enquiryData,
    id: `enq-${Date.now()}`,
    status: 'New',
    created_at: new Date().toISOString(),
  };

  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase) {
    try {
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

      if (error) {
        console.error('Supabase admission insert error:', error.message);
        errorMsg = error.message;
      } else if (data) {
        newEnquiry = data;
        synced = true;
      }
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
      console.error('Supabase admission insert exception:', errorMsg);
    }
  } else {
    errorMsg = 'Supabase not configured. Stored locally in browser.';
  }

  const updated = [newEnquiry, ...currentList];
  setLocal(LS_KEYS.ENQUIRIES, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

export const updateEnquiryStatusById = async (
  id: string,
  status: AdmissionEnquiry['status'],
  currentList: AdmissionEnquiry[]
): Promise<MutationResult<AdmissionEnquiry[]>> => {
  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase && !id.startsWith('enq-')) {
    try {
      const { error } = await supabase
        .from('admission_enquiries')
        .update({ status })
        .eq('id', id);
      if (error) errorMsg = error.message;
      else synced = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else if (!supabase) {
    errorMsg = 'Supabase not configured';
  } else {
    synced = true;
  }

  const updated = currentList.map((e) => (e.id === id ? { ...e, status } : e));
  setLocal(LS_KEYS.ENQUIRIES, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

export const deleteEnquiryById = async (
  id: string,
  currentList: AdmissionEnquiry[]
): Promise<MutationResult<AdmissionEnquiry[]>> => {
  const supabase = getSupabaseClient();
  let synced = false;
  let errorMsg: string | undefined;

  if (supabase && !id.startsWith('enq-')) {
    try {
      const { error } = await supabase.from('admission_enquiries').delete().eq('id', id);
      if (error) errorMsg = error.message;
      else synced = true;
    } catch (err: any) {
      errorMsg = err?.message || 'Database unreachable';
    }
  } else if (!supabase) {
    errorMsg = 'Supabase not configured';
  } else {
    synced = true;
  }

  const updated = currentList.filter((e) => e.id !== id);
  setLocal(LS_KEYS.ENQUIRIES, updated);
  return { data: updated, syncedToSupabase: synced, error: errorMsg };
};

// Helper to extract YouTube embed URL and thumbnail
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
export const syncLocalDataToSupabase = async (): Promise<{
  ok: boolean;
  message: string;
  details?: Record<string, string>;
}> => {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { ok: false, message: 'Supabase credentials are not configured.' };
  }

  const details: Record<string, string> = {};

  try {
    // 1. Sync School Settings
    const settings = getLocal(LS_KEYS.SETTINGS, DEFAULT_SETTINGS);
    const { error: settingsErr } = await supabase.from('school_settings').upsert({
      ...settings,
      id: 1,
      updated_at: new Date().toISOString(),
    });
    if (settingsErr) throw new Error(`Settings table error: ${settingsErr.message}`);
    details['settings'] = 'Settings synced successfully';

    // 2. Sync School Events
    const events = getLocal(LS_KEYS.EVENTS, DEFAULT_EVENTS);
    const { data: dbEvents, error: evFetchErr } = await supabase
      .from('school_events')
      .select('id, title');
    if (!evFetchErr) {
      const existingTitles = new Set((dbEvents || []).map((e: any) => e.title));
      const toInsert = events
        .filter((e) => !existingTitles.has(e.title))
        .map((e) => ({
          title: e.title,
          date: e.date,
          category: e.category,
          description: e.description,
          image_url: e.image_url || '',
          location: e.location || '',
        }));
      if (toInsert.length > 0) {
        const { error: evInsertErr } = await supabase.from('school_events').insert(toInsert);
        if (evInsertErr) console.warn('Events sync warning:', evInsertErr);
        details['events'] = `Inserted ${toInsert.length} new events`;
      } else {
        details['events'] = 'Events already up-to-date';
      }
    }

    // 3. Sync Gallery Items
    const gallery = getLocal(LS_KEYS.GALLERY, DEFAULT_GALLERY_ITEMS);
    const { data: dbGallery, error: galFetchErr } = await supabase
      .from('gallery_items')
      .select('id, title');
    if (!galFetchErr) {
      const existingTitles = new Set((dbGallery || []).map((g: any) => g.title));
      const toInsert = gallery
        .filter((g) => !existingTitles.has(g.title))
        .map((g) => ({
          title: g.title,
          description: g.description,
          media_type: g.media_type,
          media_url: g.media_url,
          thumbnail_url: g.thumbnail_url || '',
          category: g.category,
          is_featured: g.is_featured,
        }));
      if (toInsert.length > 0) {
        const { error: galInsertErr } = await supabase.from('gallery_items').insert(toInsert);
        if (galInsertErr) console.warn('Gallery sync warning:', galInsertErr);
        details['gallery'] = `Inserted ${toInsert.length} new gallery items`;
      } else {
        details['gallery'] = 'Gallery already up-to-date';
      }
    }

    // 4. Sync Notices
    const notices = getLocal(LS_KEYS.NOTICES, DEFAULT_NOTICES);
    const { data: dbNotices, error: notFetchErr } = await supabase
      .from('notices')
      .select('id, title');
    if (!notFetchErr) {
      const existingTitles = new Set((dbNotices || []).map((n: any) => n.title));
      const toInsert = notices
        .filter((n) => !existingTitles.has(n.title))
        .map((n) => ({
          title: n.title,
          date: n.date,
          category: n.category,
          content: n.content,
          location: n.location || '',
          is_pinned: n.is_pinned,
          attachment_url: n.attachment_url || '',
        }));
      if (toInsert.length > 0) {
        const { error: notInsertErr } = await supabase.from('notices').insert(toInsert);
        if (notInsertErr) console.warn('Notices sync warning:', notInsertErr);
        details['notices'] = `Inserted ${toInsert.length} new notices`;
      } else {
        details['notices'] = 'Notices already up-to-date';
      }
    }

    // 5. Sync Ticker Items
    const ticker = getLocal(LS_KEYS.TICKER, DEFAULT_TICKER_ITEMS);
    const { data: dbTicker, error: tickFetchErr } = await supabase
      .from('ticker_items')
      .select('id, text');
    if (!tickFetchErr) {
      const existingTexts = new Set((dbTicker || []).map((t: any) => t.text));
      const toInsert = ticker
        .filter((t) => !existingTexts.has(t.text))
        .map((t) => ({
          tag: t.tag,
          text: t.text,
          is_active: t.is_active,
          link_section: t.link_section,
          sort_order: t.sort_order,
        }));
      if (toInsert.length > 0) {
        const { error: tickInsertErr } = await supabase.from('ticker_items').insert(toInsert);
        if (tickInsertErr) console.warn('Ticker sync warning:', tickInsertErr);
        details['ticker'] = `Inserted ${toInsert.length} new ticker items`;
      } else {
        details['ticker'] = 'Ticker items already up-to-date';
      }
    }

    return {
      ok: true,
      message: '✅ Successfully synced school settings, events, gallery, notices, and ticker to Supabase Cloud Database!',
      details,
    };
  } catch (err: any) {
    const errMsg = err?.message || String(err);
    return {
      ok: false,
      message: `Failed to sync: ${errMsg}. Make sure project is active and schema.sql has been run.`,
      details,
    };
  }
};
