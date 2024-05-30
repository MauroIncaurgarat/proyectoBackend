const { error } = require('console')
const TicketModel = require ('../dao/models/ticket.model')


class TicketStorage {

    constructor(){}

    async createTicket(code, date ,amount, email){
   
        return  await TicketModel.create ({
            code,
            purchase_datetime: date,
            amount,
            purchaser: email
        })
    }

}

module.exports = { TicketStorage }