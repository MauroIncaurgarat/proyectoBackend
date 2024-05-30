class CartController {
    
    constructor(cartService, productService) {
        this.cartService = cartService
        this.productService = productService
    }
    #handleError(res,err) {
        
        if(err.message === 'not found') {
            return res.status(404).json({error: 'Not found'})
        }

        if(err.message === 'invalid parameters'){
            return res.status(400).json({error: 'Invalid Parameters'})
        }

        return res.status(500).json({error : err})

    }

    async addCart (_,res){
        try{
            await this.cartService.createCart()
            res.status(200).json('Se Creo Carrito !')

        }catch(err){
            return this.#handleError(err)
        }
    }

    async getCartPopulateById(req,res){
      
        try{ 
            const cartId = await this.cartService.getCartPopulateById(req.params.cId)
            return res.status(200).json(cartId)

        }catch(err){
            return this.#handleError(err)
        }
    }

    async getCartById(req,res){
      
        try{   
            const id = req.params.cId
            const cartId = await this.cartService.getCartById(id)  
            
            return res.status(200).json(cartId)  

        }catch(err){
            return this.#handleError(err)
        }
    }

    async addProductToCart(req,res){
        try { 

            //Busco el Producto y verifico existencia Producto ID
            await this.productService.getProductById(req.params.pId)
            //Busco el Carro y verifico existencia Carro ID
            const cartId = await this.cartService.getCartById(req.params.cId)

            //Sumar Producto 
            await this.cartService.addProductToCart(req.params.pId, cartId)
        
            res.status(200).json('Carrito Actualizado!')
            
        }catch(err){

            return this.#handleError(err)
        }
    }

    async deleteProductToCart(req, res){
        try { 
            //Busco el Producto y verifico existencia Producto ID
            await this.productService.getProductById(req.params.pId)
            //Busco el Carro y verifico existencia Carro ID
            await this.cartService.getCartById(req.params.cId)

            //Eliminar el Producto al Carro
            await this.cartService.deleteProductToCart(req.params.pId, req.params.cId)

            return res.status(200).json('Eliminado con exito')
          
        }catch(err){
            return this.#handleError(err)
        }
    }

    async cleanCart(req,res){
        try{
            //Busco el Carro y verifico existencia Carro ID
            await this.cartService.getCartById(req.params.cId)
           
            //Eliminar el Producto al Carro
            await this.cartService.cleanCart(req.params.cId)

            return res.status(200).json('Cart clean')

        }catch(err){
            return console.log(err)
        }
    }

    async upDateCart(req,res){

        try{

            await this.cartService.upDateCart(req.params.cId, req.body)

            return res.status(200).json(`Carrito ${req.params.cId} actualizado`)

        }catch(err){
            return this.#handleError(err)
        }
    }

    async changeQuantity(req,res){
       
        try{ 
            //Verifico existencia Producto ID
            await this.productService.getProductById(req.params.pId)
            //Verifico existencia Carro ID
            await this.cartService.getCartById(req.params.cId)
            
            const newQuantity = +req.body.quantity
        
            await this.cartService.changeQuantity(req.params.cId,req.params.pId,newQuantity)

            return res.status(200).json("Cantidad Modificada!")
 
        }catch(err){
            return this.#handleError(err)
        }
    }

}

module.exports = { CartController }