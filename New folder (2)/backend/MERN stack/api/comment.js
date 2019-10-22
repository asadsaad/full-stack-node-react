var mongoose = require('mongoose');


var CommentSchema = new mongoose.Schema({
    postid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    content:{
      type: String,
    },
    author:{
      type: String,
      required:true
    }
});

module.exports = mongoose.model("Comment", CommentSchema);