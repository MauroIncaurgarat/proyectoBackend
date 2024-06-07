const generateInvalidProductDataError = ({title, description, price,thumbnail, stock }) => {

    return `Invalid Product Data: 
    
    * price   : should be a positive Number, received ${price} (${typeof price})
    * stock   : should be a positive Number, received ${stock} (${typeof stock})
    * title   : should be a non-empty String, recived ${title} (${typeof title})
    * description   : should be a non-empty String, recived ${description} (${typeof description})
    * thumbnail   : should be a non-empty String, recived ${thumbnail} (${typeof thumbnail})    
    `
}

module.exports = {generateInvalidProductDataError}