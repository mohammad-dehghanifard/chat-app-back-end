const {connectToMongoo} = require("../utils/connect_to_mongoo");
const bycript = require("bcrypt")

exports.registerUser = async (req,res) => {
    {
        const userObj = {fullName,userName,password} = req.body;
        // clinet no send all properties in the request
        if(userObj.fullName === undefined || userObj.userName === undefined || userObj.password === undefined){
          res.status(400).json({
              "message": "please enter all required fields",
          })
        }
        // insert user successfully
        else{
            try{
            // connect to db
            const db = connectToMongoo(process.env.UsereCollection);
            // hash password
            const hashPassword = await bycript.hash(password,process.env.SaltRounds);
            // create user 
            const newUser = {fullName,userName, hashPassword};
            // check username already exists
            const checkUserName = await db.collection.findOne({userName : userName})
            // insert user
            if(checkUserName === null)
            {
            const result = await db.collection.insertOne(newUser)
            res.status(200).json({
                "message": "user registered successfully",
                "data": result
            });
            } 
            // send user allready exists error
            else {
                res.status(400).json({
                    "message": "username already exists please select more username",
                    "error": "username already exists"
                });
            }
            // colose database connection
            await db.client.close;

            } catch(err){
                res.status(500).json({
                    message: "Internal server error",
                    "error" : err.message
                });
            }
        } 
      }
}

