const express = require('express');
const router = express.Router();
var bcrypt = require('bcrypt');
//var mongoose  = require("mongoose") ;

var ensureAuthenticated = require('../js/authenticate') ;

var User = require('../models/usermodel')

router.get("/loginview", (req, res) => {
    console.log("called login view")
    res.render('login/loginview');
})
router.get("/signin", (req, res) => {
    console.log("signin")
    res.render('login/loginview', {
        signinvisibility: 'visible',
        signindisplay: 'display',
        signupvisibility: 'hidden',
        signupdisplay: 'none',
    });
})

router.get("/signup", (req, res) => {
    console.log("signup")
    res.render('login/loginview', {
        signinvisibility: 'hidden',
        signindisplay: 'none',
        signupvisibility: 'visibile',
        signupdisplay: 'block',
    });
})

router.get("/", (req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + '/login/loginview' });
    console.log("redirect login view")
})

router.get("/logout", (req, res) => {
    console.log("logout");
    req.session == null;
    
    req.session.destroy(function (err) {
        res.redirect("https://" + req.headers['host'] + '/login/loginview');
        res.finished = true
        res.end();
    });
})
router.post("/loginview", (req, res) => {
    console.log("https://" + req.headers['host'] + '/details/userdetailsview')
    //res.redirect("http://" + req.headers['host'] + '/details/userdetailsview');

    console.log(req.body);

    var errors = new Array();
    if (req.body.email === '' || req.body.email === undefined) {
        errors.push({ text: "email is not present" })
    }
    if (req.body.password === '' || req.body.password === undefined) {
        errors.push({ text: "password is not present" })
    }
    if (errors.length > 0) {
        res.render('login/loginview', {
            signinvisibility: 'visible',
            signindisplay: 'display',
            signupvisibility: 'hidden',
            signupdisplay: 'none',
            errors: errors
        });

    } else {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) {
                    throw err
                }
                console.log(req.body.password)
                console.log(hash.toString().trim())
                console.log(req.body.email)
                User.findOne({ email: req.body.email.toString().trim() }).then((returnedUser) => {

                    console.log(returnedUser);
                    if (returnedUser !== null) {

                        var isverified = false;
                        var actualresponse = res;
                        bcrypt.compare(req.body.password.trim(), returnedUser.password.trim(), function (err, res) {
                            if (err) {
                                throw err;
                            } else {
                                isverified = true;
                                console.log(isverified)
                                if (isverified === true) {
                                    console.log(1)

                                    req.session.details = returnedUser;
                                    actualresponse.redirect("https://" + req.headers['host'] + '/details/userdetailsview');
                                    actualresponse.finished = true
                                    actualresponse.end();
                                }
                            }
                        });

                    } else {
                        console.log(2)
                        res.redirect("https://" + req.headers['host'] + '/login/loginview');
                        res.finished = true
                        res.end();
                    }
                }, (rejectedValue) => {
                    res.redirect("https://" + req.headers['host'] + '/login/loginview');
                    res.finished = true
                    res.end();
                    console.log(3)
                }).catch((err) => {
                    res.redirect("https://" + req.headers['host'] + '/login/loginview');
                    res.finished = true
                    res.end();
                    console.log(4) 
                })
            })
        })
    }
})
router.post("/register", (req, res) => {
    console.log(req.body)
    var errors = new Array();

    User.findOne({ email: req.body.email.toString().trim() }).then((returnedUser)=>{
        if(returnedUser !== null ){
            errors.push({ text: "Email-id exists" })
        }
    })

    var showsignup = true;

    if (req.body.email === '' || req.body.email === undefined) {
        errors.push({ text: "Email field is blank" })
    }
    if (req.body.passwd === '' || req.body.passwd === undefined) {
        errors.push({ text: "Password field is blank" })
    }
    if (req.body.checkpassword === '' || req.body.checkpassword === undefined) {
        errors.push({ text: "Check password field is blank" })
    }
    if (req.body.checkpassword !== req.body.passwd) {
        console.log(req.body.checkpassword);
        console.log(req.body.password);
        errors.push({ text: "Password and check password fields dont match" })
    }

    if (req.body.firstname === '' || req.body.firstname === undefined) {
        errors.push({ text: "First name field is blank" })
    }
    if (req.body.lastname === '' || req.body.lastname === undefined) {
        errors.push({ text: "Last name field is blank" })
    }
    if (errors.length > 0) {
        res.render('login/loginview', {
            errors: errors,
            signinvisibility: 'hidden',
            signindisplay: 'none',
            signupvisibility: 'visibile',
            signupdisplay: 'block',
            email : req.body.email ,
            firstname  : req.body.firstname ,
            lastname: req.body.lastname ,
        })
    } else {
        saveUser(req.body);
        //req.flash('message' , 'You have registered successfully. Now you can login with your credentials')
       // res.writeHead(301, { "Location": "https://" + req.headers['host'] + '/login/loginview' });
        res.render('login/loginview', {
            signinvisibility: 'visible',
            signindisplay: 'display',
            signupvisibility: 'hidden',
            signupdisplay: 'none',
            message: 'You have registered successfully. Now you can login with your credentials'
        });
    }
})

function saveUser(body) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(body.passwd, salt, (err, hash) => {
            if (err) {
                throw err
            }
            // newuser.password= hash ;
            // new usersmodel(newuser).save().then((nu)=>{
            //      res.redirect('/users/login');
            // })
            new User({
                email: body.email,
                firstname: body.firstname,
                lastname: body.lastname,
                password: hash,
                facebook: {
                    token: "",
                    name: "",
                    id: ""
                }
            }).save().then((result) => {
            }).catch((err) => {
                console.log(err);
            });
        })
    })
}

module.exports = router;