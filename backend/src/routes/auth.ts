import { Router } from 'express';
import { User } from '../models/User';

const authRouter = Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select('+password');
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const isMatch = await user.comparePassword(password);
  if (!isMatch || !user) return res.status(401).json({ message: 'Invalid password' });

  const { password: _, ...userWithoutPassword } = user.toObject();
  
  return res.status(200).json(userWithoutPassword);
});

export default authRouter;
