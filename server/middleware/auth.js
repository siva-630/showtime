import { clerkClient } from "@clerk/express";
import User from "../models/User.js";

export const protectAdmin = async (req, res, next) => {
    try {
        const auth = typeof req.auth === 'function' ? req.auth() : (req.auth || {});
        const userId = auth?.userId;

        if (!userId) {
            return res.json({ success: false, message: "Not authorized. Please log in." });
        }

        // Fetch user from DB to check their email
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found." });
        }

        // Check if the user's email matches the admin email
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SENDER_EMAIL || "sivalife20@gmail.com";
        
        if (user.email !== adminEmail) {
            return res.json({ success: false, message: "Not authorized. Admin access only." });
        }

        next();
    } catch (error) {
        console.error("Admin Auth Error:", error);
        return res.json({ success: false, message: "Server error during admin authentication." });
    }
};
