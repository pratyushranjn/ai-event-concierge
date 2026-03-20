import { NextResponse } from "next/server";
import Event from "@/models/Event";
import connectDB from "@/lib/db";
import { generateEventProposal } from "@/services/aiService";

export async function GET(req) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 5;

        const skip = (page - 1) * limit;

        const events = await Event.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Event.countDocuments();

        return NextResponse.json({
            success: true,
            data: events,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (err) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

export async function POST(req) {
    try {
        const body = await req.json();
        const userInput = body?.userInput?.trim();

        if (!userInput) {
            return NextResponse.json(
                { success: false, error: "userInput is required" },
                { status: 400 }
            );
        }

        await connectDB();

        const proposal = await generateEventProposal(userInput);

        await Event.create({
            userPrompt: userInput,
            venueName: proposal.venueName,
            location: proposal.location,
            estimatedCost: proposal.estimatedCost,
            capacity: proposal.capacity,
            highlights: proposal.highlights,
            justification: proposal.justification
        });

        return NextResponse.json({
            success: true,
            data: proposal,
        });
    } catch (err) {
        console.error("AI Route Error:", err);

        const status = err?.status || 500;
        const errorMessage = err?.userMessage || "Failed to generate AI proposal";

        return NextResponse.json(
            {
                success: false,
                error: errorMessage,
                code: err?.code || "AI_ROUTE_ERROR",
            },
            { status }
        );
    }
}
