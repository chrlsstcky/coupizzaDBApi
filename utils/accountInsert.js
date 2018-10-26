var MongoClient = require('mongodb').MongoClient

const accountsInsert = (dbCollection, ObjArray) =>{
  return MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
    if(err)return console.log(err)
    const db = client.db('papa')
    const collection = db.collection(dbCollection)

    ObjArray.forEach((obj)=>{
      collection.find({"ID": obj.id}).toArray((err, docs)=> {
        if(err) return console.log(err)
        if(docs.length === 0){
          console.log(obj)
          collection.insertOne({"ID": obj.id, "zip": obj.location.zip, "city": obj.location}, (err, res)=>{
            if(err) return console.log(err)
            console.log('account inserted')
            client.close()
          }); 
        }
      })
    })
  })
}

module.exports = accountsInsert
