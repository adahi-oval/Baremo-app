import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import testRouter from './routes/test';
import userRouter from './routes/user';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

app.use(authRouter);
app.use(testRouter);
app.use(userRouter);

export default app;