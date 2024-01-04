const { connectToMongoo } = require('../utils/connect_to_mongoo')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
exports.registerUser = async (req, res) => {
  {
    const userObj = ({ fullName, username, password } = req.body)
    // clinet no send all properties in the request
    if (
      userObj.fullName === undefined ||
      userObj.username === undefined ||
      userObj.password === undefined
    ) {
      return res.status(400).json({
        message: 'please enter all required fields'
      })
    }
    // insert user
    else {
      try {
        // connect to db
        const db = connectToMongoo(process.env.UsereCollection)
        // hash password
        const hashPassword = await bcrypt.hash(password, 10)
        // create user
        const newUser = {
          fullName: fullName,
          username: username,
          password: hashPassword
        }
        // check username already exists
        const existUser = await db.collection.findOne({ username: username })
        // insert user
        if (existUser === null) {
          const result = await db.collection.insertOne(newUser)
          res.status(200).json({
            message: 'user registered successfully',
            data: result
          })
        }
        // send user allready exists error
        else {
          res.status(400).json({
            message: 'username already exists please select more username',
            error: 'username already exists'
          })
        }
        // colose database connection
        db.client.close
      } catch (err) {
        res.status(500).json({
          message: 'Internal server error',
          error: err.message
        })
      }
    }
  }
}

exports.signup = async (req, res) => {
  try {
    // get inputs
    const inputs = ({ username, password } = req.body)
    // validate inputs
    if (!inputs.username || !inputs.password) {
      res.status(400).json({
        message: 'please enter all required fields'
      })
      return
    }
    // connect to db
    const db = connectToMongoo(process.env.UsereCollection)
    // find user
    const user = await db.collection.findOne({ username: inputs.username })

    if (user) {
      // decode password and check
      const matchPassword = await bcrypt.compare(
        inputs.password,
        user.password
      )

      // match password
      if(matchPassword){
        const username = user.username;
        // gentae token
        const token =  jwt.sign(
          {username},
          process.env.JwtSecretKey,
          {
            algorithm : "HS256",
            expiresIn : "1h"
          }
        )

        //save tokne to db
        await db.collection.updateOne(
          {username: inputs.username},
          {$set : {token: token}}
        )

        res.status(200).json({
            message: 'sign up successfully',
            data: {
              fullname: user.fullName,
              username: user.username,
              token : token
            },
          })
          db.client.close;
      }
      // password not match 
      else{
        res.status(400).json({
            message: 'The password entered is not correct',
            error: 'password invalid'
          })
      }
    }
    // user not found
     else{
        res.status(400).json({
            message: 'user not found',
            error: 'invalid username'
          })
    }

  } catch (err) {
    res.status(500).json({
      message: 'Internal server error',
      error: err.message
    })
  }
}
