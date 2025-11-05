// This guard will check if the user is an admin
export const isAdmin = (req, res, next) => {
  // We check 'req.user' (which our 'protect' middleware created)
  if (req.user && req.user.role === 'admin') {
    next(); // They are an admin, proceed
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

// This guard will check if the user is at least a moderator
export const isModerator = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
    next(); // They are a mod or admin, proceed
  } else {
    res.status(403).json({ message: 'Not authorized as a moderator' });
  }
};