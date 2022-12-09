const express = require('express')
const { register, login, getMe, createPost } = require('../controllers/mainController')
const { checkAuth } = require('../utils/checkAuth')
const router = express.Router()

// Register
router.post('/register',register)
// Logins
router.post('/login', login)
//Get me
router.get('/get', checkAuth , getMe)
// POST ROUTE
// create ppost
router.post('/posts', checkAuth, createPost)

module.exports  = router