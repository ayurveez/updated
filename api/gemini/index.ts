import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;

const sendError = (res: any, code: number, message: string) => {
  res.status(code).json({ error: message });
};

export default async function handler(req: any, res: any) {
  if (!API_KEY) return sendError(res, 500, 'GEMINI_API_KEY not configured on server');

  if (req.method !== 'POST') {
    return sendError(res, 405, 'Only POST is supported');
  }

  const { action, payload } = req.body || {};

  if (!action) return sendError(res, 400, 'Missing action');

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    if (action === 'chat' || action === 'sathi') {
      const { message, history, systemInstruction } = payload || {};
      const model = 'gemini-2.5-flash';

      const chat = ai.chats.create({ model, config: { systemInstruction: systemInstruction || '' }, history: history || [] });
      const result = await chat.sendMessage({ message });
      return res.status(200).json({ text: result.text || '' });
    }

    if (action === 'health') {
      return res.status(200).json({ ok: true });
    }

    if (action === 'studySchedule') {
      const { params } = payload || {};
      const prompt = `Create a study schedule for ${params.proff} Proff. Context: ${JSON.stringify(params)}`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction: 'You are an academic planner.' } });
      return res.status(200).json({ text: response.text || '' });
    }

    if (action === 'wellness') {
      const { topic } = payload || {};
      const prompt = `Provide Ayurvedic advice for: ${topic}`;
      const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt, config: { systemInstruction: 'Compassionate mentor.' } });
      return res.status(200).json({ text: response.text || '' });
    }

    return sendError(res, 400, 'Unknown action');
  } catch (err: any) {
    console.error('Serverless Gemini Error:', err);
    return sendError(res, 500, err?.message || 'Internal error');
  }
}
