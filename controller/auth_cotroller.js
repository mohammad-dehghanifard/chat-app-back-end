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
            const client = new MongoClient(process.env.DataBaseUrl);
            const db = client.db(process.env.DataBaseName);
            const userCollection = db.collection(process.env.UsereCollection);

            const newUser = {
                fullName: userObj.fullName,
                userName: userObj.userName,
                password : userObj.password
            };

            const result = await userCollection.insertOne(newUser)

            res.status(200).json({
                "message": "user registered successfully",
                "data": result
            });

            await client.close;

            } catch(err){
                console.log(err);
            }
        } 
      }
}

async function openDatabase(collectionName){
    
}