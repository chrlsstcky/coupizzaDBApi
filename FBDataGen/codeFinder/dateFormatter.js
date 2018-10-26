
var dateFormatter = () => {
  let d = new Date(); 
  let day = d.getDate()
  let month = d.getMonth() + 1
  const year = d.getFullYear()
  if(day < 10){
    day = '0' + day
  }
  if(month + 1 < 10){
    month = '0' + month 
  }
  return year + '-' + month + '-' + day 
}

module.exports = dateFormatter;
