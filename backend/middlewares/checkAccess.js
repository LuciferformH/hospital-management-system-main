
const checkAccess = (req, res, next) => {
    const allowedRoles = ["admin", "doctor", "nurse"];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(401).json({ error: "You Are Not Authorized to perform this Operation!!!" });
    }
    next();
};

module.exports = checkAccess;