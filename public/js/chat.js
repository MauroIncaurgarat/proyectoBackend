//Conecto al cliente
const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')

let userName
//Bloquear pantalla y hacer log in
Swal.fire({
    title:'Ingresar tu email',
    input: 'text',
    text: 'Debes identificarte primero!',
    inputValidator: (value) =>{
        return !value && '! Debes escribir un username valido'
    },
    allowOutsideClick: false
})
    .then(result => {
        userName = result.value
        console.log(`ususario identificado como ${userName}`)
    })

// escuchar el evento "Enter" y enviar el mensaje al chat
    chatBox.addEventListener('keyup', event =>{
        if(event.key === 'Enter') {
            const message = chatBox.value
            if(message.trim().length > 0){
                socket.emit('message',{userName, message})
                chatBox.value = ''
            }
        }
    })


    
// escuchar los mensajes desde el servidor y mostrarlos
socket.on('message', (data) => {
    const userName = data.userName
    const message = data.message
    
    messageLogs.innerHTML += `${userName} dice: ${message} </br>`
                                
})  
