// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        if (!conn) throw new Error("MONGO_URI not defined");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.error("❌ DB Connection Error:", error.message);
        process.exit(1);
    }
};

export default connectDB;
