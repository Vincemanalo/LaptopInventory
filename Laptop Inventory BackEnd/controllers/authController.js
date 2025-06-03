const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const tokenBlacklist = require('../utils/tokenBlackList'); 
const { validateLogin } = require('../utils/validator');

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'adminpassword'; 
const json_f = { "result": "FAILED", "message": "Something went wrong" }
const json_invalid = { "result": "SUCCESS", "message": "Invalid Creds" }

// Login function for admin
exports.login = [
validateLogin,
(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log("Error: ", errors);
        return res.status(200).json(json_f);
    }

    const { email, password } = req.body;

    try {
        if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            return res.status(200).json(json_invalid);
        }
        const payload = {
            user: {
                id: 'admin-id'
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
            if (err) throw err;
            res.json({
                message: "Login successfully",
                token
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
}
];

// Logout function for admin
exports.logout = (req, res) => {
    try {
        const token = req.header('Authorization');
        tokenBlacklist.push(token);
        res.json({ message: 'Admin logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};