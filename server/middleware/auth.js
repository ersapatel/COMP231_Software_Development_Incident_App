import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const authenticate = (req, res, next) => {
  const header = req.headers['authorization'] || req.headers['Authorization'];
  if (!header) return res.status(401).json({ message: 'Missing authorization header' });

  const parts = header.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];

    try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export const authorize = (roles = []) => {
      if (typeof roles === 'string') roles = [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    next();
  };
};