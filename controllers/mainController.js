const userSchema = require('../models/User')
const PostSchema = require('../models/Post')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require("path")
module.exports = {
  register : async(req,res) => {
    const {username, password } = req.body
    // IF USER EXISTS
    const userExists = await userSchema.findOne({username})
    if(userExists) return res.send({error: true, message: 'Please check data', data: 'Bad username'})
    // IF ALL GOOD CREATING USER
    // HASHING AND GETTING SECRET
    const hashPass = await bcrypt.hash(password, 10)
    const newUser = new userSchema({
      username,
      password : hashPass,
    })
    const token = jwt.sign({
      id: newUser._id
    }, 
    process.env.JWT_SECRET,
    {expiresIn: '30d'}
    )
    await newUser.save()
    res.send({error: false , message: 'registration successful', data: newUser, token})
  },
  login: async(req,res) => {
    const {username, password} = req.body
    // IF USERNAME IS IN DB THAN WE CAN TRY LOGIN
    const user = await userSchema.findOne({username})
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
  },
  getMe: async(req,res) => {
   const user = await userSchema.findById(req.userId)
   if(!user) return res.send({error: true, message: 'Incorrect login or password', data: null})

   const token = jwt.sign({
    id: user._id
  }, 
  process.env.JWT_SECRET,
  {expiresIn: '30d'}
  )
  res.send({user, token})
  },
  // POSTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT
  createPost : async(req,res) => {
    const {title, text} = req.body
    const user = await userSchema.findById(req.userId)
    if(req.files) {
      let fileName = Date.now().toString() + req.files.image.name
      req.files.image.mv(path.join(__dirname, '..', 'uploads', fileName))

     const newPostWithImage = new PostSchema({
      username: user.username,
      title,
      text,
      imgUrl: fileName,
      author: req.userId
     })
     await newPostWithImage.save()
     await userSchema.findByIdAndUpdate(req.userId, {
      $push: {posts: newPostWithImage}
     } )
     return res.json(newPostWithImage)
    }

    const newPostWithoutImage = new PostSchema({
      username: user.username,
      title,
      text,
      imgUrl: '',
      author: req.userId,
    })
    await newPostWithoutImage.save()
    await userSchema.findByIdAndUpdate(req.userId, {
      $push: {posts: newPostWithoutImage}
    })
    res.send(newPostWithoutImage)
  }
}