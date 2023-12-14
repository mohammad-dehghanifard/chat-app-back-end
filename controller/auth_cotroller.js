exports.registerUser = (req,res) => {
    {
        const fullName = req.body.fullName
        const userName = req.body.userName
        const password = req.body.password
      
        if(fullName === undefined || userName === undefined || password === undefined){
          res.status(400).json({
              "message": "please enter all required fields",
          })
      
          // connect to database
          MongoClient.connect(process.env.DataBaseUrl,(err,db) => {
            if(err) console.log(err);
            // database object
            const dbo = db.db(process.env.DataBaseName)
            // user object
            const newUser = {
              fullName: fullName,
              userName: userName,
              password: password
            }
            // create collection
            dbo.collection(process.env.UsereCollection).insertOne(newUser,(err,result) => {
              if(err) console.log(err);
              res.json(
                {
                  "message" : "registered successfully",
                  "data" : result
                }
              )
              db.close();
            })
          })
      
        }
      }
}