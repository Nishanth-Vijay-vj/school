export interface SchoolSettings {
  id: number;
  school_name: string;
  school_motto: string;
  school_location: string;
  logo_url: string;

  // Correspondent Details
  correspondent_name: string;
  correspondent_qualifications: string;
  correspondent_title: string;
  correspondent_phone: string;
  correspondent_photo_url: string;
  correspondent_message: string;

  // Principal Details
  principal_name: string;
  principal_qualifications: string;
  principal_title: string;
  principal_phone: string;
  principal_photo_url: string;
  principal_message: string;

  // Hero Section Image (Modifiable by Admin)
  hero_image_url: string;

  // Admission Popup Settings
  popup_enabled: boolean;
  popup_badge: string;
  popup_title: string;
  popup_subtitle: string;
  popup_admission_date: string;
  popup_banner_url: string;
  popup_image_mode: 'poster_only' | 'split_form';
}

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  category: string;
  description: string;
  image_url: string;
  location?: string;
  created_at?: string;
}

export interface TickerItem {
  id: string;
  tag: string;
  text: string;
  is_active: boolean;
  link_section: string;
  sort_order: number;
  created_at?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'Admission' | 'Academic' | 'Event' | 'Holiday' | 'Activities' | 'General';
  content: string;
  location?: string;
  is_pinned: boolean;
  attachment_url?: string;
  created_at?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  media_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  category:
    | 'Campus & Facilities'
    | 'Annual Day & Cultural'
    | 'Sports & Physical Activities'
    | 'Science & Computer Labs'
    | 'Events & Celebrations'
    | 'Student Achievements';
  is_featured: boolean;
  created_at?: string;
}

export interface AdmissionEnquiry {
  id: string;
  student_name: string;
  dob: string;
  institution: string;
  grade_applying: string;
  group_preference: string;
  parent_name: string;
  phone: string;
  alt_phone: string;
  address: string;
  previous_school: string;
  message: string;
  status: 'New' | 'Contacted' | 'Admitted' | 'Closed';
  created_at: string;
}
