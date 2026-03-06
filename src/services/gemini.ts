import { GoogleGenAI, Modality } from "@google/genai";
import { NEPALI_MONTHS } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getNepaliContext(query: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: query,
    config: {
      systemInstruction: "You are 'Hamro Sathi', a helpful AI assistant for Nepali people. Answer in a mix of English and Nepali (Romanized or Devanagari as appropriate). Be polite, culturally aware, and helpful regarding Nepal's geography, culture, laws, and daily life.",
    },
  });
  return response.text;
}

export async function getLatestRates() {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide the current approximate gold price in Nepal (Fine Gold and Tejabi Gold per tola in NPR) and currency exchange rates (USD, INR, EUR, QAR, MYR to NPR). Return as JSON with keys 'gold' (containing 'fine' and 'tejabi') and 'currency' (containing codes as keys).",
    config: {
      responseMimeType: "application/json",
    },
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
}

export async function getNepaliCalendarData(year: number, month: number) {
  const monthName = NEPALI_MONTHS[month];
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Provide calendar data for the Nepali month ${monthName} ${year} BS. 
    Include:
    1. number of days in this month
    2. the weekday the month starts on (0 for Sunday, 6 for Saturday)
    3. a list of major holidays/festivals with their day number and name
    4. the corresponding AD month and starting day offset
    Return as JSON with keys: daysInMonth, startDay, holidays (array of {day, name}), adMonth, adStartDay.`,
    config: {
      responseMimeType: "application/json",
    },
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    return null;
  }
}

export async function getMotivationalSpeech() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: 'Say a short, powerful motivational quote for a Nepali person in a mix of Nepali and English. Be encouraging and energetic.' }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  
  const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  const text = response.text;
  return { audioData, text };
}

export async function searchNearbyPlaces(query: string, lat?: number, lng?: number) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: lat && lng ? { latitude: lat, longitude: lng } : undefined
        }
      }
    },
  });
  
  const text = response.text;
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const places = chunks?.filter(c => c.maps).map(c => c.maps) || [];
  
  return { text, places };
}
