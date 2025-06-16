import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/db';

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} ✅`);
    });
}

start().catch((error) => {
    console.error("Error starting the server:", error);
    process.exit(1);
});

