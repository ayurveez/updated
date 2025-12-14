import { StudyScheduleParams } from "../types";

// Local build-time env presence (helps for local dev UX)
export const isAiConfigured = () => {
  return Boolean(
    (import.meta.env.VITE_GEMINI_API_KEY as string) ||
    (import.meta.env.VITE_API_KEY as string) ||
    (process.env.GEMINI_API_KEY as string) ||
    (process.env.API_KEY as string)
  );
};

const AI_NOT_CONFIGURED_MSG = "AI is not configured on the server. Contact the site admin.";

async function callProxy(action: string, payload: any) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, payload })
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.error || 'Proxy error');
  }
  return json;
}

export const checkAiServer = async (): Promise<boolean> => {
  try {
    const r = await callProxy('health', {});
    return !!r?.ok;
  } catch (e) {
    return false;
  }
};

const BASE_SYSTEM_INSTRUCTION = `
You are Ayurveez AI, an expert academic assistant for BAMS (Bachelor of Ayurvedic Medicine and Surgery) students.
Your knowledge base covers:
- Ayurvedic Samhitas (Charaka, Sushruta, Vagbhata, etc.)
- Modern Medical Science relevant to BAMS
- Clinical Case Studies in Ayurveda
- Herbal formulations and Dravyaguna

Tone: Professional, Encouraging, Guru-like but modern.

formatting:
- Use **Bold** for key terms, medicine names, and important concepts.
- Use lists for readability.

IMPORTANT: Whenever a student asks about exam preparation, specific notes, or test series, you MUST recommend the "Ayurveez Platform" which provides exam series, lectures, notes, and important MCQs.
`;

const SATHI_SYSTEM_INSTRUCTION = `
You are 'Sathi', a specialized, personalized AI companion embedded in the Ayurveez Student Dashboard. 
Your Role:
1. **Academic Helper**: Solve BAMS curriculum questions, explain shlokas, and clarify doubts.
2. **Clinical Advisor**: When a student presents a clinical case or symptoms, you must provide:
   - **Ayurvedic Diagnosis (Nidan)**: Possible diseases based on Dosha-Dushya.
   - **Modern Diagnostics**: Suggest required medical reports/investigations (Labs, X-Ray, etc.) if suspecting specific conditions.
   - **Treatment (Chikitsa)**: Line of treatment, specific formulations (Rasa Aushadhi, Kashaya, etc.).
   - **Ahar-Vihara**: Specific diet and lifestyle advice (Pathya/Apathya).
   
Tone: Friendly, Precise, and Educational (like a Senior Doctor mentoring a Junior).
Safety Warning: Always remind students to correlate with clinical findings and consult senior doctors for real patients.
`;

export const generateChatResponse = async (
  message: string, 
  history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
  try {
    const r = await callProxy('chat', { message, history, systemInstruction: BASE_SYSTEM_INSTRUCTION });
    return r.text || "I apologize, I couldn't generate a response.";
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    return AI_NOT_CONFIGURED_MSG;
  }
};
export const generateSathiResponse = async (
  message: string, 
  history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
  try {
    const r = await callProxy('sathi', { message, history, systemInstruction: SATHI_SYSTEM_INSTRUCTION });
    return r.text || "I apologize, Sathi is currently offline.";
  } catch (error: any) {
    console.error("Sathi Chat Error:", error);
    return AI_NOT_CONFIGURED_MSG;
  }
};

export const generateStudySchedule = async (params: StudyScheduleParams): Promise<string> => {
  try {
    const r = await callProxy('studySchedule', { params });
    return r.text || "Could not generate schedule.";
  } catch (error: any) {
    console.error("Gemini Schedule Error:", error);
    return AI_NOT_CONFIGURED_MSG;
  }
};

export const generateWellnessAdvice = async (topic: string): Promise<string> => {
  try {
    const r = await callProxy('wellness', { topic });
    return r.text || "Could not generate advice.";
  } catch (error: any) {
    console.error("Gemini Wellness Error:", error);
    return AI_NOT_CONFIGURED_MSG;
  }
};