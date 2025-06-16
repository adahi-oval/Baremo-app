import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import testRouter from './routes/test';
import userRouter from './routes/user';
import meritRouter from './routes/merits';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

app.use(cookieParser());
app.use(authRouter);
app.use(userRouter);
app.use(meritRouter)

export default app;