import { GoogleGenAI } from "@google/genai";
import { StudyScheduleParams } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

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
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: BASE_SYSTEM_INSTRUCTION,
      },
      history: history 
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    throw error;
  }
};

export const generateSathiResponse = async (
  message: string, 
  history: {role: string, parts: {text: string}[]}[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction: SATHI_SYSTEM_INSTRUCTION,
      },
      history: history 
    });

    const result = await chat.sendMessage({ message });
    return result.text || "I apologize, Sathi is currently offline.";
  } catch (error) {
    console.error("Sathi Chat Error:", error);
    throw error;
  }
};

export const generateStudySchedule = async (params: StudyScheduleParams): Promise<string> => {
  try {
    const prompt = `
      Create a practical, detailed study schedule for a BAMS student in their **${params.proff} Professional Year** (New NCISM Curriculum - 18 months duration).
      
      Context:
      - Student Type: ${params.collegeStatus}
      - Sleep Time: ${params.sleepTime}
      - Wake Time: ${params.wakeTime}
      
      Requirements:
      1. **Subject Selection:** Assign specific subjects relevant to the ${params.proff} Proff.
         - First Proff: Padarth Vigyan, Rachana, Kriya, Sanskrit, Samhita Adhyayan.
         - Second Proff: Dravyaguna, Rasa Shastra, Roga Nidan, Swasthavritta.
         - Third Proff: Kayachikitsa, Panchakarma, Shalya, Shalakya, Prasuti, Kaumarbhritya.
      2. **Routine Structure:**
         - **Weekdays:** Focus on college/work balance with minimum 2 dedicated study sets of 1.5 hours each.
         - **Weekends:** Dedicate time for "Revision and Practice" of the whole week's topics.
      3. **Content:** Include specific times for Samhita reading vs Modern subjects.
      4. **Lifestyle:** Include breaks and Ayurvedic lifestyle tips (Dinacharya) like Brahma Muhurta study.
      5. **Format:** Output in clean Markdown. Use **Bold** for time slots and Subject names.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an Ayurvedic Academic Planner. Create strict but achievable schedules."
      }
    });

    return response.text || "Could not generate schedule.";
  } catch (error) {
    console.error("Gemini Schedule Error:", error);
    throw error;
  }
};

export const generateWellnessAdvice = async (topic: string): Promise<string> => {
  try {
    const prompt = `
      Provide practical, Ayurvedic advice for a BAMS student regarding: "${topic}".
      
      Include:
      1. Ayurvedic perspective (Nidana/Samprapti if applicable).
      2. Specific Herbs (Medhya Rasayanas, etc.) in **Bold**.
      3. Lifestyle changes (Vihara).
      4. A practical approach to dealing with this during exams.
      5. Conclude by suggesting they practice with Ayurveez Exam Series to reduce anxiety through preparation.
      
      Format with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a compassionate Ayurvedic Mentor focused on student mental health."
      }
    });

    return response.text || "Could not generate advice.";
  } catch (error) {
    console.error("Gemini Wellness Error:", error);
    throw error;
  }
};