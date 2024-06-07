const { error } = require('console')
const UserModel = require ('../dao/models/user.model')
const { hashPassword } = require('../utils/hashing')

class UserStorage {

    constructor(){}

    async find(email){
        return UserModel.findOne({email})
    }

    async findUserCartId(cId){
    
        return await UserModel.findOne({cartId : cId})
    }

    async findOneUser(idFromSession){
        return await UserModel.findOne({_id: idFromSession})
    }

    async setCartId(email, cartId){
        await UserModel.updateOne(
            { //Filtro
                email: email, //Buscar Email
            },
            {   //Seteo nueva cantidad     
                $set : {cartId}
            }
        )
    }

    async upDatePassword(email, newpassword){
        await UserModel.updateOne(
            { //Filtro
                email: email, //Buscar Email
            },
            {   //Seteo nueva cantidad     
                $set : {password: hashPassword(newpassword)}
            }
        )
    }
}

module.exports = { UserStorage }