//Javascript desde el Browser
const socket = io();
//Instanciamos el socket y lo guardamos en socket.
//Dicho socket es el que utilizaremos para comunicarnos con el Sockett del serevidor

//escuchar evento
socket.on('newProduct',(product)=>{
    //Agregar producto al HTML

    const conteiner = document.getElementById('productFeed')
    
    conteiner.innerHTML += ` 
    
        <ul>
            <li>Producto: ${product.title}
                <ul>
                    <li>Code: ${product.code}</li>
                    <li>Descripion: ${product.description}</li>
                    <li>Precio: ${product.price}</li>
                    <li>Stock: ${product.stock}</li>
                </ul>
            </li>
        </ul>
    `
})