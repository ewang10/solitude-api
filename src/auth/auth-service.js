const jwt = require('jsonwebtoken');
const config = require('../config');
const bcrypt = require('bcryptjs');

const AuthService = {
    getUserWithUserName(db, user_name) {
        return db('solitude_users')
            .where({user_name})
            .first();
    },
    comparePassword(password, hashPassword) {
        return bcrypt.compare(password, hashPassword);
    },
    verifyJWT(token) {
        return jwt.verify(
            token, 
            config.JWT_SECRET,
            {
                algorithms: ['HS256']
            }
        );
    },
    createJWT(sub, payload) {
        return jwt.sign(
            payload,
            config.JWT_SECRET,
            {
                subject: sub,
                expiresIn: config.JWT_EXPIRY,
                algorithm: 'HS256'
            }
        );
    }
}

module.exports = AuthService;