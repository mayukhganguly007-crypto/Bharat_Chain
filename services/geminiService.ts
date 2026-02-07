
import { GoogleGenAI, Type } from "@google/genai";
import { Hero, HeroRarity, BlockShape } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const HERO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    type: { type: Type.STRING, enum: ['SUPERHERO', 'FREEDOM_FIGHTER'] },
    rarity: { type: Type.STRING, enum: ['LEGENDARY', 'EPIC', 'RARE', 'COMMON'] },
    description: { type: Type.STRING },
    bravery: { type: Type.NUMBER },
    wisdom: { type: Type.NUMBER },
    power: { type: Type.NUMBER },
    cbdcValue: { type: Type.NUMBER }
  },
  required: ['name', 'type', 'rarity', 'description', 'bravery', 'wisdom', 'power', 'cbdcValue']
};

export async function generateHeroMetadata(shape: BlockShape): Promise<Partial<Hero>> {
  const prompt = `Generate a creative metadata for an Indian character based on the block shape "${shape}". 
  If Hexagon, make it a high-tech modern superhero. 
  If Square, make it a stoic freedom fighter from history. 
  If Circle, make it a mystical cosmic Indian guardian. 
  If Triangle, make it a swift warrior of the resistance.
  Provide detailed lore and stats.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: HERO_SCHEMA
    }
  });

  const data = JSON.parse(response.text);
  return {
    name: data.name,
    type: data.type,
    rarity: data.rarity,
    description: data.description,
    cbdcValue: data.cbdcValue,
    stats: {
      bravery: data.bravery,
      wisdom: data.wisdom,
      power: data.power
    }
  };
}

export async function generateHeroImage(heroName: string, description: string): Promise<string | null> {
  const prompt = `A cinematic, ultra-detailed digital art of an Indian character named "${heroName}". 
  Description: ${description}. 
  Style: Modern Indian comic book aesthetic, vibrant saffron and teal lighting, hyper-realistic, 4k, mythological influences.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
}
