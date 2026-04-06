import mongoose from "mongoose";

export const connectDB = async () => {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
        throw new Error("MONGODB_URI is not set. Add it to your Backend/.env file.");
    }

    try {
        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB");
    } catch (error) {
        throw new Error(`MongoDB connection failed: ${error.message}`);
    }
}
// --- IGNORE ---