const { error } = require('console')
const fs = require('fs')

class CartManager{

    async initialize(){
        this.#carts = await this.readCartFromFile()
    }

    #carts
    #pathCarts
    #pathIdCarts

    constructor(fileNameCart, fileIdCart){
        this.#carts=[]
        this.#pathCarts = fileNameCart 
        this.#pathIdCarts  = fileIdCart
    }

    //le debo pasar un array de objetos
    async addCart (){

        const cart = {
            id: await this.getNewCartId(),
            product:[],
        }
        this.#carts.push(cart)

        await this.upDateCartFile()
    }


    async readCartFromFile(){
        try { 
            //Leear mi archivo, guardarlo y pasarlo a objeto nuevamente
            const cartContent = await fs.promises.readFile(this.#pathCarts,'utf-8')
            return JSON.parse(cartContent)
        }
        catch {
            //Si no hay nada en memoria que me devuleva un string vacio
            return []
        }

    }
    async upDateCartFile (){
        try { 
            await fs.promises.writeFile(this.#pathCarts, JSON.stringify(this.#carts, null,'\t'))
        }catch{
            throw new Error ('Error al actualizar el archivo Carts')
        }
    }
    async getCartById(IdCart){
        
        //Actualizo base de datos por si hubo un Update
        await this.readCartFromFile()
        
        //Busco el producto
        const cartId = await this.#carts.find(Cart => Cart.id === IdCart)
       
        if(!cartId){
            throw new Error("Invalid ID")
        }
        
        return cartId
    }




    async readIdFromFile(){
        try { 
            //Leear mi archivo, guardarlo y pasarlo a objeto nuevamente
            const UltimoIdCart = await fs.promises.readFile(this.#pathIdCarts,'utf-8')
            return JSON.parse(UltimoIdCart)
        }
        catch {
            //Si no hay nada en memoria que me devuleva un string vacio
            const idInitial = 0
            return idInitial
        } 

    }
    async upDateFileId (NewId){
       
        try { 

            await fs.promises.writeFile(this.#pathIdCarts, JSON.stringify(NewId, null,'\t'))

        }catch{
            
            throw new Error ('Error al subir archivo CartId')
        }
    }
    async getNewCartId(){    
        const NewId =  await this.readIdFromFile() + 1
        await this.upDateFileId(NewId)
        return NewId
    }


}

module.exports = CartManager