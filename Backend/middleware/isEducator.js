import User from "../models/userModel.js";

/**
 * Middleware: isEducator
 * Ensures the authenticated user has the 'educator' role.
 * Must be used after isAuth (which sets req.userId).
 */
const isEducator = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select("role");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.role !== "educator") {
            return res.status(403).json({ message: "Access denied: Educators only" });
        }
        next();
    } catch (error) {
        return res.status(500).json({ message: `isEducator error: ${error.message}` });
    }
};

export default isEducator;
