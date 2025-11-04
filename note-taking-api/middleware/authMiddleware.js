import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  // 1. Check if the 'Authorization' header exists and starts with 'Bearer'
  // When the Nuxt app sends a request, it will add a header like:
  // "Authorization: Bearer <your_jwt_token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 2. Get just the token from the header (split at the space and take the 2nd part)
      token = req.headers.authorization.split(' ')[1];

      // 3. Verify the token using our JWT_SECRET
      // This checks if the token is real and not expired
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      

      // 4. Find the user from the ID that was in the token
      // We attach this user to the 'req' object (as 'req.user')
      // We use .select('-password') to remove the hashed password from the object
      req.user = await User.findById(decoded.user.id).select('-password');

      // 5. Call 'next()' to pass the request along to its final destination
      // (e.g., the 'createNote' controller)
      next();

    } catch (error) {
      // This will catch failed verifications (e.g., expired token)
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // 6. If there's no 'Authorization' header or it doesn't start with 'Bearer'
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};