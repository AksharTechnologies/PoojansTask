var  mongoose  = require('mongoose') ;
var userSchema = new  mongoose.Schema({
email :{
        type:"string" ,
        require : true
} ,
firstname :{
        type:"string" ,
        require : true
} ,
lastname:{
        type:"string" ,
        require : true
} ,
password:{
        type:"string" ,
        require : true
} ,

facebook: {
        token :{
                type:"string" ,
                require : true
        } ,
        name :{
                type:"string" ,
                require : true
        } ,
        id :{
                type:"string" ,
                require : true
        }
        }
})
var userModel  = mongoose.model('User', userSchema) ;

module.exports  = userModel ;