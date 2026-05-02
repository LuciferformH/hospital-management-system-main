/**
 * Avatar Utility
 * Generates consistent, deterministic avatar URLs using DiceBear API
 * Based on user email to ensure same user always gets same avatar
 */

/**
 * Available avatar styles from DiceBear API
 */
export const AVATAR_STYLES = {
    AVATAAARS: 'avataaars',      // Cartoon-style (default, recommended)
    BOTTTS: 'bottts',            // Robot avatars
    PERSONAS: 'personas',        // Illustrated human avatars
    INITIALS: 'initials',        // Simple initials-based
    IDENTICON: 'identicon',      // Geometric patterns
};

/**
 * Generates a consistent avatar URL based on user identifier
 * @param {string} seed - Unique identifier (email, username, or ID)
 * @param {string} style - Avatar style from AVATAR_STYLES (default: avataaars)
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (seed, style = AVATAR_STYLES.AVATAAARS) => {
    if (!seed) {
        // Return a default avatar if no seed provided
        return `https://api.dicebear.com/7.x/${style}/svg?seed=default`;
    }

    // Encode the seed to handle special characters in emails
    const encodedSeed = encodeURIComponent(seed);

    return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodedSeed}`;
};

/**
 * Gets avatar URL with fallback logic
 * Prioritizes custom profile image, falls back to generated avatar
 * @param {object} user - User object with email and optional profileImage
 * @param {string} style - Avatar style (optional)
 * @returns {string} Avatar URL
 */
export const getUserAvatar = (user, style = AVATAR_STYLES.AVATAAARS) => {
    if (!user) {
        return getAvatarUrl('default', style);
    }

    // Strictly use generated avatar from email or other identifiers
    // This ignores any legacy profileImage field to enforce the random avatar system
    return getAvatarUrl(user.email || user.userName || user.name || 'default', style);
};

export default {
    getAvatarUrl,
    getUserAvatar,
    AVATAR_STYLES,
};
