export * from './dataService.ts';
var DATA_KEY = 'ayurveez_data_v1';
var CODES_KEY = 'ayurveez_codes_v1';
// Initial Seed Data
var INITIAL_DATA = [
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
exports.dataService = {
    // Course Data Methods
    getData: function () {
        var stored = localStorage.getItem(DATA_KEY);
        if (!stored) {
            localStorage.setItem(DATA_KEY, JSON.stringify(INITIAL_DATA));
            return INITIAL_DATA;
        }
        return JSON.parse(stored);
    },
    saveData: function (data) {
        localStorage.setItem(DATA_KEY, JSON.stringify(data));
    },
    // Access Code Methods
    getAccessCodes: function () {
        var stored = localStorage.getItem(CODES_KEY);
        return stored ? JSON.parse(stored) : [];
    },
    saveAccessCode: function (codeObj) {
        var codes = exports.dataService.getAccessCodes();
        codes.push(codeObj);
        localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    },
    deleteAccessCode: function (codeStr) {
        var codes = exports.dataService.getAccessCodes().filter(function (c) { return c.code !== codeStr; });
        localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    },
    toggleBlockAccessCode: function (codeStr) {
        var codes = exports.dataService.getAccessCodes();
        var target = codes.find(function (c) { return c.code === codeStr; });
        if (target) {
            target.isBlocked = !target.isBlocked;
            localStorage.setItem(CODES_KEY, JSON.stringify(codes));
        }
        return codes;
    },
    // Generate a unique code
    generateCode: function (prefix) {
        var random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return "".concat(prefix, "-").concat(random);
    },
    // Verify Login with Expiry Logic
    verifyStudentCode: function (codeStr) {
        var codeStrClean = codeStr.trim().toUpperCase();
        // DEMO BACKDOOR for testing (No Expiry)
        if (codeStrClean === 'DEMO123') {
            return { allowedProffs: ['first-proff'], allowedSubjects: [] };
        }
        var codes = exports.dataService.getAccessCodes();
        var found = codes.find(function (c) { return c.code === codeStrClean; });
        if (found) {
            // Block Check
            if (found.isBlocked) {
                return null;
            }
            // Expiry Logic: 18 Months
            var generatedDate = new Date(found.generatedAt);
            var expiryDate = new Date(generatedDate);
            expiryDate.setMonth(expiryDate.getMonth() + 18);
            var currentDate = new Date();
            if (currentDate > expiryDate) {
                // Code is expired
                return null;
            }
            if (found.type === 'MULTI') {
                try {
                    var subjectIds = JSON.parse(found.targetId);
                    return { allowedProffs: [], allowedSubjects: subjectIds };
                }
                catch (e) {
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
    extractYoutubeId: function (url) {
        if (!url)
            return '';
        if (url.length === 11 && !url.includes('.') && !url.includes('/'))
            return url;
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        var match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : url;
    },
    // Helper to convert Google Drive View URLs to Preview (Embed) URLs
    getEmbedUrl: function (url) {
        if (!url)
            return '';
        // Check if it's a Google Drive URL
        if (url.includes('drive.google.com')) {
            // Replace /view with /preview to allow embedding
            return url.replace(/\/view.*/, '/preview');
        }
        return url;
    }
};
