const express = require('express')
const app = express()
const colors = require('colors')
const cors = require('cors')
require('dotenv').config()
const http = require('http').createServer(app)
const dbconnect = require('./utils/database')
const router = require('./routes/mainRouter')
const fileUpload = require('express-fileupload')


// Midlewarre
app.use(cors())
app.use(express.json())
app.use(fileUpload())
app.use(express.static('uploads'))
// Routes
app.use('/', router)


// Server CONFIG
const PORT = process.env.PORT || 5000;
http.listen(PORT, console.log(`Server is running on ${PORT} port`.bgWhite.bold));
// MONGODB CONFIG
dbconnect();
