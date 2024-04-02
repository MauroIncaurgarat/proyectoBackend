const { error } = require('console')
const ChatModel = require ('../models/chat.model.js')

class ChatManager{      
    async addChat(data) {
        try{     
            await  ChatModel.create ({
                userName : data.userName,
                message: data.message
            })
        }catch(err){
            throw new Error(err)
        }               
    }      
}

module.exports = ChatManager