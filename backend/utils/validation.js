const validator = require('validator');

/**
 * Validates email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }
    return validator.isEmail(email);
};

/**
 * Validates password strength
 * Requirements: Minimum 8 characters, at least one letter and one number
 * @param {string} password - Password to validate
 * @returns {object} - { valid: boolean, message: string }
 */
const isValidPassword = (password) => {
    if (!password || typeof password !== 'string') {
        return { valid: false, message: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters long' };
    }

    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    if (!hasLetter || !hasNumber) {
        return { valid: false, message: 'Password must contain at least one letter and one number' };
    }

    return { valid: true, message: 'Password is valid' };
};

module.exports = {
    isValidEmail,
    isValidPassword
};
