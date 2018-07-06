var express  = require('express') ;
var fs = require('fs');

//var mongoose  = require("mongoose")
var exphbs  = require('express-handlebars') ;
//const session = require('express-session');
const bodyParser  = require("body-parser") ;
const flash  =  require('connect-flash') ;
const passport  = require('passport') ;
const path  = require('path');
const passportsetup  =  require('./config/passport')(passport);
const session = require('express-session');


var mongoose  = require('mongoose') ;

mongoose.promise = global.Promise;

mongoose.connect('mongodb://localhost/facebook',{}).then(()=>{
    console.log('mongodb connected') ;
}).catch((err)=>{
    console.log(err) ;
}) ;

// const methodOverride   = require('method-override') ;
var https = require('https');
var app  = express();
var options = {
    key: fs.readFileSync( path.join(__dirname ,'ssl' , 'server.key')),
    cert: fs.readFileSync( path.join(__dirname , 'ssl' , 'server.crt')),
};


https.createServer(options, app).listen(3443 , ()=>{
    console.log('listening on port  3443') ;
}) ;

// app.listen(8563 , ()=>{
//     console.log('listening on port  9963') ;
// }) ;
// ;

app.use(session({
    secret:'mysecret',
    resave:true ,
    saveUninitialized: true 

}))

app.use(flash()) ;

app.use(function(req , res , next){
    res.locals.message = req.flash('message') ;
    next();
}) ;

app.engine('handlebars' , exphbs({
    defaultLayout:"main"
})) ;

app.set('view engine' , 'handlebars') ;
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// app.use(session({
//     secret:'secret',
//     resave:true ,
//     saveUninitialized: true 
// }))

// app.use(flash()) ;
// app.use(function(req , res , next){
//     res.locals.message = req.flash('message') ;
//     next();
// }) ;

app.use(passport.initialize());
app.use(passport.session());



var loginRouter  = require('./routes/loginroute') ;
var authFaceBookRoute  = require('./routes/authFaceBookRoute') ;
var detailsRoute  = require('./routes/detailsRoute') ;
// var defaultRoute  = require('./routes/defaultRoute') ;
// var usersrouter  = require('./routes/users') ;


// app.use('/' , defaultRoute) ;
app.use('/login' , loginRouter) ;
app.use('/auth' , authFaceBookRoute) ;
app.use('/details' , detailsRoute) ;

// app.get("/" , (req , res)=>{
//     console.log("redirect login view")
//     res.redirect("https://" + req.headers['host'] + '/login/loginview' ) ;
//     res.finished = true  ;
//     res.end();
    
// })





// app.use("/users" , usersrouter) ;



