// importing modules
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const routes = require('./api/routes')
const userrouts = require('./api/user_routs')
const jtwsecret = "myjwtsecret";
const jwt=require('jsonwebtoken')


const app = express();

app.use(bodyParser.json())
// app.use(express.static('static'));
//route initialization
app.use('/',routes);

app.use('/user',userrouts);


//error handling middleware
app.use(function(err,req,res,next){
    res.status(422).send({error:err.message});
})





// database connection
mongoose.connect('mongodb://localhost:27017/mernstack',{
    useNewUrlParser: true,
	useUnifiedTopology: true,
	usecreateIndex:true
}).then(() => console.log('MongoDB connected...')).catch((err)=>console.log(err))
mongoose.Promise=global.Promise;

//listen for request
app.listen(process.env.port || 4000,function(){
    console.log('server is running......')
})