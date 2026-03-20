import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({

    userPrompt: {
        type: String,
        required: true
    },

    venueName: {
        type: String,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    estimatedCost: {
        type: String,
        required: true,
    },

    capacity: {
        type: String,
    },

    highlights: {
        type: [String],
    },

    justification: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.models.Event || mongoose.model('Event', EventSchema)