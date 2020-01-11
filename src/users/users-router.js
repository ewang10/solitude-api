const path = require('path');
const express = require('express');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const {user_name, password} = req.body;
        let newUser = {user_name, password};
        //console.log(newUser)
        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });
            }
        }

        const validatePassword = UsersService.passwordValidation(password);
        if (validatePassword) {
            return res.status(400).json({
                error: validatePassword
            });
        }

        UsersService.hasUserWithUserName(
            req.app.get('db'), 
            user_name
        )
            .then(hasUserWithUserName => {
                if (hasUserWithUserName) {
                    return res.status(400).json({
                        error: 'Username already taken'
                    });
                }

                return UsersService.hashPassword(password)
                    .then(hashPassword => {
                        newUser = {
                            user_name,
                            password: hashPassword
                        };

                        return UsersService.insertUser(
                            req.app.get('db'),
                            newUser
                        )
                            .then(user => {
                                res
                                    .status(201)
                                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                    .json(UsersService.serializeUser(user));
                            })
                    })
            })
            .catch(next);

        
    })

module.exports = usersRouter;