const path = require('path');
const express = require('express');

const usersRouter = express.Router();
const jsonParser = express.json();

usersRouter
    .post('/', jsonParser, (req, res, next) => {
        const {user_name, password} = req.body;
        const newUser = {user_name, password};

        for (const [key, value] of Object.entries(newUser)) {
            if (value === null) {
                req.statusCode(400).json({
                    error: `Missing ${key} in request body`
                });
            }
        }
    })