const mongoose = require('mongoose')


const schema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },

    description : {
        type: String,
        required: true
    },

    code : {
        type: String,
        required: true,    
        unique: true
    },

    price:{
        type: Number,
        required: true,
        min: 1
    },

    status : {
        type: Boolean
    },

    stock : {
        type: Number,
        required: true,
        min: 1
    },

    thumbnail : {
        type: String,
        required: true
    }
})

//virtuals
schema.virtual('id').get(function(){
    return this._id.toString()
})


module.exports = mongoose.model('Product', schema, 'products')
