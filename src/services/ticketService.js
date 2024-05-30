class TicketService {

    constructor(storage){
        this.storage = storage
    }
    async createTicket(email, amount){ 

        const ticketemail = email
        const ticketamount = amount
        const code = Math.random().toString(36).substr(2, 9)
        const date = new Date()

        return await this.storage.createTicket(code,date,ticketamount, ticketemail)
    }

}

module.exports = {TicketService}