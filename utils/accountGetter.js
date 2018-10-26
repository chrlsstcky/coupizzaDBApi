var MongoClient = require('mongodb').MongoClient;

var accountGetter = (accountCollection) =>{
  MongoClient.connect('mongodb://localhost:27017/papa', (err, client)=>{
    if(err) return console.log(err)
    const db = client.db('papa')
    const collection = db.collection(accountCollection)
    collection.find({}).toArray((err, docs)=>{
      client.close()
      if(err)return console.log(err)
      return docs
    })
  })
}

module.exports = accountGetter;
