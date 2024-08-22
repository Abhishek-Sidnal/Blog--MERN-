const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = (req, res, next) => {
    // Access authorization header (case-insensitive)
    const authorizationHeader = req.headers.authorization || req.headers.Authorization;

    // Check if authorization header exists and starts with "Bearer"
    if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
        const token = authorizationHeader.split(' ')[1]; // Extract token from "Bearer <token>"

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                // If token is invalid or expired
                return next(new HttpError("Unauthorized. Invalid token. Re-login", 401));
            }
            // Attach user info to request object
            req.user = decoded; // Assuming decoded contains user info, like { id, email, etc. }
            next(); // Proceed to next middleware or route handler
        });
    } else {
        // If no token is provided
        return next(new HttpError("Unauthorized. No token provided.", 401));
    }
};

module.exports = authMiddleware;
