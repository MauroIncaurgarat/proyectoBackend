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
        //contiene el correo del usuario asociado al carrito
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' //Nombre del modelo
        //Se cargaran los Id de los usuarios
    }
})

module.exports = mongoose.model('Tickets', schema, 'tickets')