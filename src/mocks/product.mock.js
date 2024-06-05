const {fakerES : faker} = require('@faker-js/faker')

const generateProduct = () => ({

    title : faker.commerce.product(),
    description : faker.commerce.productDescription(),
    price : faker.commerce.price({min: 100, max: 10000}),
    thumbnail : faker.image.url(),
    code : faker.number.hex({ min: 0, max: 65535 }),
    stock : faker.number.int({ min: 10, max: 10000 })
    
})

module.exports = { generateProduct }