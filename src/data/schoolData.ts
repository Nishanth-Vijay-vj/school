import {
  SchoolSettings,
  TickerItem,
  NoticeItem,
  GalleryItem,
  AdmissionEnquiry,
  SchoolEvent,
} from '../types/school';

export const DEFAULT_SETTINGS: SchoolSettings = {
  id: 1,
  school_name: 'UMA Matric Higher Secondary School',
  school_motto: 'CENTRE FOR EXCELLENCE',
  school_location: 'Alwarcoil, Neyyoor Post, Kanyakumari District, Tamil Nadu – 629802',
  logo_url: '/logo.png',

  // Correspondent Details from PDF & Official Photo
  correspondent_name: 'K. Mahadevan',
  correspondent_qualifications: 'M.A., B.Ed., M.A., M.Phil.',
  correspondent_title: 'Correspondent',
  correspondent_phone: '94429 41018',
  correspondent_photo_url: '/images/correspondent.jpg',
  correspondent_message: `It gives me immense pleasure to welcome you to UMA Matric Higher Secondary School, Alwarcoil. Our school is committed to providing quality education in a safe, caring and inspiring environment where every child is encouraged to learn, grow and achieve their full potential.

We believe that education is not only about academic excellence but also about developing good character, discipline, confidence, creativity and a sense of responsibility. With the dedicated efforts of our teachers, the support of parents and the active participation of our students, we strive to nurture responsible and successful citizens for the future.

At UMA Matric Higher Secondary School, we continue to work towards creating a learning environment that prepares our students to face the challenges of the modern world with knowledge, confidence and compassion.

At UMA Matric Higher Secondary School, we envision an educational journey where every student is inspired to learn, achieve, lead and make a positive difference in society.`,

  // Principal Details from PDF & Official Photo
  principal_name: 'Mrs. P. H. Uma Devi',
  principal_qualifications: 'M.Sc., B.Ed.',
  principal_title: 'Principal',
  principal_phone: '89733 32040',
  principal_photo_url: '/images/principal.jpg',
  principal_message: `It gives me immense pleasure to welcome you to UMA Matric Higher Secondary School. Our school is committed to providing quality education in a safe, caring and encouraging environment.

We believe that education is not only about academic achievement but also about developing good character, discipline, confidence and responsibility. We encourage every student to discover their talents, develop their skills and face the future with courage and confidence.

With the dedicated efforts of our teachers, the support of parents and the enthusiasm of our students, we strive to create a strong foundation for every child’s future. Our goal is to nurture responsible, knowledgeable and compassionate individuals who can contribute positively to society.

I wish all our students a bright, successful and meaningful educational journey.`,

  // Hero Section Image (Modifiable by Admin)
  hero_image_url: '/images/students_event.jpg',

  // Admission Popup Settings
  popup_enabled: true,
  popup_badge: 'ADMISSIONS OPEN • VIJAYA DASAMI SPECIAL',
  popup_title: 'SSLC 2025–26 Toppers & Vijaya Dasami Admissions',
  popup_subtitle:
    'Admissions are open for UMA Matric Higher Secondary School (Alwarcoil) & UMA Kidz Global Horizon (Madavilagam, Kandanvilai Post). Hearty congratulations to our SSLC toppers!',
  popup_admission_date: '20 October 2026',
  popup_banner_url: '/images/sslc_toppers_poster.jpg',
  popup_image_mode: 'split_form',
};

export const DEFAULT_TICKER_ITEMS: TickerItem[] = [
  {
    id: 'ticker-1',
    tag: 'ADMISSIONS OPEN',
    text: '🌟 Vijaya Dasami Admissions – 20 October 2026: Admissions are open at UMA Matric Higher Secondary School, Alwarcoil & UMA Kidz Global Horizon, Madavilagam!',
    is_active: true,
    link_section: '#admissions',
    sort_order: 1,
  },
  {
    id: 'ticker-2',
    tag: 'ACADEMIC GROUPS',
    text: '🎓 Higher Secondary (+1 & +2) Groups Offered: Mathematics – Computer Science | Mathematics – Biology | Computer Science – Biology.',
    is_active: true,
    link_section: '#academics',
    sort_order: 2,
  },
  {
    id: 'ticker-3',
    tag: 'ENQUIRIES',
    text: '📞 Contact School Office for Admissions: Correspondent: 94429 41018 | Principal: 89733 32040 — We look forward to welcoming your child to the UMA family!',
    is_active: true,
    link_section: '#contact',
    sort_order: 3,
  },
];

