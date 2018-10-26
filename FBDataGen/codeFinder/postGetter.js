const graph = require('fbgraph')
const dateFormatter = require('./dateFormatter.js')
require('dotenv').config({"path": "../../.env"})
graph.setAccessToken(process.env.FBAT)

const dateStr = dateFormatter()

const postGetter = (FBAccountArr) => {
  return new Promise((resolve, reject)=>{
    let postArr = []
    let counter = 0

    FBAccountArr.forEach((obj)=>{
      graph.get(obj.ID + '/feed', (err, res) =>{
        counter++
        console.log(counter)
        if(err && counter === FBAccountArr.length) console.log(err, "ID list exhausted"), resolve(postArr) 
        if(err) return console.log(err) 
        if(!res.data) return console.log(res)

        res.data.forEach((post) =>{
          if(post.created_time.includes(dateStr)){
            console.log(post)
            const location = {location: obj.city + ", " + obj.state + " " + obj.zip}
            const postAndLocation = {post, ...location} //added created time to readd codes posted on date after the first code 
            postArr.push(postAndLocation)
          }
        })
        if(counter === FBAccountArr.length){
          console.log('ID array exauhsted')
          resolve(postArr) 
        } 
      })
    })
  })
}

module.exports = postGetter;
