import { GoogleGenAI } from "@google/genai";
import { PpdbFormData } from "../types";

// This function constructs the prompt text from the form data
export const constructPrompt = (data: PpdbFormData): string => {
  const tracksList = data.tracks.includes('Isi Sendiri') 
    ? [...data.tracks.filter(t => t !== 'Isi Sendiri'), data.customTrack].filter(Boolean).join(', ')
    : data.tracks.join(', ');

  const socialList = data.socialMedia
    .filter(s => s.handle)
    .map(s => `${s.platform}: ${s.handle}`)
    .join(' | ');

  const contactsList = data.contactPersons.filter(Boolean).join(' | ');

  return `
Create a high-quality PPDB (New Student Admission) poster design.

**School Information:**
- Name: ${data.schoolName}
- Level: ${data.level}
- Year: ${data.academicYear}
- Accreditation: ${data.accreditation}
- Slogan: "${data.tagline}"

**Admission Details:**
- Tracks: ${tracksList}
- Operational Days: ${data.days}
- Dates: ${data.date}
- Time: ${data.time}
- Location: ${data.location}
- Requirements Summary: ${data.requirements}
- Contacts: ${contactsList}
- Social Media: ${socialList}

**Visual Style:**
- Style: ${data.visualStyle}
- Mood/Atmosphere: ${data.additionalVisualInfo || 'Professional, inviting, and trustworthy'}
- Aspect Ratio: ${data.aspectRatio}

**Design Instructions:**
Ensure the text is legible. The layout should be balanced according to the requested aspect ratio. Use colors appropriate for the "${data.visualStyle}" style. High resolution, 8k, detailed textures.
`.trim();
};

export const generateImage = async (prompt: string, aspectRatio: string, apiKey?: string): Promise<string | null> => {
  // Prioritize user-provided key, fallback to env variable
  const token = apiKey || process.env.API_KEY;

  if (!token) {
    throw new Error("API Key tidak ditemukan. Mohon masukkan API Key Google Gemini Anda di menu pengaturan (tombol kunci di pojok kanan atas).");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: token });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any, // Casting because SDK types might be strict
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};