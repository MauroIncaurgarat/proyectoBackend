class TicketController {
    
    constructor(ticketService, cartService, productService, userService) {
        this.ticketService = ticketService
        this.cartService = cartService
        this.productService = productService
        this.userService = userService
    }
    async purchase(req,res){
        try{ 
            const cartId = req.params.cId
            //Acumuladores
            let accSeller = []
            let accDontSeller = []
            let amount = 0
            let ticket = {}

            //Encontrar Usuario del Carro
            const userCart = await this.userService.findUserCartId(cartId)
            
            //Obtengo los productos
            const productInCart = await this.cartService.getProductInCart(cartId)
            
            //Verifico Stock
            for(let i=0; i < productInCart.length; i++){
               
                const productInStorage = await this.productService.getProductById(productInCart[i].product)

                if(productInStorage[0].stock && productInCart[i].quantity <= productInStorage[0].stock && productInCart[i].quantity > 0){

                    //Guardo los productos que puedo vender
                    accSeller.push(productInCart[i])
                   
                    //Sumo el total
                    amount +=  productInStorage[0].price * productInCart[i].quantity    

                }else if(productInCart[i].quantity > 0){

                    //Guardo los productos que no puedo vender
                    accDontSeller.push(productInCart[i])
                }       
               
            }
            
            //STOCK Y TICKET
            if(accSeller){        
                
                // Manejo de Stock
                for(let i=0; i < accSeller.length; i++){ 
                    
                    
                    //Eliminar del Stock
                    await this.productService.reduceStock(accSeller[i].id,accSeller[i].quantity)
                
                    //Sacar Productos del Carro
                    await this.cartService.deleteProductToCart(accSeller[i].product ,cartId)
                }
               
                ticket = await this.ticketService.createTicket(userCart.email, amount)
            }

            return res.json({"Productos Comprados" : accSeller , "Ticket" : ticket , "No puede comprar" : accDontSeller})           
           
        }catch(err){
             console.log(err)
        }
            
    }
}

module.exports = { TicketController }