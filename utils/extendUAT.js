var graph = require('fbgraph'); 

graph.setAccessToken(process.env.FB_UAT)

graph.get('debug_token?input_token=' + process.env.FB_UAT, (err, data)=>{
  if(err) return console.log(err);
  return console.log(data)
})
