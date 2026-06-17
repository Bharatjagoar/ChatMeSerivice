const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const decoded = jwt.verify(token, "secrate");
        req.user = decoded; // { id, email, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyJWT;