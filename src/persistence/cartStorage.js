const { error } = require('console')
const CartModel = require ('../dao/models/cart.model.js')

class cartStorage {

    async createCart(){
        return await CartModel.create({})
    }
    
    async getCartById(cartId){
        
        return await CartModel.find({_id : cartId})

    }

    async  getCartPopulateById(id){

        return await CartModel.find({_id : id}).populate('products.product')

    }

    async addProductToCart(ProductId, CartId){

        console.log(ProductId, CartId)
        //DEJARON DE FUNCIONAR CORRECTAMENTE ?¡?¡?¡
        await CartModel.updateOne(
            {//Filtros
                _id: CartId,
                products : {$not: { $elemMatch:{product : ProductId}}} //Si existe que no lo agregue
            }, 
            {//Modificacion
                $addToSet: // Operador si no existe lo agrega
                {products : { product: ProductId, quantity : 0 }}
            })   

          
        await CartModel.updateOne(
            { //Filtro
                _id: CartId, //Coincide el ID de Carro
                products : { $elemMatch: {product : ProductId}} //Ya existe el elemento
            },//Modificacion 
            {   
                $inc : {"products.$.quantity":1}
            })
       
        
    }

    async findProductInCart(pId){
        return await CartModel.findOne({
            products : { $elemMatch: {product : pId}}
        })
    }

    async deleteProductInCart(cId, pId){
        await CartModel.updateOne(
            { //Filtro
                _id: cId, 
            },
            {   //Elimino el objeto que compla con estas condiciones
                $pull: {products : {product : pId}}
            }   
        )
    }

    async cleanCart(cId){
        
        await CartModel.updateOne(
            { //Filtro
                _id: cId
            },
            {   //Elimino el objeto que compla con estas condiciones
                $unset : {products: []}
            }
        )

    }

    async upDateCart(cId, productArray){
        await CartModel.updateOne(
            {   //busco el carro
                _id: cId
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
    }

    async changeCuantity(cId,pId,newQuantity){
        await CartModel.updateOne(
            { //Filtro
                _id: cId, //Coincide el ID de Carro
                products : { $elemMatch: {product : pId}} //Ya existe el elemento
            },
            {   //Seteo nueva cantidad     
                $set : {"products.$.quantity":newQuantity}
            })

    }
}
module.exports = { cartStorage }