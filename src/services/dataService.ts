
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
  getAccessCodes: async (): Promise<AccessCode[]> => {
    try {
      // quick health check to detect if server is reachable
      const health = await fetch('/api/codes?health=1');
      if (!health.ok) throw new Error('Server health check failed');

      const res = await fetch('/api/codes');
      if (res.ok) {
        const json = await res.json();
          if (json && json.data) {
            // Normalize server rows to AccessCode shape (camelCase)
            // clear any local codes now that server is reachable and return server copy
            try { localStorage.removeItem(CODES_KEY); (window as any).__AYURVEZ_SERVER_DOWN = false; } catch {}
            return (json.data as any[]).map(r => {
              const meta = r.metadata || {};
              const isHashed = r.is_hashed || meta.isHashed || false;
              const isEncrypted = r.is_encrypted || false;
              const codeVal = r.code ? String(r.code).toUpperCase() : (isHashed ? 'HASHED' : (meta.code || '').toUpperCase());
              return {
                id: r.id,
                code: codeVal,
                studentName: meta.studentName || meta.student_name || '',
                type: meta.type || 'PROFF',
                targetId: meta.targetId || meta.target_id || '' ,
                targetName: meta.targetName || meta.target_name || meta.targetName || '',
                generatedAt: r.assigned_at || meta.generatedAt || new Date().toISOString(),
                isUsed: meta.isUsed || false,
                isBlocked: r.is_blocked || meta.isBlocked || false,
                isEncrypted: isEncrypted
              } as AccessCode;
            });
        }
      }
    } catch (e) {
      console.warn('Failed to fetch access codes from server, falling back to localStorage', e);
      try { (window as any).__AYURVEZ_SERVER_DOWN = true; } catch {}
    }
    const stored = localStorage.getItem(CODES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveAccessCode: async (codeObj: AccessCode): Promise<{ data?: AccessCode; plainCode?: string } | null> => {
    try {
      // Send the plaintext only as `plainCode` so server can hash it, but avoid storing plaintext in metadata
      const metaClean = Object.assign({}, codeObj) as any;
      if (metaClean.code) delete metaClean.code;
      const payload = {
        plainCode: codeObj.code,
        metadata: metaClean,
        expiresAt: null
      };
      const res = await fetch('/api/codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        const json = await res.json();
        // Server returns { data, plainCode }
        if (json && json.data) return { data: json.data, plainCode: json.plainCode } as any;
      }
    } catch (e) {
      console.warn('Failed to save access code to server, falling back to localStorage', e);
      try { (window as any).__AYURVEZ_SERVER_DOWN = true; } catch {}
    }

    // Fallback to localStorage for offline/demo usage
    const codes = dataService.getAccessCodesSync();
    codes.push(codeObj);
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    // Return shape similar to server response so callers (UI) can show the generated code
    return { data: codeObj, plainCode: codeObj.code };
  },

  deleteAccessCode: async (codeStr: string) => {
    try {
      await fetch(`/api/codes?code=${encodeURIComponent(codeStr)}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to delete code on server, falling back to localStorage', e);
      const codes = dataService.getAccessCodesSync().filter(c => c.code !== codeStr);
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    }
  },

  toggleBlockAccessCode: async (codeStr: string): Promise<AccessCode[]> => {
    try {
      const res = await fetch('/api/codes/toggle-block', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: codeStr }) });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          // Return fresh list from server
          const list = await dataService.getAccessCodes();
          return list;
        }
      }
    } catch (e) {
      console.warn('Failed to toggle block on server, falling back to localStorage', e);
      const codes = dataService.getAccessCodesSync();
      const target = codes.find(c => c.code === codeStr);
      if (target) target.isBlocked = !target.isBlocked;
      localStorage.setItem(CODES_KEY, JSON.stringify(codes));
      return codes;
    }
    return dataService.getAccessCodesSync();
  },

  // Synchronous helper for local-only fallback
  getAccessCodesSync: (): AccessCode[] => {
    const stored = localStorage.getItem(CODES_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  // Import local codes (read from localStorage) to server (hashed-only). Returns import summary.
  importLocalCodesToServer: async (options?: { clearAfter?: boolean }): Promise<{ imported: number; failed: number; errors: any[] }> => {
    const local = dataService.getAccessCodesSync();
    let imported = 0, failed = 0;
    const errors: any[] = [];
    for (const c of local) {
      try {
        const meta = Object.assign({}, c) as any;
        if (meta.code) delete meta.code; // ensure plaintext isn't stored in metadata
        const payload = { plainCode: c.code, metadata: meta };
        const res = await fetch('/api/codes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (res.ok) imported += 1;
        else {
          // treat duplicate insert (conflict) as already-imported
          if (res.status === 409) { imported += 1; }
          else { failed += 1; const txt = await res.text(); errors.push({ code: c.code, status: res.status, body: txt }); }
        }
      } catch (e) {
        failed += 1; errors.push({ code: c.code, error: String(e) });
      }
    }
    if (options?.clearAfter) {
      localStorage.removeItem(CODES_KEY);
    }
    // If we successfully imported anything, clear the server-down flag
    try { if (imported > 0) (window as any).__AYURVEZ_SERVER_DOWN = false; } catch {}
    return { imported, failed, errors };
  },

  // Realtime subscription to assigned_codes table via Supabase (client-side)
  _realtimeSub: null as any,
  startRealtime: (onChange: () => void) => {
    try {
      const { getSupabaseClient } = require('./supabaseClient');
      const sup = getSupabaseClient();
      if (!sup) return null;
      const channel = sup.channel('public:assigned_codes').on('postgres_changes', { event: '*', schema: 'public', table: 'assigned_codes' }, (payload: any) => {
        try { (window as any).__AYURVEZ_SERVER_DOWN = false; } catch {}
        onChange();
      }).subscribe();
      dataService._realtimeSub = channel;
      return channel;
    } catch (e) {
      console.warn('Realtime subscription unavailable', e);
      return null;
    }
  },
  stopRealtime: () => {
    try {
      if (dataService._realtimeSub && dataService._realtimeSub.unsubscribe) dataService._realtimeSub.unsubscribe();
      dataService._realtimeSub = null;
    } catch (e) { console.warn('Failed to stop realtime', e); }
  },

  // Remove locally stored access codes
  clearLocalCodes: (): boolean => {
    try {
      localStorage.removeItem(CODES_KEY);
      return true;
    } catch (e) {
      console.error('Failed to clear local codes:', e);
      return false;
    }
  },

  // Generate a unique code
  generateCode: (prefix: string): string => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}-${random}`;
  },

  // Verify Login with Expiry Logic
  verifyStudentCode: async (codeStr: string): Promise<StudentPermissions | null> => {
    const codeStrClean = codeStr.trim();

    // DEMO BACKDOOR for testing (No Expiry)
    if (codeStrClean.toUpperCase() === 'DEMO123') {
        return { allowedProffs: ['first-proff'], allowedSubjects: [] };
    }

    try {
      const res = await fetch('/api/codes/validate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: codeStr }) });
      if (res.ok) {
        const json = await res.json();
        if (json && json.ok && json.row) {
          const found = json.row as any;
          if (found.is_blocked) return null;
          if (found.expires_at) {
            const expiryDate = new Date(found.expires_at);
            if (new Date() > expiryDate) return null;
          }

          if (found.metadata && found.type === 'MULTI') {
            try {
              const subjectIds = JSON.parse(found.metadata.targetId || found.targetId || '[]');
              return { allowedProffs: [], allowedSubjects: subjectIds };
            } catch (e) {
              console.error('Failed to parse multi targets', e);
              return null;
            }
          }

          return {
            allowedProffs: found.type === 'PROFF' ? [found.targetId] : [],
            allowedSubjects: found.type === 'SUBJECT' ? [found.targetId] : []
          };
        }
      }
    } catch (e) {
      console.warn('Code validation failed against server, falling back to local check', e);
    }

    // Fallback to local check
    const codes = dataService.getAccessCodesSync();
    const found = codes.find(c => c.code === codeStrClean.toUpperCase());
    if (!found) return null;
    if (found.isBlocked) return null;
    const generatedDate = new Date(found.generatedAt);
    const expiryDate = new Date(generatedDate);
    expiryDate.setMonth(expiryDate.getMonth() + 18);
    if (new Date() > expiryDate) return null;
    if (found.type === 'MULTI') {
      try {
        const subjectIds = JSON.parse(found.targetId);
        return { allowedProffs: [], allowedSubjects: subjectIds };
      } catch (e) { return null; }
    }
    return {
      allowedProffs: found.type === 'PROFF' ? [found.targetId] : [],
      allowedSubjects: found.type === 'SUBJECT' ? [found.targetId] : []
    };
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
