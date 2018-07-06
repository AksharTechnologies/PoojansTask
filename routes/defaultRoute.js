const express  = require('express') ;
const router = express.Router();
//var mongoose  = require("mongoose") ;

var User  = require('../models/usermodel')



router.get("/" , (req , res)=>{
    console.log("redirect login view")
    res.redirect("https://" + req.headers['host'] + '/login/loginview' ) ;
    res.finished = true  ;
    res.end();
    
})


module.exports =  router  ;