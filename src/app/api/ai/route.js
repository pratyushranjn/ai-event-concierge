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
        const userInputRaw = body?.userInput;

        if (!userInputRaw) {
            return NextResponse.json(
                { success: false, error: "userInput is required" },
                { status: 400 }
            );
        }

        // Normalize input
        const userInput = userInputRaw.trim().replace(/\s+/g, " ");

        // Empty / symbols check
        if (!userInput || /^[^a-zA-Z0-9]+$/.test(userInput)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Please enter a meaningful event description.",
                },
                { status: 400 }
            );
        }

        if (userInput.length < 10) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Please provide more details (e.g. people, location, budget).",
                },
                { status: 400 }
            );
        }

        // Relevance check
        const isValid = /(event|trip|offsite|meeting|conference|team|travel|outing|retreat)/i.test(userInput);

        if (!isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Input must describe an event (e.g. team trip, offsite, conference).",
                },
                { status: 400 }
            );
        }

        await connectDB();

        const proposal = await generateEventProposal(userInput);

        if (
            !proposal ||
            !proposal.venueName ||
            !proposal.location ||
            !proposal.estimatedCost
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to generate a valid proposal. Please try again.",
                },
                { status: 500 }
            );
        }

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