export const DEFAULT_NOTICES: NoticeItem[] = [
  {
    id: 'notice-1',
    title: 'Vijaya Dasami Admissions – 20 October 2026',
    date: '2026-10-20',
    category: 'Admission',
    content:
      'Admissions are open on the auspicious occasion of Vijaya Dasami at UMA Matric Higher Secondary School (Alwarcoil, Kanyakumari District, Tamil Nadu) and UMA Kidz Global Horizon (Madavilagam, Kandanvilai Post, Kanyakumari District, Tamil Nadu). Parents are warmly invited to enrol their children and begin their educational journey with us.',
    location: 'Alwarcoil & Madavilagam Campuses',
    is_pinned: true,
  },
  {
    id: 'notice-2',
    title: 'Admissions Open for Primary, Middle, High & Higher Secondary Classes',
    date: '2026-10-13',
    category: 'Admission',
    content:
      'UMA Matric Higher Secondary School, Alwarcoil welcomes applications from parents seeking quality education in a safe, supportive and encouraging learning environment. Collect the admission application form from the school office and submit with required documents.',
    location: 'School Office, Alwarcoil, Neyyoor Post',
    is_pinned: true,
  },
  {
    id: 'notice-3',
    title: 'Higher Secondary (+1 / +2) Group Selection & Career Guidance',
    date: '2026-10-10',
    category: 'Academic',
    content:
      'Our Higher Secondary section offers three specialized groups: (1) Mathematics – Computer Science, (2) Mathematics – Biology, and (3) Computer Science – Biology. Students and parents can meet our faculty for academic counseling.',
    location: 'Higher Secondary Block',
    is_pinned: false,
  },
  {
    id: 'notice-4',
    title: 'Co-Curricular, Silambam, Yoga, Karate & Sports Activities',
    date: '2026-10-05',
    category: 'Activities',
    content:
      'Regular training sessions for Yoga, Silambam, Karate, Skating, Athletics, Volleyball, Football, Kabaddi, Drawing, Music, Dance, and Literary Competitions are conducted throughout the academic year.',
    location: 'School Playground & Activity Hall',
    is_pinned: false,
  },
];

export const DEFAULT_GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-real-1',
    title: 'Pre-KG & Primary Student Co-Curricular Day',
    description:
      'Students in their school uniform participating in outdoor learning, co-curricular activities and character building.',
    media_type: 'image',
    media_url: '/images/students_event.jpg',
    category: 'Events & Celebrations',
    is_featured: true,
  },
  {
    id: 'gal-real-2',
    title: 'SSLC 2025–26 Board Examination School Toppers',
    description:
      'Stellar academic achievement in SSLC Examination: 31 appeared, 6 secured above 450, 18 secured above 400 with 100% pass result.',
    media_type: 'image',
    media_url: '/images/sslc_toppers_poster.jpg',
    category: 'Student Achievements',
    is_featured: true,
  },
  {
    id: 'gal-1',
    title: 'Spacious & Smart Classroom Learning',
    description:
      'Interactive digital smart classrooms fostering child-centred learning, curiosity, and academic excellence.',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
    category: 'Campus & Facilities',
    is_featured: true,
  },
  {
    id: 'gal-2',
    title: 'Well-Equipped Science & Biology Laboratory',
    description:
      'Students conducting hands-on physics, chemistry, and biology experiments under expert faculty guidance.',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80',
    category: 'Science & Computer Labs',
    is_featured: true,
  },
  {
    id: 'gal-3',
    title: 'Modern Computer Science Laboratory',
    description:
      'High-tech computer lab empowering students with programming, digital literacy, and analytical problem-solving skills.',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    category: 'Science & Computer Labs',
    is_featured: true,
  },
  {
    id: 'gal-4',
    title: 'Well-Stocked School Library & Reading Hall',
    description:
      'A rich collection of academic books, encyclopedias, periodicals, and literary resources for every grade level.',
    media_type: 'image',
    media_url:
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    category: 'Campus & Facilities',
    is_featured: false,
  },
  {
    id: 'gal-7',
    title: 'Campus Tour & Holistic Education Showcase (Video)',
    description:
      'Experience the vibrant learning atmosphere, science exhibitions, and student life at UMA Matric Higher Secondary School.',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-4519-large.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    category: 'Campus & Facilities',
    is_featured: true,
  },
  {
    id: 'gal-8',
    title: 'Interactive Classroom & Student Collaboration (Video)',
    description:
      'Dedicated faculty providing individual attention, communication skills training, and interactive lessons.',
    media_type: 'video',
    media_url: 'https://assets.mixkit.co/videos/preview/mixkit-teacher-helping-kids-in-class-4738-large.mp4',
    thumbnail_url:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80',
    category: 'Events & Celebrations',
    is_featured: false,
  },
];

