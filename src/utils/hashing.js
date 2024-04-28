const bcrypt = require('bcrypt')

module.exports = {
    //Hash Password
    hashPassword: value => bcrypt.hashSync(value, bcrypt.genSaltSync(10)), //sintaxis funcion flecha, retoran el valor directamente
    //Validar Password
    isValidPassword: (password, hasedPassword) => bcrypt.compareSync(password,hasedPassword)
}

