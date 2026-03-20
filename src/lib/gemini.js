import { GoogleGenAI } from "@google/genai";
import Groq from "groq-sdk";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});


export const model = {
    generateContent: async (prompt) => {

        // Trying gemini first
        try {
            console.log("Using Gemini");

            const response = await ai.models.generateContent({
                model: "gemini-flash-lite-latest",
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                },
            });

            return {
                text:
                    response.text ||
                    response.candidates?.[0]?.content?.parts?.[0]?.text
            };

        } catch (geminiError) {
            console.warn("⚠️ Gemini failed, switching to Groq...");
        }

        //  Fallback to groq
        try {
            console.log("⚡ Using Groq fallback");

            const groqPrompt = `
        Return ONLY valid JSON (no markdown, no extra text).

        ${prompt}
        `;

            const response = await groq.chat.completions.create({
                model: "openai/gpt-oss-120b",
                messages: [
                    { role: "user", content: groqPrompt }
                ],
                temperature: 0.7,
                max_completion_tokens: 1500,
            });

            return {
                text: response.choices[0].message.content
            };

        } catch (groqError) {
            console.error("❌ Groq also failed:", groqError);
            throw groqError;
        }
    },
};