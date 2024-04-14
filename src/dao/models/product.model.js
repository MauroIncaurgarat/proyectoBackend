const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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
        min: 1,
        index: true
    },

    status : {
        type: Boolean,
        default: true
    },

    stock : {
        type: Number,
        required: true,
        min: 1,
        index: true
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
schema.plugin(mongoosePaginate)


module.exports = mongoose.model('Product', schema, 'products')
