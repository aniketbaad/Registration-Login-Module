var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
//var multer = require('multer');
var flash = require('connect-flash');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//To handle file uploads from the form tag in html through input type=file
//var upload = multer({dest:'./uploads'});

app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


//To handle Sessions
app.use(session({
  secret: 'secret',
  saveUninitialized: false,
  resave: true
}));


//Passport used to authenticate the requests. Example: username from the form tag
app.use(passport.initialize());
app.use(passport.session());

//Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param: formParam,
      msg: msg,
      value: value
    };
  }
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//To show flash messages to the user
app.use(flash());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

 //If we get access to user object: show only Member page and logout
 //If we donot get the access: show Register and Login only
 //Changes made in the layout.jade file
app.get('*', function(req, res, next){
  res.locals.user = req.user || null;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/nodeauth', {
  useNewUrlParser: true
}).then(() => {
  console.log("Connected Successfully !!");
}).catch(err => {
  console.log("Could not connect to the database...", err);
  psrocess.exit();
});

module.exports = app;

var apis = require('./routes/users.js')
app.use('/', apis);


app.get('/', (req, res) => {
  res.sendFile('H:/Projects/NodeJS/nodeauth/views/layout.jade');
});
