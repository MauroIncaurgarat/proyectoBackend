const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    purchase_datetime:{
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    purchaser: {
        type:String
    }
})
schema.virtual('id').get(function(){
    return this._id.toString()
})

module.exports = mongoose.model('Tickets', schema, 'tickets')