const jwt = require("jsonwebtoken");

const checkAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: "Forbidden. Admin access required." });
    }

    next();
};

module.exports = checkAdmin;