const xss = require('xss');
const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
    passwordValidation(password) {
        if (password.length < 8) {
            return 'Password must be longer than 8 characters';
        }

        if (password.length > 72) {
            return 'Password must be less than 72 characters';
        }

        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start with or end with spaces';
        }

        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain one upper case, lower case, number and special character';
        }
        return null;
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
    hasUserWithUserName(db, user_name) {
        return db('solitude_users')
            .where({user_name})
            .first()
            .then(user => !!user);
    },
    insertUser(db, user) {
        return db
            .insert(user)
            .into('solitude_users')
            .returning('*')
            .then(([user]) => user);
    },
    serializeUser(user) {
        return {
            id: user.id,
            user_name: xss(user.user_name)
        };
    }
}

module.exports = UsersService;