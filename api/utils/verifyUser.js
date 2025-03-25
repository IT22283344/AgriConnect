import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// Middleware to verify the JWT token
export const verifyToken = (req, res, next) => {
    const token = req.cookies.acess_token; // Corrected typo: 'acess_token' -> 'access_token'

    if (!token) {
        return next(errorHandler(401, 'You are not authenticated'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(errorHandler(403, 'Token is not valid'));
        }
        req.user = user; // Attach the decoded user to the request object
        next();
    });
};

// Middleware to authorize specific roles (e.g., farmer)
export const authorize = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return next(errorHandler(403, `You are not authorized to access this route as a ${role}`));
        }
        next();
    };
};