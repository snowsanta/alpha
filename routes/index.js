

//***************************
//Auth Routes
//***************************

//show register form
var express = require("express");
var router  = express.Router();
var User    = require("../models/user");
var passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var Teacher = require("../models/teacher.ejs");
var middleware = require("../middleware");  //since our content is inside index file and index file automatically behaves as the root main file so we dont necessarily need to name it here.
// const { isLoggedIn } = require('../middleware');

const { resolve } = require("path");
const stripe = require('stripe')('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');

// // GET checkout
router.get('/checkout', middleware.isLoggedIn, (req, res) => {
    if (req.user.isPaid) {
        req.flash('success', 'Your account is already paid');
        return res.redirect('/students');
    }
    res.render('checkout', { amount: 100 });
});

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  return 100;
};
router.post("/create-payment-intent", async (req, res) => {
  const { items } = req.body;
  // Create a PaymentIntent with the order amount and currency
  try{
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "inr"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  });
    }
    catch(e){

    }
});

//show root route
router.get("/", function(req, res){
  res.render("landing");
});

//show register page
router.get("/register", function(req, res){
    res.render("register");
});

//handle signIn logic
router.post("/register", function(req, res){
    var newUser = new User({
      username: req.body.username,
      email: req.body.email
    });
    if(req.body.adminCode === 'secret_Code'){
        newUser.isAdmin = true;
    }
    if(req.body.typeCode === 'Teacher'){
        newUser.isTeacher = true;
        
    }
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect("/register");
        }
        passport.authenticate("local")(req, res, function(){
           console.log(user);
            req.flash("success", "Welcome " + user.username );
            if(req.body.typeCode === 'Teacher'){
                req.flash("success", " | This is your Teacher ID");
                res.redirect("/");

            }
            else{
             req.flash("success", " | This is your Student ID");
            }
            res.redirect("/");
        });
           
        
    });
});
//show login form
router.get("/login", function(req, res){

    // req.flash("error", "Something went wrong");
    
  
  res.render("login");
});
//handling login logic
router.post("/login", passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash:   true,
    successFlash: 'Welcome to Tutor Delhi'
}), function(req, res){

});

//logout logic
router.get("/logout", function(req,  res){
    req.logout();
    req.flash("success", "Logged You Out");
    res.redirect("/");
});


//User Profile
router.get("/users/:id", function(req, res){
  User.findById(req.params.id, function(err, foundUser){
    if(err){
      req.flash("error", "Something potentially went wrong");
      res.redirect("/");
    }
    else{
      Teacher.find().where('author.id').equals(foundUser._id).exec(function(err, teachers){
        if(err){
          req.flash("error", "Something potentially went wrong");
      res.redirect("/");

        }else{
      res.render("users/show", {user: foundUser, teachers: teachers});    
        }
      });
      
    }
  });
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'delhitutor696@gmail.com',
          pass: 'Team@123'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'delhitutor696@gmail.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            }); 
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'delhitutor696@gmail.com',
          pass: 'Team@123'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'delhitutor696@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    } 
  ], function(err) {
    res.redirect('/teachers');
  });
});

// USER PROFILE
router.get("/users/:id", function(req, res) {
  User.findById(req.params.id, function(err, foundUser) {
    if(err) {
      req.flash("error", "Something went wrong.");
      res.redirect("/");
    }
    Teacher.find().where('author.id').equals(foundUser._id).exec(function(err, teachers) {
      if(err) {
        req.flash("error", "Something went wrong.");
        res.redirect("/");
      }
      res.render("teachers/show", {user: foundUser, teachers: teachers});
    })
  });
});




module.exports = router;