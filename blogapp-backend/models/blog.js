const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comments: [{
      content: {
        type: String,
        minLength: 5
      }
    }]
})

blogSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v

      if (returnedObject.comments) {
      returnedObject.comments = returnedObject.comments.map(comment => {
        const { _id, ...rest } = comment
        return { id: _id, ...rest }
      })
    }
    }
  })

module.exports= mongoose.model('Blog', blogSchema)