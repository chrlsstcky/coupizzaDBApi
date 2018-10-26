var fs = require('fs');

const writeCursorToFile = (cursor) =>{
  fs.readFile('.env', 'utf8', (err, data)=>{
    if(err) return console.log(err);

    console.log(data)
    let dataSplit = data.split("\n")
    dataSplit.splice(5, 1, "TWCURSOR=" + cursor); 
    let replacedCursor = dataSplit.join('\n')
    fs.writeFile('.env', replacedCursor, (err)=>{
      if(err) return console.log(err); 
      return; 
    })
  })
}

module.exports = writeCursorToFile;
