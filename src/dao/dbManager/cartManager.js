const { error } = require('console')
const CartModel = require ('../models/cart.model.js')

class CartManager{

       
    //le debo pasar un array de objetos
    async addCart (){
        try{
            await CartModel.create({})
        }catch{
            throw new Error('Error interno al agregar carro')
        }
    }

    async getCartById(id){
      
        try{ 
            return await CartModel.find({_id : id})
        }catch{
            throw new Error("Invalid Cart ID")
        }
    }

    async getCarts(){


    }

    async addProductToCart(ProductId, CartId){
        

        try { 
            await CartModel.updateOne(
                { //Filtro
                    _id: CartId, //Coincide el ID de Carro
                    products : { $elemMatch: {product : ProductId}} //Ya existe el elemento
                }, 
                {   
                    $inc : {"products.$.quantity":1}
                    
                }
            
            )

            //Sumar Producto SI NO EXISTE 
            
            await CartModel.updateOne(
                //Filtros
                {_id: CartId,
                 products : {$not: { $elemMatch:{product : ProductId}}} //Si existe que no lo agregue
                }, 

                {$addToSet: // Operador si no existe lo agrega
                    {products : { product: ProductId, quantity : 1 }}
        
            })
            
            //Incrementar Campo
            

            
        }catch(err){
            throw new Error(err)

        }
     }
    }

module.exports = CartManager