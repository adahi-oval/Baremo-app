import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();
const PORT = process.env.PORT || 3000;

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

