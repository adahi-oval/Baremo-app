import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '30d';

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET not defined in env variables");
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        researcherId: user.researcherId,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
    });

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

authRouter.get("/protected", authenticate, authorize('admin'), (req, res) => {
  res.json({ message: "protectedddd" });
});

authRouter.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(200).json({ message: 'Logged out successfully.' });
});

authRouter.get('/me', authenticate, async (req, res) => {
  const userId = (req as any).user?.id;

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found or not logged in.' });
    }

    res.json({user});
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default authRouter;
