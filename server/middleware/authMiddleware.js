const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = (req, res, next) => {
    // Access authorization header (case-insensitive)
    const Authorization = req.headers.Authorization || req.headers.authorization;

    // Check if authorization header exists and starts with "Bearer"
    if (Authorization && Authorization.startsWith("Bearer")) {
        const token = Authorization.split(' ')[1]; // Extract token from "Bearer <token>"

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, (err, info) => {
            if (err) {
                // If token is invalid or expired
                return next(new HttpError("Unauthorized. Invalid token.", 401));
            }
            // Attach user info to request object
            req.user = info;
            next(); // Proceed to next middleware or route handler
        });
    } else {
        // If no token is provided
        return next(new HttpError("Unauthorized. No token provided.", 401));
    }
};

module.exports = authMiddleware;
