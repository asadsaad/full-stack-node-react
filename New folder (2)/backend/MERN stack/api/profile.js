var mongoose = require('mongoose');


var ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bio:{
      type: String,
      required:true
    },
    pic:{
      type: String,
      required:true
    }
});

module.exports = mongoose.model("Profile", ProfileSchema);