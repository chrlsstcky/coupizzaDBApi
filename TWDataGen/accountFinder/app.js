require('dotenv').config('../../.env')
const Twitter = require('twitter');
const accountsInsert = require('../../utils/accountInsert.js');
const writeCursorToFile = require('./writeCursorToFile.js');

const TWClient = new Twitter({
  consumer_key: process.env.TWCK,
  consumer_secret: process.env.TWCS,
  access_token_key: process.env.TWACCT,
  access_token_secret: process.env.TWACCTS
});


(()=>{
  let accounts = [];
  let nextCursor
  TWClient.get('followers/list', {user_id: '18450106', cursor: process.env.TWCURSOR}, function callback(err, res){

    if(err){ 
      console.log(err)
      if(err[0].code === 88){
        console.log('setting timeout');

        if(nextCursor !== process.env.TWCURSOR && typeof(nextCursor) === "number"){ //allows requests to start from the last cursor after stopping the script 
          writeCursorToFile(nextCursor); 
        }
        setTimeout(async()=>{
          if(accounts.length > 0){
            await accountsInsert('twitter', accounts) 
            accounts = []
          }
          return TWClient.get('followers/list', {user_id: '18450106', cursor: nextCursor}, callback)
        }, 900000)
      }
    };
    if(!res.users) return console.log(res);
    nextCursor = res.next_cursor;

    res.users.forEach((user)=>{
      if(user.screen_name.includes('PapaJohns')){
        console.log(user);
        accounts.push(user);
      }
    })

    if(res.next_cursor !== 0){
      TWClient.get('followers/list', {user_id: '18450106', cursor: nextCursor}, callback);
    }
  })
})()
