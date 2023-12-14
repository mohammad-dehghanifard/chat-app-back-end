const {MongoClient} = require("mongodb");

exports.connectToMongoo =(collectionName) =>{
    const client = new MongoClient(process.env.DataBaseUrl);
    const dataBase = client.db(process.env.DataBaseName);
    const collection = dataBase.collection(collectionName);
    return {dataBase, client,collection};
}