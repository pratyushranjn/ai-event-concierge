import { model } from "@/lib/gemini";

const isQuotaExceededError = (err) => {
    const status = err?.status || err?.code;
    const message = String(err?.message || "").toLowerCase();

    return (
        status === 429 ||
        message.includes("quota") ||
        message.includes("resource_exhausted") ||
        message.includes("rate limit") ||
        message.includes("too many requests")
    );
};

export const generateEventProposal = async (userInput) => {

    const prompt = `
                You are an AI Event Concierge.
                Return ONLY valid JSON (no markdown, no extra text).

                Recommend one real venue for this request:
                "${userInput}"

                Rules:
                - Respect user budget; never exceed it. If budget is missing, choose mid-range.
                - Use ₹ for India, otherwise use $.
                - estimatedCost must be total cost for full duration.
                - highlights must be venue-specific.
                - justification must explain fit for group size, duration, event type, and budget.

                JSON shape:
                {
                    "venueName": "string",
                    "location": "City, State, Country",
                    "estimatedCost": "string",
                    "capacity": "string",
                    "highlights": ["string", "string", "string"],
                    "justification": "2-3 sentences: why this venue fits group size, duration, event type, and budget"
                }
        `;


    try {
        const response = await model.generateContent(prompt);

        const rawText = response.text;
        const cleanJson = rawText
            .replace(/```json|```/g, "")
            .replace(/^[^{]*/, "")
            .replace(/[^}]*$/, "")
            .trim();

        const parsed = JSON.parse(cleanJson);

        // Validating all required fields are present
        const requiredFields = ["venueName", "location", "estimatedCost", "capacity", "highlights", "justification"];
        for (const field of requiredFields) {
            if (!parsed[field]) throw new Error(`Missing field: ${field}`);
        }

        return parsed;

    } catch (err) {
        console.error("AI API Error:", err);

        if (isQuotaExceededError(err)) {
            const quotaError = new Error("AI quota exceeded");
            quotaError.code = "AI_QUOTA_EXCEEDED";
            quotaError.status = 429;
            quotaError.userMessage = "Service is busy right now. Please try again in a few minutes.";
            throw quotaError;
        }

        const genericError = new Error("Failed to generate AI proposal");
        genericError.code = "AI_GENERATION_FAILED";
        genericError.status = 502;
        genericError.userMessage = "AI service is temporarily unavailable. Please try again.";
        throw genericError;
    }
}