import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send({message: 'Hello World!'});
});

app.use('/auth', authRouter);

export default app;