const { error } = require('console')

const fs = require('fs')

class ProductManager { 
    //Leer la memoria al iniciar
    async initialize(){
        this.#productos = await this.readProductFromFile()
    }
    #productos
    #pathProducts
    #pathId
    
    constructor(filename, fileId) {
        this.#productos=[]
        this.#pathProducts = filename
        this.#pathId = fileId 
    }
    
    //Obtener Productos
    async getProduct(){
        return await this.readProductFromFile()
    }
    //Obtener Productos por ID
    async getProductById(IdProduct){
        
        //Actualizo base de datos por si hubo un Update
        await this.readProductFromFile()

        //Busco el producto
        const ProductId = await this.#productos.find(Prod => Prod.id === IdProduct)

        if(!ProductId){
            throw new Error("Invalid ID")
        }
        
        return ProductId
    }

    //Agregaro Productos
    async addProduct(title, description, price , thumbnail, code, stock=0) {
         
        //Falto un campo
        if(!title || !description || !price  || !thumbnail || !code || !stock){       
            throw new Error( `Falta un Campo`)
        }

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
            throw new Error( `${Object.keys(Product)[indiceVacio]} is Empty  `)
        }
        //Number Check
        if(isNaN(Product.price)) {
            
            throw new Error("Price must be a number")
            
        }else if(isNaN(Product.stock)){
           
            throw new Error("Stock must be a number")
        }
        //Check Code
        const MemoryProductCode = this.#productos.find(element => element.code == Product.code)
        if(MemoryProductCode){
            throw new Error("Error: Code Repeat")      
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
    //Actualizar producto
    async upDateProduct(ProductData, id){
        
        await this.readProductFromFile()
        //Busco el producto
        const ProductIndexUpDate = this.#productos.findIndex(Prod => Prod.id === id)
        
        if(ProductData.code && ProductData.code != this.#productos[ProductIndexUpDate].code){
            throw new Error ('Cant modify code')
        }

        //actualizar los datos de ese producto en el array
        const ProductDataRefresh = {...this.#productos[ProductIndexUpDate], ...ProductData}
        this.#productos[ProductIndexUpDate] = ProductDataRefresh

        await this.upDateFile()
    }
    //Eliminar Productos
    async deletProductFile(idRemove){

        //Actualizo base de datos por si hubo un Update
        await this.readProductFromFile()
        //Busco el producto
        const ProductIndexId = this.#productos.findIndex(Prod => Prod.id === idRemove)

        if(ProductIndexId<0){
            throw new Error ("No existe Id")
        }

        //eliminar
        this.#productos.splice(ProductIndexId ,1)
        
        await this.upDateFile()
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
    //Actualizar Archivo productos
    async upDateFile (){
        try { 
            await fs.promises.writeFile(this.#pathProducts, JSON.stringify(this.#productos, null,'\t'))
        }catch{
            throw new Error ('Error al actualizar el archivo Prductos')
            
        }
    }

    
    //Obtener Nuevo ID
    async getNewId(){    
        const NewId =  await this.readIdFromFile() + 1
        await this.upDateFileId(NewId)
        return NewId
    }
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
            
            throw new Error ('Error al subir archivo Id')
        }
    }
}

module.exports = ProductManager
