const jwt = require('jsonwebtoken');
/*
const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Add the user object to the request object
    req.user = decodedToken.user;

    // Call the next middleware in the chain
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};
*/
const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(' ')[1];

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Call the next middleware in the chain
    req.user = decodedToken;

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
};

const checkManagerRole = async (req, res, next) => {
  try {
    // Check if the user has the 'manager' role or the 'department-manager' role
    if (!req.user || (req.user.role !== 'manager' && req.user.role !== 'department-manager')) {
      return res.status(403).json({ success: false, error: 'Forbidden' });
    }

    // Call the next middleware in the chain
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};



module.exports = { authMiddleware, checkManagerRole };
