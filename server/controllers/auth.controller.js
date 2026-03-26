import Users from '../models/user.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const signToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
};

export const register = async (req, res) => {
   console.log("REQ.BODY:", req.body);
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const existing = await Users.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

      const newUser = new Users({ firstName, lastName, email, password, role });
    await newUser.save();

        const token = signToken(newUser);
    res.status(201).json({ user: { id: newUser._id, email: newUser.email, role: newUser.role }, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });


    const token = signToken(user);
    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      },
      token
    });    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};