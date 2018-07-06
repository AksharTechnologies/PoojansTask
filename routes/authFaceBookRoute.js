
const express = require('express');
const router = express.Router();
// var mongoose  = require("mongoose") ;
var passport = require("passport");
// mongoose.promise = global.Promise;
var ensureAuthenticated = require('../js/authenticate') ;


router.get('/facebook', passport.authenticate('facebook', {
  scope: ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/details/userdetailsview/',
    failureRedirect: '/login/loginview'
  }));



module.exports = router;
