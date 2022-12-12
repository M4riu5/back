const User = require('../models/User')
const Post = require('../models/Post')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
module.exports = {
  register : async(req,res) => {
    try {
      const {username, password, passrepeat } = req.body
    // IF USER EXISTS
    const userExists = await User.findOne({username})
    if(userExists) return res.send({error: true, message: 'Please check data', data: 'Bad username'})
    // IF ALL GOOD CREATING USER
    // HASHING AND GETTING SECRET
    const hashPass = await bcrypt.hash(password, 10)
    const newUser = new User({
      username,
      password : hashPass,
      passrepeat,
    })
    const token = jwt.sign({
      id: newUser._id
    }, 
    process.env.JWT_SECRET,
    {expiresIn: '30d'}
    )
    await newUser.save()
    res.send({error: false , message: 'registration successful', data: newUser, token})
    } catch (error) {
      console.log('error -->', error);
    }
  },
  login: async(req,res) => {
    try {
      const {username, password} = req.body
    // IF USERNAME IS IN DB THAN WE CAN TRY LOGIN
    const user = await User.findOne({username})
    // IF NOT
    if(!user) return res.send({error: true, message: 'Incorrect login or password', data: null})
    // IF ALL GOOD
    const correctPassword = await bcrypt.compare(password, user.password);
    // if pass incorect
    if(!correctPassword) return res.send({error: true, message: 'Incorrect login or password', data: null})
    //CREATING TOKEN jopta apping as mongodb userid
    const token = jwt.sign({
      id: user._id
    }, 
    process.env.JWT_SECRET,
    {expiresIn: '30d'}
    )
    res.send({error: false, message: 'Logged in succesfuly', token, user})
    } catch (error) {
      console.log('error -->', error);
    }
  },
  getMe: async(req,res) => {
   try {
    const user = await User.findById(req.userId)
   if(!user) return res.send({error: true, message: 'Incorrect login or password', data: null})

   const token = jwt.sign({
    id: user._id
  }, 
  process.env.JWT_SECRET,
  {expiresIn: '30d'}
  )
  res.send({user, token})
   } catch (error) {
    console.log('error -->', error);
   }
  },
  // POSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
  // createpost
  createPost : async(req,res) => {
   try {
    const {title, text, image} = req.body
    const user = await User.findById(req.userId)

     const newPostWithImage = new Post({
      username: user.username,
      title,
      text,
      imgUlr : image,
      author: req.userId
     })
     console.log('newPostWithImage -->', newPostWithImage);
     await newPostWithImage.save()
     await User.findByIdAndUpdate(req.userId, {
      $push: {posts: newPostWithImage}
     } )
     return res.json(newPostWithImage)
   } catch (error) {
    console.log('error -->', error);
   }
    },
  // Get all psot
  getAll: async(req,res) => {
   try {
    const posts = await Post.find().sort('-createdAt')
   const popularPost = await Post.find().limit(5).sort('-views') 
   if(!posts) {
    return res.json({message: 'No posts sorry'})
   }
   res.json({posts, popularPost})
   } catch (error) {
    console.log('error --> blio', error);
   }
  },
  // by id
  getById: async(req,res) => {
    // req.params.id posto id 
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: {views: 1},
    })
     res.json(post)
  } catch (error) {
    console.log('error ejbat -->', error);
  }
  },
  getMyPosts : async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        const list = await Promise.all(
            user.posts.map((post) => {
                return Post.findById(post._id)
            }),
        )

        res.json(list)
    } catch (error) {
        res.json({ message: 'error gettgin post' })
    }
},
  removepost : async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id)
       if(!post) return res.json({message: 'No post'})
      // IS MASYVO POSTS USERYje istrinti irgi posta 
       await User.findByIdAndUpdate(req.userId , {
        $pull: {posts: req.params.id}
       })
        res.json({message: 'Post deleted'})
    } catch (error) {
        res.json({ message: 'error gettgin post' })
    }
},
  updatePost : async (req, res) => {
   const {title,text,id , image} = req.body
   const post = await Post.findById(id)

  post.title = title
  post.text = text
  post.imgUlr = image

  await post.save()
  res.json(post)
},

}