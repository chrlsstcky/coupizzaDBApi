require('dotenv').config(/*{path: '../../.env'}*/)
var graph = require('fbgraph');
var MongoClient = require('mongodb').MongoClient;

graph.setAccessToken(process.env.FBAT)

const endpoint = '/34703237638/locations?fields=location&after=' //this api endpoint retrieves all locations of a specified business

const accountFinder = () => {
  return new Promise((resolve, reject)=>{
    let dataArr = []
    graph.get(endpoint, function dataParse(err, res){
      if(err) return console.log(err)
      res.data.filter((obj)=>{
        if(obj.location.country === 'United States'){
          dataArr.push(obj)
        }
      })
      if(res.paging && res.paging.next){
        graph.get(res.paging.next, dataParse);
      }else{
        resolve(dataArr)
      }
    })
  })
}

module.exports = accountFinder;
