const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    products : {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product' //Nombre del modelo
                }
            }    
        ],
        default: []
    }
})

//virtuals
schema.virtual('id').get(function(){
    return this._id.toString()
})


module.exports = mongoose.model('Cart', schema, 'carts')