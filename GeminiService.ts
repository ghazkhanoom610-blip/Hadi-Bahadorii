
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  // CRITICAL: We create a fresh instance every time to ensure we use the 
  // most up-to-date API key (especially important after openSelectKey())
  private static getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // --- Search & Grounding ---
  static async performSearch(query: string, latLng?: { latitude: number; longitude: number }) {
    const ai = this.getAI();
    const config: any = {
      tools: [{ googleSearch: {} }],
    };

    if (latLng) {
      config.tools.push({ googleMaps: {} });
      config.toolConfig = {
        retrievalConfig: { latLng }
      };
    }

    const response = await ai.models.generateContent({
      model: latLng ? 'gemini-2.5-flash' : 'gemini-3-flash-preview',
      contents: query,
      config,
    });

    return {
      text: response.text,
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  }

  // --- Chat & Reasoning ---
  static async chatWithThinking(message: string, history: any[] = []) {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });
    return response.text;
  }

  // --- Business Content Generation ---
  static async generateDescription(name: string, category: string) {
    const ai = this.getAI();
    const prompt = `Create a compelling, high-end, and inviting business description for a premium brand in Orange County, CA.
    
    Business Details:
    - Name: ${name}
    - Category: ${category}
    
    Orange County Context & Traits to Incorporate:
    - Coastal Elegance: If near the coast, emphasize breezy, sophisticated, and beach-chic vibes.
    - Innovation & Tech: If a professional or tech service, highlight Irvine-style cutting-edge excellence.
    - Community & Lifestyle: Use terms like "SoCal lifestyle," "local community," "curated experience," and "premium quality."
    - Tone: Confident, aspirational, professional yet approachable.
    
    Guidelines:
    - Length: Max 80 words.
    - Format: Return ONLY the description text. Do not include quotes, headers, or conversational filler.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  }

  // --- Image Generation (Used in Add Business Flow) ---
  static async generateImage(prompt: string, aspectRatio: "1:1" | "3:4" | "4:3" | "9:16" | "16:9" = "16:9", imageSize: "1K" | "2K" | "4K" = "1K") {
    const ai = this.getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: { aspectRatio, imageSize }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  }

  // --- Video Generation (Veo) ---
  // Fix: Implemented missing generateVideo method for AIStudio.tsx.
  // This handles the long-running video generation operation with polling.
  static async generateVideo(prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    // Poll for video generation completion.
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) return null;

    // The download link for Veo models requires the API key to be appended.
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch generated video bytes.');
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