export const DEFAULT_EVENTS: SchoolEvent[] = [
  {
    id: 'ev-1',
    title: 'SSLC 2025–26 Board Examination Toppers Felicitation',
    date: '2026-05-20',
    category: 'Academic Achievement',
    description:
      'Hearty congratulations to our stellar SSLC toppers! Out of 31 students appeared, 6 secured above 450 marks and 18 secured above 400 marks with 100% pass result.',
    image_url: '/images/sslc_toppers_poster.jpg',
    location: 'Main Auditorium, Alwarcoil Campus',
  },
  {
    id: 'ev-2',
    title: 'Kindergarten & Primary Experiential Field Visit',
    date: '2026-08-15',
    category: 'Educational Tour',
    description:
      'Joyful outdoor experiential learning and nature exploration organized for kindergarten and primary students of UMA Matric & UMA Kidz Global Horizon.',
    image_url: '/images/students_event.jpg',
    location: 'Nature Park & Outbound Pavilion',
  },
  {
    id: 'ev-3',
    title: 'Vijaya Dasami Auspicious Admissions Opening',
    date: '2026-10-20',
    category: 'Admission',
    description:
      'Admissions are open on the auspicious occasion of Vijaya Dasami for Pre-KG to Higher Secondary (+1 & +2) at Alwarcoil & Madavilagam campuses.',
    image_url: '/images/students_event.jpg',
    location: 'UMA Matric Alwarcoil & UMA Kidz Global Horizon Madavilagam',
  },
];

export const DEFAULT_ENQUIRIES: AdmissionEnquiry[] = [];

// ============================================================================
// OFFICIAL CONTENT EXTRACTED VERBATIM FROM THE SCHOOL PDF DOCUMENT
// ============================================================================

export const ABOUT_SCHOOL_PARAGRAPHS = [
  'UMA Matric Higher Secondary School, located at Alwarcoil, Kanyakumari District, Tamil Nadu, is committed to providing quality education that nurtures knowledge, character, confidence and creativity in every learner. We strive to create a positive and inclusive learning environment where students are encouraged to explore their potential, develop essential life skills and grow into responsible citizens.',
  'Our school believes that education is not merely about academic achievement, but about shaping well-rounded individuals with strong values, discipline and a sense of responsibility. Through innovative teaching practices, dedicated teachers, co-curricular activities and individual attention, we aim to make learning meaningful, engaging and purposeful.',
  'We provide students with opportunities to discover their talents, develop leadership qualities, enhance their communication skills and face the challenges of the modern world with confidence. Our dedicated team of educators works in partnership with parents to support the holistic development and success of every child.',
];

export const SCHOOL_VISION =
  'To provide quality education that nurtures every child’s knowledge, character, creativity and confidence, enabling them to become responsible, compassionate and successful citizens of tomorrow.';

export const SCHOOL_MISSION_POINTS = [
  'To provide a safe, joyful and inclusive learning environment for every student.',
  'To develop strong academic skills along with creativity, communication and critical thinking.',
  'To encourage discipline, good values, respect and responsibility.',
  'To identify and nurture the unique talents and abilities of every child.',
  'To integrate modern teaching methods and technology into education.',
  'To promote physical fitness, cultural awareness and social responsibility.',
  'To work together with parents and the community for the overall development of our students.',
];

