const Twitter = require('twitter'); 
const MongoClient = require('mongodb').MongoClient; 
let IDsList = []
const client = new Twitter({
  consumer_key: process.env.tw_consumer_key,
  consumer_secret: process.env.tw_consumer_secret,
  access_token_key: process.env.tw_access_token,
  access_token_secret: process.env.tw_access_token_secret
})

var months = ["Jan", 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] //match new Date() to abbrevations (how they're formatted in tweets)

var d = new Date; 

let currentMonth = months[d.getMonth()]; 
let currentDate = d.getDate(); 
let currentYear = d.getFullYear(); 
let dateObj = {
  month: currentMonth,  
  day: currentDate, 
  year: currentYear 
}

let counter = 0
let idArrLen = 132

MongoClient.connect('mongodb://127.0.0.1:27017/papa')
  .then((db)=>{
    return db.collection('AccountIDs').find().toArray();
  })
  .then((results)=>{
    results.forEach((result)=>{
      IDsList.push(result.ID);
    })
    timelineRest(client, IDsList, dateObj); 
  })

let timelineRest = (clientObj, IDl, date)=>{
  IDl.forEach((ID)=>{
    clientObj.get('statuses/user_timeline.json?tweet_mode=extended&', {user_id: ID} , (err, result)=>{
      counter++ 
      if(counter === idArrLen){
        console.log('ID list exhausted') 
        return
      }
      if(err)console.log(err); 
      result.forEach((tweetObj)=>{
        if(tweetObj.created_at.includes(date.month) && tweetObj.created_at.indexOf(date.day) === 8 && tweetObj.created_at.indexOf(date.year) === 26){ //indexOf avoids matching dates/year to time, the dates/year remains at the same index. 
	  // coupon codes regularly come after the words "code" or "promo"
	  if(tweetObj.full_text.toLowerCase().match(/code/)){
      console.log(tweetObj.full_text)
	    let indxOfCodeStart = tweetObj.full_text.toLowerCase().indexOf('code');
	    let promoSlice = tweetObj.full_text.slice(indxOfCodeStart + 4); 
      let promoCode
      if(promoSlice.match(/[A-Z\d]{4,}/)){
        promoCode = promoSlice.toUpperCase().match(/[A-Z\d]{4,}/)[0] 
      }
      let location = tweetObj.user.id_str === '18450106' ? 'any' : tweetObj.user.location; //if tweet is from the main PJ account, location = any/all 
	    MongoClient.connect('mongodb://127.0.0.1:27017/papa')
	      .then((db)=>{
	        return db.collection('codes').findOne({'code': promoCode, "location": location}) 
	      })
	      .then((result)=>{
          console.log(result)
	        if(result === null || result === []){
            console.log('code found')
	          MongoClient.connect('mongodb://127.0.0.1:27017/papa')	
		    .then((db)=>{
		      return db.collection('codes').insert({'createdAt': new Date(), 'code': promoCode, "location": location}) 
		    })
		} 
	      })
         }else if(tweetObj.full_text.toLowerCase().match(/^promo$/) && !tweetObj.full_text.toLowerCase().match(/^code$/)){ //disallowing code match here to avoid matching "promo code" instead of "promo *insert code*" 
	    console.log(tweetObj.full_text + "this is using promo as search"); 
            let indxOfCodeStart = tweetObj.full_text.toLowerCase().indexOf('promo');
	    let promoSlice = tweetObj.full_text.slice(indxOfCodeStart);
	    let promoCode = promoSlice.match(/[A-Z\d]{3,}/)[0] 
	    console.log(promoCode); 
            let location = tweetObj.user.id_str === '18450106' ? 'any' : tweetObj.user.location; 
	    console.log(promoCode[0]); 
	    MongoClient.connect('mongodb://127.0.0.1:27017/papa')
	      .then((db)=>{
	        return db.collection('codes').findOne({'code': promoCode, "location": location}) 
	      })
	      .then((result)=>{
	        if(!result || result === []){
	          MongoClient.connect('mongodb://127.0.0.1:27017/papa')	
		    .then((db)=>{
		      return db.collection('codes').insert({'code': promoCode, "location": location}) 
		    })
		} 
	      })
	  }else if(tweetObj.full_text.match(/^use$/) && !tweetObj.full_text.toLowerCase().match(/^code$/) && !tweetObj.full_text.toLowerCase().match(/^promo$/)){
	    console.log(tweetObj); 
            let indxOfCodeStart = tweetObj.full_text.toLowerCase().indexOf('use');
	    let promoSlice = tweetObj.full_text.slice(indxOfCodeStart);
	    let promoCode = promoSlice.match(/[A-Z\d]{3,}/)[0] 
	    console.log(promoCode);
            let location = tweetObj.user.id_str === '18450106' ? 'any' : tweetObj.user.location; 
            console.log(promoCode);
            MongoClient.connect('mongodb://127.0.0.1:27017/papa')
	      .then((db)=>{
	        return db.collection('codes').findOne({'code': promoCode}) 
	      })
	      .then((result)=>{
	        if(!result || result === []){
	          MongoClient.connect('mongodb://127.0.0.1:27017/papa')	
		    .then((db)=>{
		      return db.collection('codes').insert({'code': promoCode, "location": location}) 
		    })
		} 
	      }) 
	  } 
	}
      })
    })
  })
}
