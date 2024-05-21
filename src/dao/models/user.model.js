const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'user'
    },
    cartId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart' //Nombre del modelo
        //Se cargaran los Id de los usuarios
    }
})

module.exports = mongoose.model('User', schema, 'users')