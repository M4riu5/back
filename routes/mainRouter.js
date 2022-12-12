const express = require('express')
const { register, login, getMe, createPost, getAll, getById, getUploaded, getMyPosts, removepost, updatePost } = require('../controllers/mainController')
const { checkAuth } = require('../utils/checkAuth')
const { validateRegistration, validateLogin } = require('../utils/validator')
const router = express.Router()

// Register
router.post('/register',validateRegistration ,register)
// Logins
router.post('/login',validateLogin, login)
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
// delete single post
router.delete('/del/:id', checkAuth, removepost)
// Update
router.put('/del/:id', checkAuth, updatePost)

module.exports  = router