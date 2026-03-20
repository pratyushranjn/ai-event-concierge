import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

export const model = {
    generateContent: async (prompt) => {
        try {
            const response = await ai.models.generateContent({
                model: "gemini-flash-lite-latest",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                },
            });
            return response;
        } catch (error) {
            console.error("Gemini API Error ", error);
            throw error;
        }
    },
};