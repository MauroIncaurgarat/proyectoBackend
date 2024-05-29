class currentResponse {

    constructor(user){
        this.id = user._id.toString()
        this.firstName = user.firstName
        this.lastName = user.lastName
        this.email = user.email
        this.cartId = user.cartId
    }

}

module.exports = {currentResponse}