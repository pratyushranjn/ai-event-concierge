import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("MongoDB URI not defined");
}

async function connectDB() {

    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("MongoDB already connected");
            return;
        }

        await mongoose.connect(uri);

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error: ", error.message);
        throw error;
    }

}

export default connectDB;