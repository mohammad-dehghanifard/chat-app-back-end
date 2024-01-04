const { connectToMongoo } = require('../utils/connect_to_mongoo')
const jwt = require('jsonwebtoken')

async function getUserIdFromToken(inputToken) {
    // validate token
        if(inputToken === undefined || inputToken === ''){
            return null
        }

    // verify token
    try {
        jwt.verify(inputToken,process.env.JwtSecretKey)
    }   catch (err) {
        console.log(err)
        return null
    } 

    // connect to db and get data
    try{
       const db = connectToMongoo(process.env.UsereCollection)
      const user = await db.collection.findOne({ token : inputToken})
       if(user){
        return {
            status : 'success',
            data : {
                id : user._id,
                fullname: user.fullName,
                username : user.username,
                token : user.token
            }
        }
       } else {
        return {
            status: 'error',
            error : "token invalid........",
        }
       }

    } catch(err){
        console.log(err)
    }
    
}

module.exports = getUserIdFromToken