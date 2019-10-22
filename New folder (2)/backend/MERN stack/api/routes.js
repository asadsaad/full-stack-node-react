const express = require('express')
const router = express.Router();
const Post = require('./models')
const Comment = require('./comment')

// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, './static/');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
//   }
// });

// const upload = multer({
//   storage: storage,
// });



// get list of objects from database
router.get('/posts',function(req,res,next){
    const posts = Post.find({}).then(function(posts){
        res.send(posts)
    });

})

router.get('/post/:id',function(req,res,next){
  const post = Post.find({_id:req.params.id}).then(function(post){
      res.send(post)
  });

})





router.get('/comments',function(req,res,next){
  const comments = Comment.find().populate('postid').then(function(comment){
      res.send(comment)
  });

})

router.get('/comments/:id',function(req,res,next){
  const post=Post.findById(req.params.id)
  const comments = Comment.find({post:req.param.id}).populate('postid').then(function(comment){
      res.send(comment)
  });

})



router.post('/comment-create/:id',async (req,res,next)=>{
      const post= await Post.findById(req.params.id);
      const data = {
        postid:req.params.id,
        content:req.body.content,
        author:req.body.author
      }

      const comment = new Comment();
      comment.postid=req.params.id;
      comment.content=req.body.content;
      comment.author=req.body.author;

      await comment.save()
      post.comments.push(comment._id)
      await post.save()
      res.send(comment)

})

// router.get('posts/:qs',function(req,res,next){

//       const posts = Post.find({text:req.params.qs).then(function(posts){
//         res.send(posts)
//     });

//   }



// create objects in database
router.post('/create-post',function(req,res,next){
    const data={
      text:req.body.text,
      author:req.body.author,
      // if(productImage){
      // productImage: req.file.path 


      // }

    }
    console.log(data)

    Post.create(data).then(function(post){
        res.send(post)
    }).catch(function(err){
      console.log(err)
    })
    
})

// update objects in database
router.put('/update-post/:Id',function(req,res,next){
    Post.findByIdAndUpdate({_id:req.params.Id},req.body).then(
        function(){
            Post.findOne({_id:req.params.Id}).then(
                function(post){
                    res.send(post)
                })
            
        })

})

// get list of objects from database
router.delete('/delete-post/:Id',function(req,res,next){
    Post.findByIdAndRemove({_id:req.params.Id}).then(
        function(post){
            res.send(post)
        }
    )

})

router.get('/users', paginatedResults(Post), (req, res) => {
    res.json(res.paginatedResults)
})



function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }












module.exports=router;