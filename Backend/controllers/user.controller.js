const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {
    try {
        // 1. Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 2. Extract data
        const { fullname, email, password } = req.body;
        const { firstname, lastname } = fullname;

        // 3. Hash password
        const hashedPassword = await userModel.hashPassword(password);

        // 4. Create user
        const user = await userService.createUser({
            fullname: { firstname, lastname },
            email,
            password: hashedPassword
        });

        // 5. Generate token
        const token = user.generateAuthToken();

        // 6. Send response
        res.status(201).json({ token, user });

    } catch (err) {
        console.error("Error registering user:", err);
        next(err); // Let Express handle it with error middleware
    }
};