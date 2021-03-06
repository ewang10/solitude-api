require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const {NODE_ENV} = require('./config');
const app = express();
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const dateCategoriesRouter = require('./date_categories/date_categories-router');
const journalsRouter = require('./journals/journals-router');

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/date_categories', dateCategoriesRouter);
app.use('/api/journals', journalsRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if(NODE_ENV === 'production') {
        response = {error: {message: 'server error'}};
    } else {
        console.log(error);
        response = {message: error.message, error};
    }
    res.status(500).json(response);
});

module.exports = app;