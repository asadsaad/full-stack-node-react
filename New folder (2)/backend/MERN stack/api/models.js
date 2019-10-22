const mongoose = require('mongoose');
const moment = require('moment')
const Schema = mongoose.Schema;

const Comment = require('./comment')



//createing model
const PostSchema = new Schema({
    text:{
        type:String,
        required:[true,'This Field is required']
    },
    created_at:{
        type:Date,
        default: new Date()
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
      }],
    author:{
        type:String,
        required:true
    },
    // productImage: { 
    //     type: String,
    //     required:true 
    // }  
})

const Post = mongoose.model('post',PostSchema)

module.exports = Post;