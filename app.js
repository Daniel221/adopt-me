const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const lessMiddleware = require('less-middleware');
const logger = require('morgan');
const hbs = require('express-handlebars');
const passport = require('passport');
const cookieSession = require('cookie-session');

require('dotenv').config();
require('./config/passport');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const animalsRouter = require('./routes/animals');
const profileRouter = require('./routes/profile');
const authRouter = require('./routes/auth');

const app = express();

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2'],
}))
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next)=>{
  if(req.user){
    req.logMethod = {method: "logout", route: "/auth/logout"};
  }else{
    req.logMethod = {method: "login", route: "/auth/login"};
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/animals', animalsRouter);
app.use('/profile', profileRouter);
app.use('/auth', authRouter);

// catch 404 & 400
app.use(function (req, res) {
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE')
    res.status(400).render('error', {
      status: "400 Bad Request"
    });
  res.status(404).render('error', {
    status: "404 Not found"
  });
});

module.exports = app;