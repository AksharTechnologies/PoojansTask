const express = require('express');
const router = express.Router();
// var mongoose  = require("mongoose") ;
// mongoose.promise = global.Promise;
var request = require("request-promise");
var User = require('../models/usermodel');
var ensureAuthenticated = require('../js/authenticate') ;
router.get("/userdetailsview",ensureAuthenticated , (req, res) => {
  console.log('safd')

  console.log(req.session.details);
  console.log('df')

  if (req.session.passport !== undefined && req.session.passport !== null) {
    User.findById(req.session.passport.user, function (err, user) {

      req.session.details = user;
      console.log("as");
      console.log(user)
      // done(err, user);



      if (req.session.details.facebook.token !== null && req.session.details.facebook.token !== '') {
        const userFieldSet = 'id, name , email , picture, likes.limit(5)';

        const options = {
          method: 'GET',
          url: `https://graph.facebook.com/v2.8/Me`,
          qs: {
            access_token: req.session.details.facebook.token,
            fields: userFieldSet
          }
        };

        var parseddata = null;
        request(options)
          .then(fbRes => {
            // res.json(fbRes);
            console.log(JSON.parse(JSON.stringify(fbRes)));
            parsedata = JSON.parse(JSON.stringify(fbRes))

            //console.log(JSON.parse(parsedata).likes) ;

            res.render('userdetails/userdetailsview', {
              email: JSON.parse(parsedata).email,
              imageurl: JSON.parse(parsedata).picture.data.url,
              likes: JSON.parse(parsedata).likes.data,
              fromfacebook: true
            });
          }).catch((err) => {
            console.log(err);
          })
      }

    })

  }

  else {
    console.log('not facebook')
    res.render('userdetails/userdetailsview', {
      fname: req.session.details.firstname,
      lname: req.session.details.lastname,
      mail: req.session.details.email,
      fromfacebook: false
    });

  }

})

  ;
module.exports = router;