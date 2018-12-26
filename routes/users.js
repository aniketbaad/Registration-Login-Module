var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer({dest:'./uploads'});

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../model/model');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {
    'title': 'Register'
  });
});

router.get('/login', function(req, res, next){
  res.render('login', {
    'title': 'Login'
  });
});

router.post('/register', upload.single('profileImage'),function(req, res, next){
  //Post variables
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  console.log(name);

  if(req.file){
    console.log('File is Uploading..');

    //File Info
    var profileImageOriginalName = req.file.originalname;
    var profileImageName = req.file.filename;
    console.log(profileImageName);
    var profileImageMime = req.file.mimetype;
    var profileImagePath = req.file.path;
    //var profileImageExt = req.files.extension;
    var profileImageSize = req.file.size;
  }
  else {
    //Default Image
    var profileImageName = 'noimage.png';
  }

  //Form Validation
  req.checkBody('name', 'Name Field is required').notEmpty();
  req.checkBody('email', 'Not a Valid Email').isEmail();
  req.checkBody('email', 'Email Field is required').notEmpty();
  req.checkBody('username', 'Username is required').notEmpty();
  req.checkBody('password', 'Password is required').notEmpty();
  req.checkBody('password2', 'Please confirm your password').notEmpty();
  req.checkBody('password2', 'Password did not match').equals(req.body.password);

  //Express Validator use
  var errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors: errors,
      name: name,
      email: email,
      username: username,
      password: password,
      password2: password2
    });
  }
  else {
    var newUser = new User({
      username: username,
      password: password,
      email: email,
      name: name,
      profileimage: profileImageName
    });

    User.createUser(newUser, (err, user) => {
        if(err)throw err;
        console.log(user);
    });

    req.flash('success', 'Registered Successfully !!');

    res.location('/');
    res.redirect('/');
  }
});

passport.serializeUser(function(user, done){
  done(null, user.id);
});

passport.deserializeUser(function(id, done){
  User.getUserById(id, function(err, user){
    done(null, user);
  });
});


passport.use(new LocalStrategy(
  function(username, password, done){
    User.getUserByUsername(username, function(err, user){
      if(err) return done(err);
      if(!user){
        console.log('Unknown user');
        return done(null, false, {message: 'Invalid User'});
      }
      User.comparePassword(password, user.password, function(err, isMatch){
        if(err) return done(err);
        if(isMatch){
          console.log('Authentication Successfull');
          return done(null, user);
        }else{
          console.log('Invalid Password');
          return done(null, false, {message: 'Invalid Password'});
        }
      })
    });
  }
));


router.post('/login', passport.authenticate('local', {failureRidirect: '/users/login', failureFlash: 'Invalid Username or Password!'}),
function(req, res){
    console.log(req.body.username);
    console.log('Authentication Successfull!!');
    req.flash('sucess', 'You are logged in!');
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'You have Logged Out');
  res.redirect('/users/login');
})
module.exports = router;
