const mongoose = require('mongoose')
const PostSchema = new mongoose.Schema({
  username: {
    type:String,
  },
  title: {
    type: String,
     required: true
    },
    text : {
      type: String,
      required: true,
    },
    imgUlr: {
      type: String,
      default: ''
    },
    views: {
      type: Number,
      default: 0
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }],
  },
  {timestamps: true}
)
module.exports = mongoose.model('Post', PostSchema)