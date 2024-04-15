const { error } = require('console')
const CartModel = require ('../models/cart.model.js')

class CartManager{      
   
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

    async addProductToCart(ProductId, CartId){
        try { 
            //Sumar Producto SI NO EXISTE 
            await CartModel.updateOne(
                {//Filtros
                    _id: CartId,
                    products : {$not: { $elemMatch:{product : ProductId}}} //Si existe que no lo agregue
                }, 
                {//Modificacion
                    $addToSet: // Operador si no existe lo agrega
                    {products : { product: ProductId, quantity : 0 }}
            })   
            //Aumentar la cantidad si ya existe 
            await CartModel.updateOne(
                { //Filtro
                    _id: CartId, //Coincide el ID de Carro
                    products : { $elemMatch: {product : ProductId}} //Ya existe el elemento
                },//Modificacion 
                {   
                    $inc : {"products.$.quantity":1}
                    
                }
            )

        }catch(err){
            throw new Error(err)
        }
    }

    async deleteProductToCart(ProductId, CartId){
        try { 
            //Eliminar Producto
            const hola = await CartModel.findOne({products : { $elemMatch: {product : ProductId}}})
          
            if(!hola){ 
                throw new Error("No existe el producto en el carro")
            }

            await CartModel.updateOne(
                { //Filtro
                    _id: CartId, 
                },
                {   //Elimino el objeto que compla con estas condiciones
                    $pull: {products : {product : ProductId}}
                }
            )
        }catch(err){
            throw new Error(err)
        }
    }

    async clearCart(CartId){
        //Mejorar
        try { 
            await CartModel.updateOne(
                { //Filtro
                    _id: CartId, 
                },
                {   //Elimino el objeto que compla con estas condiciones
                   $unset : products
                }
            )
        }catch(err){
            throw new Error(err)
        }
    }

    async upDateCart(CartId,productArray){

        try{
            await CartModel.updateOne(
                {   //busco el carro
                    _id: CartId
                },
                {   //Agrega en el caso que no exista
                    //Si existe mantiene el valor original
                    $addToSet: { products: {$each: productArray} }
                }
            )
            /*
            En caso de que el array sean solo id de productos
            const newArray = await productArray.map((element)=>{ 
                return {producto : element, quantity : 1}
                })
            */
        }catch{
             throw new Error(err)
        }
    }

}

module.exports = CartManager