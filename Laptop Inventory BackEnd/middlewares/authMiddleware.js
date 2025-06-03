const jwt = require('jsonwebtoken');
const tokenBlacklist = require('../utils/tokenBlackList'); // Import the shared blacklist

module.exports = function (req, res, next) {
    let token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove "Bearer " prefix if present
    if (token.startsWith('Bearer ')) {
        token = token.slice(7).trim(); // Remove the 'Bearer ' part
    }

    // Check if the token is blacklisted
    if (tokenBlacklist.includes(token)) {
        return res.status(401).json({ message: 'Token has been blacklisted, please log in again' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error('Token verification failed:', err.message);
        return res.status(401).json({ message: 'Token is not valid' });
    }
};
