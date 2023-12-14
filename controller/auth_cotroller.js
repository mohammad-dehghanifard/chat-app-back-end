const {MongoClient} = require("mongodb");

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
            // create user
            const newUser = {fullName,userName, password};
            // insert user
            const result = await db.collection.insertOne(newUser)

            res.status(200).json({
                "message": "user registered successfully",
                "data": result
            });
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

// connect to database
function connectToMongoo(collectionName){
    const client = new MongoClient(process.env.DataBaseUrl);
    const dataBase = client.db(process.env.DataBaseName);
    const collection = dataBase.collection(collectionName);
    return {dataBase, client,collection};
}