const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//createing model
const UserSchema = new Schema({
    UserName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    }, 
    password:{
        type:String,
        required:true
    },


    created_at:{
        type:Date,
        default:new Date()
    }
})


































const User = mongoose.model('user',UserSchema)


module.exports = User;

