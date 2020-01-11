const express = require('express');
const AuthService = require('./auth-service');
const { requireAuth } = require('../middleware/jwt-auth');

const authRouter = express.Router();
const jsonParser = express.json();

authRouter
    .post('/login', jsonParser, (req, res, next) => {
        const { user_name, password } = req.body;
        const userLogin = { user_name, password };

        for (const [key, value] of Object.entries(userLogin)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });
            }
        }

        AuthService.getUserWithUserName(
            req.app.get('db'),
            user_name
        )
            .then(user => {
                if (!user) {
                    return res.status(400).json({
                        error: 'Incorrect user_name or password'
                    });
                }

                return AuthService.comparePassword(
                    password,
                    user.password
                )
                    .then(compareMatch => {
                        if (!compareMatch) {
                            return res.status(400).json({
                                error: 'Incorrect user_name or password'
                            });
                        }

                        const sub = user.user_name;
                        const payload = { user_id: user.id };
                        res.send({
                            authToken: AuthService.createJWT(sub, payload)
                        });
                    })
            })
            .catch(next);
    });

authRouter
    .post('/refresh', requireAuth, jsonParser, (req, res) => {
        const sub = req.user.user_name;
        const payload = { user_id: req.user.id }

        res.send({
            authToken: AuthService.createJWT(sub, payload)
        });
    });

module.exports = authRouter;