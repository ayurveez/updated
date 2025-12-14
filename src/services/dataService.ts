
import { Proff, AccessCode, StudentPermissions } from "../types";

const DATA_KEY = 'ayurveez_data_v1';
const CODES_KEY = 'ayurveez_codes_v1';

// Initial Seed Data
const INITIAL_DATA: Proff[] = [
  {
    id: 'first-proff',
    title: 'First Professional',
    isLive: true,
    subjects: [
      {
        id: 'padarth-vigyan',
        title: 'Padarth Vigyan',
        chapters: [
          {
            id: 'intro-ayurveda',
            title: 'Introduction to Ayurveda',
            content: [
              { id: 'v1', type: 'video', title: 'Basic Principles', url: 'dQw4w9WgXcQ', description: 'Understanding the roots of Ayurveda' },
              { id: 'n1', type: 'note', title: 'Chapter 1 Notes', url: '#' }
            ],
            mcqs: [
              { id: 'q1', question: 'How many Padarthas are there?', options: ['Six', 'Seven', 'Five', 'Three'], correctIndex: 0 }
            ]
          }
        ]
      },
      { id: 'rachana-sharir', title: 'Rachana Sharir', chapters: [] },
      { id: 'kriya-sharir', title: 'Kriya Sharir', chapters: [] },
      { id: 'sanskrit', title: 'Sanskrit', chapters: [] },
      { id: 'samhita', title: 'Samhita Adhyayan', chapters: [] }
    ]
  },
  {
    id: 'second-proff',
    title: 'Second Professional',
    isLive: false,
    subjects: [
        { id: 'dravyaguna', title: 'Dravyaguna Vigyan', chapters: [] },
        { id: 'rasashastra', title: 'Rasa Shastra', chapters: [] },
        { id: 'rognidan', title: 'Roga Nidan', chapters: [] },
        { id: 'swasthavritta', title: 'Swasthavritta', chapters: [] }
    ]
  },
  {
    id: 'third-proff',
    title: 'Third Professional',
    isLive: false,
    subjects: [
        { id: 'kayachikitsa', title: 'Kayachikitsa', chapters: [] },
        { id: 'panchakarma', title: 'Panchakarma', chapters: [] },
        { id: 'shalya', title: 'Shalya Tantra', chapters: [] },
        { id: 'shalakya', title: 'Shalakya Tantra', chapters: [] },
        { id: 'prasuti', title: 'Prasuti & Stri Roga', chapters: [] },
        { id: 'kaumarbhritya', title: 'Kaumarbhritya', chapters: [] }
    ]
  }
];

export const dataService = {
  // Course Data Methods
  getData: (): Proff[] => {
    const stored = localStorage.getItem(DATA_KEY);
    if (!stored) {
      localStorage.setItem(DATA_KEY, JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
    return JSON.parse(stored);
  },

  saveData: (data: Proff[]) => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  },

  // Access Code Methods
  getAccessCodes: (): AccessCode[] => {
    const stored = localStorage.getItem(CODES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveAccessCode: (codeObj: AccessCode) => {
    const codes = dataService.getAccessCodes();
    codes.push(codeObj);
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
  },

  deleteAccessCode: (codeStr: string) => {
    const codes = dataService.getAccessCodes().filter(c => c.code !== codeStr);
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
  },

  toggleBlockAccessCode: (codeStr: string): AccessCode[] => {
    const codes = dataService.getAccessCodes();
    const target = codes.find(c => c.code === codeStr);
    if (target) {
      target.isBlocked = !target.isBlocked;
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    }
    return codes;
  },

  // Generate a unique code
  generateCode: (prefix: string): string => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  },

  // Verify Login with Expiry Logic
  verifyStudentCode: (codeStr: string): StudentPermissions | null => {
    const codeStrClean = codeStr.trim().toUpperCase();
    
    // DEMO BACKDOOR for testing (No Expiry)
    if (codeStrClean === 'DEMO123') {
        return { allowedProffs: ['first-proff'], allowedSubjects: [] };
    }

    const codes = dataService.getAccessCodes();
    const found = codes.find(c => c.code === codeStrClean);

    if (found) {
        // Block Check
        if (found.isBlocked) {
            return null;
        }

        // Expiry Logic: 18 Months
        const generatedDate = new Date(found.generatedAt);
        const expiryDate = new Date(generatedDate);
        expiryDate.setMonth(expiryDate.getMonth() + 18);
        
        const currentDate = new Date();

        if (currentDate > expiryDate) {
            // Code is expired
            return null; 
        }

        if (found.type === 'MULTI') {
          try {
            const subjectIds = JSON.parse(found.targetId);
            return { allowedProffs: [], allowedSubjects: subjectIds };
          } catch (e) {
            console.error("Failed to parse multi-subject targetId", e);
            return null;
          }
        }

        return {
            allowedProffs: found.type === 'PROFF' ? [found.targetId] : [],
            allowedSubjects: found.type === 'SUBJECT' ? [found.targetId] : []
        };
    }
    return null;
  },

  // Helper to extract ID from various YouTube URL formats
  extractYoutubeId: (url: string): string => {
    if (!url) return '';
    if (url.length === 11 && !url.includes('.') && !url.includes('/')) return url;
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
  },

  // Helper to convert Google Drive View URLs to Preview (Embed) URLs
  getEmbedUrl: (url: string): string => {
    if (!url) return '';
    // Check if it's a Google Drive URL
    if (url.includes('drive.google.com')) {
      // Replace /view with /preview to allow embedding
      return url.replace(/\/view.*/, '/preview');
    }
    return url;
  }
};
