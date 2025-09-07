
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface FetchResult {
  text: string;
  groundingChunks: GroundingChunk[] | undefined;
}

export const fetchRailsInfo = async (query: string): Promise<FetchResult> => {
  try {
    const prompt = `In the context of Ruby on Rails, tell me about "${query}". Provide a concise and up-to-date summary based on the latest available information.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    
    if (!text) {
        throw new Error("Received an empty response from the API.");
    }

    return { text, groundingChunks };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch information from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching data.");
  }
};
