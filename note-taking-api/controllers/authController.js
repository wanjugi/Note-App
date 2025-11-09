import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 

// SIGN UP LOGIC
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: savedUser._id,
        username: savedUser.username,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error during sign up', error: error.message });
  }
};


// LOGIN LOGIC 
export const login = async (req, res) => {
  try {
    // 1. Get username and password from the request body
    const { username, password } = req.body;

    // 2. Check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      // 400 "Bad Request"
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // 3. Compare the sent password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // 400 "Bad Request" 
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // 4. If user exists and password is correct, create a JWT
    const payload = {
      user: {
        id: user._id, // This is the data we're "signing" into the token
      },
    };

    // 5. Sign the token with a secret key
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token lasts for 1 hour
      (err, token) => {
        if (err) throw err;
        // 6. Send the token back to the frontend
        res.status(200).json({
          message: 'Login successful!',
          token: token, // This is the "ID card" for the frontend
          user: {
            _id: user._id,
            username: user.username,
            role: user.role
          }
        });
      }
    );

  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};