const fs = require('fs')

class ProductManager { 
   
    #productos
    #pathProducts
    #pathId
    
    
    constructor(filename, fileId) {
        this.#productos=[]
        this.#pathProducts = filename
        this.#pathId = fileId 
    }
    
    async initialize(){
        this.#productos = await this.readProductFromFile()
    }
    
    async getProduct(){
        return await this.readProductFromFile()
    }

    async getNewId(){    
        const NewId =  await this.readIdFromFile() + 1
        await this.upDateFileId(NewId)
        return NewId
    }

    async addProduct(title, description, price , thumbnail, code, stock=0) {
        
        const Product = {
            title : title.trim(),  
            description : description.trim(),
            code : code.trim(),
            price,
            status : true ,
            stock ,
            thumbnail : thumbnail.trim()
        }
                            //VALIDACIONES 

        //Empty Check
        const indiceVacio = Object.values(Product).indexOf('')
        if(indiceVacio>=0){      
            console.error( `${Object.keys(Product)[indiceVacio]} is Empty  `)
            return 
        }
        //No ingresar strings en Precio y Stock
        if("number" != typeof(Product.price)) {
            console.error("Error: Price must be a number")
            return
            }else if("number" != typeof(Product.stock)){
            console.error("Error: Stock must be a number")
            return
        }
        //No se Repita Code
        const MemoryProductCode = this.#productos.find(element => element.code == Product.code)
        if(MemoryProductCode){
            console.error("Error: Code Repeat")
            return
        }

        //Imprimo ID
        const FinalProduct = {
            ...Product,
            id : await this.getNewId(), 
        }

        //Enviar Producto al array Productos
        this.#productos.push(FinalProduct)   
        
        await this.upDateFile()
 
    }
 
    async getProductById(IdProduct){
        
        //Actualizo base de datos por si hubo un Update
        await this.readProductFromFile()

        //Busco el producto
        const ProductId = await this.#productos.find(Prod => Prod.id === IdProduct)

        if(ProductId === undefined){
            console.log("Invalid Id")
            return
        }
        
        return ProductId
    }
    


    //Leer Archivo Productos
    async readProductFromFile(){
        try { 
            //Leear mi archivo, guardarlo y pasarlo a objeto nuevamente
            const productsContent = await fs.promises.readFile(this.#pathProducts,'utf-8')
            return JSON.parse(productsContent)
        }
        catch {
            //Si no hay nada en memoria que me devuleva un string vacio
            return []
        }

    }
    //Actualizar base de datos productos
    async upDateFile (){
        try { 
            await fs.promises.writeFile(this.#pathProducts, JSON.stringify(this.#productos, null,'\t'))
        }catch{
            console.log('Error al actualizar el archivo Prductos')
            return
        }
    }
    //Eliminar Productos
    async deletProductFile(idRemove){

        //Actualizo base de datos por si hubo un Update
        await this.readProductFromFile()
        //Busco el producto
        const ProductIndexId = this.#productos.findIndex(Prod => Prod.id === idRemove)

        if(ProductIndexId<0){
            console.log("No existe Id")
            return
        }

        //eliminar
        this.#productos.splice(ProductIndexId ,1)
        
        await this.upDateFile()
    }
    //Actualizar datos de producto
    async upDateProduct(ProductData){

        try { 
            await this.readProductFromFile()
            //Busco el producto
            const ProductIndexUpDate = this.#productos.findIndex(Prod => Prod.id === ProductData.id)
            
            //actualizar los datos de ese producto en el array
            const ProductDataRefresh = {...this.#productos[ProductIndexUpDate], ...ProductData}
            this.#productos[ProductIndexUpDate] = ProductDataRefresh

            await this.upDateFile()
        }catch{
            console.log('No se puede modificar - No existe Producto')
            return 
        }
    }

    //ID
    //Leer Ultimo ID
    async readIdFromFile(){
        try { 
            //Leear mi archivo, guardarlo y pasarlo a objeto nuevamente
            const UltimoId = await fs.promises.readFile(this.#pathId,'utf-8')
            return JSON.parse(UltimoId)
        }
        catch {
            //Si no hay nada en memoria que me devuleva un string vacio
            const idInitial = 0
            return idInitial
        } 

    }
    //Actualizar base de datos ID
    async upDateFileId (NewId){
        try { 
            await fs.promises.writeFile(this.#pathId, JSON.stringify(NewId, null,'\t'))
        }catch{
            console.log('Error al subir archivo Id')
            return
        }
    }
}

module.exports = ProductManager
