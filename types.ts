export type AccreditationType = 'Unggul (A)' | 'Baik Sekali (B)' | 'Baik (C)' | 'Belum Terakreditasi';
export type EducationLevel = 'MA' | 'MTs' | 'MI' | 'RA' | 'SMK' | 'SMA' | 'SMP' | 'SD';
export type VisualStyle = 'Modern minimalis' | 'Islami elegan' | 'Ceria (PAUD/MI)' | 'Profesional (MA)' | 'Paper cut';
export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9' | '4:5' | '5:4' | '2:1';

export interface SocialMedia {
  platform: string;
  handle: string;
}

export interface PpdbFormData {
  // Data Lembaga
  schoolName: string;
  academicYear: string;
  accreditation: AccreditationType;
  tagline: string;

  // Data Informasi PPDB
  level: EducationLevel;
  tracks: string[]; // Prestasi, Reguler, etc.
  customTrack: string; // Input field for "Isi sendiri"
  requirements: string;
  days: string; // Hari
  date: string; // Tanggal
  time: string;
  location: string;
  contactPersons: string[]; // Multiple contacts
  socialMedia: SocialMedia[];

  // Gaya Visual
  visualStyle: VisualStyle;
  additionalVisualInfo: string;
  aspectRatio: AspectRatio;
}

export const INITIAL_FORM_DATA: PpdbFormData = {
  schoolName: '',
  academicYear: new Date().getFullYear().toString() + '/' + (new Date().getFullYear() + 1).toString(),
  accreditation: 'Unggul (A)',
  tagline: '',
  level: 'MA',
  tracks: [],
  customTrack: '',
  requirements: '',
  days: '',
  date: '',
  time: '',
  location: '',
  contactPersons: [''],
  socialMedia: [{ platform: 'Instagram', handle: '' }],
  visualStyle: 'Modern minimalis',
  additionalVisualInfo: '',
  aspectRatio: '3:4',
};

export const TRACK_OPTIONS = ['Prestasi', 'Reguler', 'Tahfidz', 'Kelas Olahraga', 'Isi Sendiri'];
export const SOCIAL_PLATFORMS = ['Instagram', 'TikTok', 'Website', 'YouTube', 'X (Twitter)', 'Facebook', 'WhatsApp'];