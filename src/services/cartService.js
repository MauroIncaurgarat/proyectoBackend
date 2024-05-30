class CartService {

    constructor(storage){
        this.storage = storage
    }

    async createCart(){
        return await this.storage.createCart()
    }
    
    async getCartById(id){   
        return await this.storage.getCartById(id)
    }

    async getCartPopulateById(id){
        return await this.storage.getCartPopulateById(id)
    }

    async addProductToCart(ProductId, CartId){
        await this.storage.addProductToCart(ProductId, CartId)  
    }

    async deleteProductToCart(pId, cId){
    
        //Eliminar Producto
        //const existProduct = await this.storage.findProductInCart(pId)
                
        //if(!existProduct){ 
          //  throw new Error("No existe el producto en el carro")
        //}
        
        //Eliminar producto del carrito
        await this.storage.deleteProductInCart(pId, cId)

    }

    async cleanCart(cId){
        await this.storage.cleanCart(cId)
    }

    async upDateCart(cId, productArray){
        await this.storage.upDateCart(cId, productArray)
    }

    async changeQuantity(cId,pId,newQuantity){
        const result = await this.storage.changeQuantity(cId,pId,newQuantity)

        if(result.matchedCount === 0){
            throw new Error("No existe el producto en el carro")
        }
    }
    
    async getProductInCart(id){
        
        const Cart = await this.storage.getCartById(id)
        const productInCart = Cart[0].products
        /*
        if(productInCart.length == 0){
          return res.status(404).json('Error')
        }
        */

        return productInCart.map(u => u.toObject({virtuals: true}))
       
    }



}

module.exports = { CartService }