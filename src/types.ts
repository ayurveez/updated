
export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum ViewState {
  HOME = 'HOME',
  COURSES = 'COURSES',
  AI_CHAT = 'AI_CHAT',
  SCHEDULER = 'SCHEDULER',
  WELLNESS = 'WELLNESS',
  LOGIN = 'LOGIN',
  STUDENT_DASHBOARD = 'STUDENT_DASHBOARD',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface StudyScheduleParams {
  collegeStatus: 'attending' | 'non-attending' | 'weekend';
  proff: 'First' | 'Second' | 'Third';
  sleepTime: string;
  wakeTime: string;
}

// LMS Types
export interface MCQ {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ContentItem {
  id: string;
  type: 'video' | 'note';
  title: string;
  url: string; // YouTube ID for video, Drive/PDF link for notes
  description?: string;
}

export interface Chapter {
  id: string;
  title: string;
  content: ContentItem[];
  mcqs: MCQ[];
}

export interface Subject {
  id: string;
  title: string;
  chapters: Chapter[];
}

export interface Proff {
  id: string;
  title: string;
  isLive: boolean; // Controls if the course is "Coming Soon" or "Published"
  subjects: Subject[];
}

// Access Control Types
export interface AccessCode {
  code: string;
  studentName: string;
  type: 'PROFF' | 'SUBJECT' | 'MULTI'; // Grant access to a whole proff, specific subject, or multiple subjects
  targetId: string; // ID of the Proff, Subject, or JSON string of Subject IDs array for MULTI
  targetName: string; // Readable name for UI
  generatedAt: string;
  isUsed?: boolean; // Optional: track if logged in at least once
  isBlocked?: boolean; // New: allow admin to block access without deleting
}

export interface StudentPermissions {
  allowedProffs: string[]; // List of Proff IDs
  allowedSubjects: string[]; // List of Subject IDs
}

export const PAYMENT_LINK = "https://payments.cashfree.com/forms/Ayurveez-Bams";
export const SUPPORT_LINK = "https://whatsform.com/6Ih-pp";
