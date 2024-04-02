const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    userName : {
        type: String,
    },
    message : {
        type: String
    }
})

//virtuals
schema.virtual('id').get(function(){
    return this._id.toString()
})


module.exports = mongoose.model('Chat', schema, 'chats')