const User = require('../models/User')
module.exports = {
    validateRegistration: async (req, res, next) => {
        const { username, password, passrepeat } = req.body
        const userExists = await User.findOne({ username })
        if (userExists) return res.send({ message: "This name is already in use" })
        if (username.trim().length < 1) return res.send({  message: "Name is required" })
        if (password !== passrepeat) return res.send({message: "Passwords do not match" }) 
        next()
    },
    validateLogin: async(req,res,next) => {
      const {username} = req.body 
      const badlogin = await User.findOne({username})
      if (!badlogin) return res.send({message: 'Please check username or password'})
      next()
    }
  }