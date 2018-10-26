var MongoClient = require('mongodb').MongoClient; 

var codeInsert = (codes) => {
  return MongoClient.connect('mongodb://localhost:27017', (err, client)=>{
    if(err) return console.log(err)
    if(codes.length === 0) return console.log('no codes found')
    const db = client.db('papa')
    const collection = db.collection('codes')
    codes.forEach((code)=>{
      collection.findOne({"code": code.promoCode, "location": code.promoLocation, "dateCreated": code.createdAt}, (err, res)=>{
        if(err)return console.log(err)
        if(res === null){
          console.log('inserting code: ' + code.promoCode)
          collection.insert({code: code.promoCode, "location": code.promoLocation, "dateCreated": code.createdAt}) 
        }
      })
    })
  })
}

module.exports = codeInsert;
