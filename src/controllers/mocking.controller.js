const { generateProduct } = require("../mocks/product.mock")

class MockingController {
    
    constructor(productService) {
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

    async addMockingProduct(req, res) {
        try{  

            let mockProducts = []

            for(let i=0 ; i<100 ; i++){ 
                // Generamos el Producto
                const MockProduct = generateProduct()

                const title = MockProduct.title
                const description = MockProduct.description 
                const price = +MockProduct.price 
                const thumbnail = MockProduct.thumbnail 
                const code = MockProduct.code 
                const stock = +MockProduct.stock 
                // Guardamos
                await this.productService.create(title, code, description, price, stock, thumbnail)
                
                //Mostrar los 50 primeros
                if(i < 50){ 
                    mockProducts.push(MockProduct)
                }
            }

            res.status(200).json({mockProducts})
    
        }catch(err){
            return this.#handleError(err)
        }               
    }

}

module.exports = { MockingController }