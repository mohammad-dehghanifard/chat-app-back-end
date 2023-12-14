const {MongoClient} = require("mongodb");

exports.registerUser = async (req,res) => {
    {
        const userObj = {fullName : req.body.fullName,userName: req.body.userName,password : req.body.password}
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

            const newUser = {
                fullName: userObj.fullName,
                userName: userObj.userName,
                password : userObj.password
            };

            const result = await db.collection.insertOne(newUser)

            res.status(200).json({
                "message": "user registered successfully",
                "data": result
            });

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