export const ACADEMIC_OVERVIEW = {
  intro:
    'UMA Matric Higher Secondary School, Alwarcoil, Kanyakumari District, Tamil Nadu, is committed to providing quality education that focuses on the overall development of every student.',
  programme:
    'Our academic programme aims to build a strong foundation in knowledge, communication skills, creativity, discipline and good values. We follow a structured curriculum with child-centred teaching methods to make learning meaningful, interesting and effective.',
  aim: 'Our aim is to create confident, knowledgeable and responsible learners who are well prepared for higher education and future challenges.',
  highlights: [
    'Quality education from the primary level to the higher secondary level.',
    'Well-planned and systematic teaching and learning.',
    'Experienced and dedicated teaching faculty.',
    'Regular class tests, assessments and examinations to monitor student progress.',
    'Individual attention and academic support for students.',
    'Encouragement for co-curricular and extracurricular activities.',
    'Development of English communication and essential life skills.',
    'Use of innovative teaching methods and educational technology.',
    'Special focus on discipline, moral values and personality development.',
    'Guidance and motivation to help students achieve their academic goals.',
  ],
};

export const HIGHER_SECONDARY_GROUPS = [
  {
    number: '01',
    title: 'Mathematics – Computer Science',
    code: 'Maths • Physics • Chemistry • Computer Science',
    description:
      'A combination of Mathematics and Computer Science that develops analytical thinking, problem-solving skills and computer knowledge.',
    careerPaths: 'Engineering, Software & AI, Data Science, Architecture, Pure Sciences',
    color: 'from-blue-600 to-indigo-700',
  },
  {
    number: '02',
    title: 'Mathematics – Biology',
    code: 'Maths • Physics • Chemistry • Biology',
    description:
      'A balanced combination of Mathematics and Biology, providing students with a strong foundation in both mathematical and life sciences.',
    careerPaths: 'Medicine (MBBS/BDS), Engineering, Biotechnology, Agriculture, Research',
    color: 'from-emerald-600 to-teal-700',
  },
  {
    number: '03',
    title: 'Computer Science – Biology',
    code: 'Computer Science • Physics • Chemistry • Biology',
    description:
      'An interdisciplinary group combining Computer Science and Biology, encouraging students to explore technology and life sciences.',
    careerPaths: 'Medicine, Bioinformatics, Nursing, Allied Health, Pharmacy, Life Sciences',
    color: 'from-purple-600 to-indigo-800',
  },
];

export const SCHOOL_FACILITIES = [
  {
    title: 'Spacious & Well-Ventilated Classrooms',
    description: 'Bright, airy, and ergonomically designed classrooms for comfortable learning.',
    icon: 'Building2',
  },
  {
    title: 'Well-Equipped Science Laboratories',
    description: 'Modern Physics, Chemistry, and Biology labs for practical experimentation.',
    icon: 'FlaskConical',
  },
  {
    title: 'Computer Laboratory',
    description: 'Updated computer systems providing hands-on programming and digital training.',
    icon: 'Monitor',
  },
  {
    title: 'Smart Classroom / Digital Learning',
    description: 'Audio-visual and interactive smart boards for engaging multimedia lessons.',
    icon: 'Tv',
  },
  {
    title: 'Well-Stocked Library',
    description: 'Diverse collection of books, reference materials, and reading resources.',
    icon: 'BookOpen',
  },
  {
    title: 'Mathematics Learning Resources',
    description: 'Specialized mathematical kits and tools to make abstract concepts intuitive.',
    icon: 'Calculator',
  },
  {
    title: 'Playground & Sports Facilities',
    description: 'Expansive sports ground for track events, team sports, and physical education.',
    icon: 'Trophy',
  },
  {
    title: 'Indoor & Outdoor Games',
    description: 'Dedicated facilities for athletics, volleyball, football, kabaddi, and indoor games.',
    icon: 'Gamepad2',
  },
  {
    title: 'Clean Drinking Water Facilities',
    description: 'Purified and safe RO drinking water stations accessible across campus.',
    icon: 'Droplets',
  },
  {
    title: 'Hygienic Sanitation Facilities',
    description: 'Well-maintained, clean, and separate washroom facilities on every floor.',
    icon: 'Sparkles',
  },
  {
    title: 'Safe & Secure School Campus',
    description: 'Monitored, disciplined, and child-safe campus environment.',
    icon: 'ShieldCheck',
  },
  {
    title: 'Co-Curricular & Cultural Facilities',
    description: 'Dedicated spaces for music, dance, drama, yoga, Silambam, and fine arts.',
    icon: 'Music',
  },
  {
    title: 'Transportation Facilities',
    description: 'Safe and reliable school bus network covering surrounding villages and towns.',
    icon: 'Bus',
  },
  {
    title: 'First-Aid & Basic Health Support',
    description: 'Immediate medical care and health monitoring for student safety.',
    icon: 'HeartPulse',
  },
  {
    title: 'Dedicated & Experienced Faculty',
    description: 'Caring mentors committed to individual attention and holistic growth.',
    icon: 'Users',
  },
];

