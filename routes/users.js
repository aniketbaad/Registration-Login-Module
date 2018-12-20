var express = require('express');
var multer = require('multer');

var router = express.Router();
var upload = multer({dest:'./uploads'});

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


module.exports = router;
