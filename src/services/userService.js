class UserService {

    constructor(storage){
        this.storage = storage
    }

    async find(email){
        return await this.storage.find(email)  
    }

    async findOneUser(idFromSession){
        return await this.storage.findOneUser(idFromSession)
    }

    async upDatePassword(email,password ){
        await this.storage.upDatePassword(email, password)
    }

}

module.exports = {UserService}