const express = require('express')
const { register, login, getMe, createPost, getAll, getById, getUploaded, getMyPosts } = require('../controllers/mainController')
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
// get all psot
router.get('/allposts', getAll)
// get by id
router.get('/api/:id', getById)
// get all posts
router.get('/me', checkAuth, getMyPosts)


module.exports  = router