export const STUDENT_ACTIVITIES_LIST = [
  'Academic and subject-based activities',
  'Drawing, painting and creative activities',
  'Speech, essay writing and elocution competitions',
  'Quiz and literary activities',
  'Cultural programmes and celebrations',
  'Music, dance and drama',
  'Yoga, Silambam and other physical activities',
  'Sports and games',
  'Science and computer-related activities',
  'School assemblies and awareness programmes',
  'Community and social responsibility activities',
];

export const EVENTS_AND_ACTIVITIES_CATEGORIES = {
  schoolEvents: [
    'School Annual Day',
    'Independence Day',
    'Republic Day',
    'Teachers’ Day',
    'Children’s Day',
    'Kamarajar Day',
    'Sports Day',
    'School Foundation Day',
    'Educational and Awareness Programmes',
  ],
  coCurricular: [
    'Drawing and Painting',
    'Elocution and Essay Writing',
    'Quiz Competitions',
    'Debates and Literary Activities',
    'Science and Mathematics Activities',
    'Cultural Programmes',
    'Music, Dance and Drama',
  ],
  sportsAndPhysical: [
    'Athletics',
    'Volleyball',
    'Football',
    'Kabaddi',
    'Yoga',
    'Silambam',
    'Karate',
    'Skating',
  ],
  educationalActivities: [
    'Educational Tours',
    'Field Visits',
    'Special Assemblies',
    'Competitions and Exhibitions',
    'Career Guidance Programmes',
    'Environmental Awareness Activities',
  ],
};

export const ADMISSION_DETAILS = {
  intro:
    'UMA Matric Higher Secondary School, Alwarcoil, welcomes applications from parents seeking quality education in a safe, supportive and encouraging learning environment. We provide education with a balanced focus on academic excellence, discipline, character development, communication skills and co-curricular activities.',
  classesOffered: [
    {
      level: 'Primary Classes',
      subtitle: 'Foundational Literacy, Numeracy, Creativity & Joyful Learning',
      badge: 'Primary Wing',
    },
    {
      level: 'Middle School',
      subtitle: 'Core Subject Mastery, Communication Skills & Co-Curricular Exploration',
      badge: 'Middle Wing',
    },
    {
      level: 'High School',
      subtitle: 'Board Exam Preparation, Analytical Thinking & Character Building',
      badge: 'High School',
    },
    {
      level: 'Higher Secondary (+1 & +2)',
      subtitle: 'Maths-CS • Maths-Biology • CS-Biology with Career Guidance',
      badge: 'Hr. Sec. Wing',
    },
  ],
  processSteps: [
    'Collect the admission application form from the school office (or submit an online enquiry here).',
    'Submit the duly completed application form along with the required documents.',
    'The school will verify the submitted details.',
    'Admission will be confirmed based on eligibility, availability of seats and school admission procedures.',
    'Parents will be informed about the next steps after the application is processed.',
  ],
  documentsRequired: [
    "Student's Birth Certificate",
    'Previous School Transfer Certificate, wherever applicable',
    'Previous Class Mark Sheet / Progress Report',
    'Passport-size photographs',
    'Aadhaar / other required identification document',
    'Community Certificate, wherever applicable',
    'Other documents as requested by the school',
  ],
  parentNote:
    'Parents are requested to contact the school office for current admission availability, fee details, required documents, school timings and other admission-related information.',
  sisterSchool: {
    name: 'UMA Kidz Global Horizon',
    location: 'Madavilagam, Kandanvilai Post, Kanyakumari District, Tamil Nadu',
    occasion: 'Vijaya Dasami Admissions – 20 October 2026',
  },
};
