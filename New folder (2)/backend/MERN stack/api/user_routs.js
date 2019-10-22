const express = require('express')
const router = express.Router();
const User = require('./user')
const bcrypt = require('bcryptjs')
const Profile = require('./profile')
const jtwsecret = "myjwtsecret";
const jwt=require('jsonwebtoken')
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './static/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({
  storage: storage,
});











router.post('/register',function(req,res,next){
	// res.send('register')
	const {UserName,email,password }= req.body
	if (!UserName || !email || !password ) {
		return res.status(400).json({msg:'Please enter all fields'})
	}
	User.findOne({email:email}).then(user=>{
		if (user) res.status(400).json({msg:'user already exists'})
		const newUser=new User({
			UserName,
			email,
			password,
		});
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(newUser.password,salt,(err,hash)=>{
				if(err) throw err;
				newUser.password=hash;
				newUser.save().then(user=>{
					jwt.sign({
						id:user.id},
						jtwsecret,
						(err,token)=>{
							if (err) throw err;
							res.json({
							token,
							user:{
								id:user.id,
								UserName:user.UserName,
								email:user.email
							}
						})
						}
						)

					
				})
			})
		})	
	})
    

})



router.post('/login',function(req,res,next){
	// res.send('register')
	const {email,password }= req.body
	if ( !email || !password ) {
		return res.status(400).json({msg:'Please enter all fields'})
	}
	User.findOne({email:email}).then(user=>{
		if (!user) res.status(400).json({msg:'user doesnot exists'})



		bcrypt.compare(password,user.password).then(isMatch=>{
			if (!isMatch) return res.status(400).json({msg:'Invalid Credentials'})
			jwt.sign({
						id:user.id},
						jtwsecret,
						(err,token)=>{
							if (err) throw err;
							res.json({
							token,
							user:{
								id:user.id,
								UserName:user.UserName,
								email:user.email
							}
						})
					}
				)	

		})


	})
    

})


function auth(req,res,next){
	try{
		const token=req.header('x-auth-token');
	if (!token) return res.status(401).json({msg:"no token authorization denied"})

	const decoded=jwt.verify(token,jtwsecret);
	req.user=decoded;
	next()	
	}
	catch(e){
		res.status(400).json({msg:'token is not valid'})
	}
	
	}




router.get('/user',auth,(req,res)=>{
	User.findById(req.user.id).select('-password').then(user=>res.json(user))
})





router.post('profile/:id',upload.single('pic'),async (req,res,next)=>{
	const user= await User.findById(req.params.id);
	const data = {
	  user:req.params.user,
	  bio:req.file.path,
	  pic:req.body
	}

	const profile= new Profile();
	profile.user=req.body.user;
	profile.bio=req.body.bio;
	profile.pic=req.file.path;

	await profile.save()
	// User.profile.push(profile._id)
	// await User.save()
	res.send(profile)

})






module.exports=router;
