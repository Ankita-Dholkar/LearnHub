import jwt from "jsonwebtoken"

const isAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "No authentication token provided" });
        }

        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!verifyToken || !verifyToken.userId) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.userId = verifyToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: `Authentication failed: ${error.message}` });
    }
}

export default isAuth;