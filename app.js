const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/authentication');

const baseApiPath =  "/api/";
const apiVersion = "v1";
const usersPath = "/users";
const authPath = "/auth";

const app = express();
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use(baseApiPath + apiVersion + usersPath, usersRouter);
app.use(baseApiPath + apiVersion + authPath, authRouter);

module.exports = app;
