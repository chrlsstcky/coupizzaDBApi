var MongoClient = require('mongodb').MongoClient 
var graph = require('fbgraph')

var accountGetter = require('../../utils/accountGetter.js');
var postGetter = require('./postGetter.js');
var codeParser = require('../../utils/parsePostCodes.js');
var codeInsert = require('../../utils/codeInsert.js');

(async() =>{
  let accounts = await accountGetter("FBAccounts");
  let posts = await postGetter(accounts);
  let codes = await codeParser(posts);
  return codeInsert(codes);
})()
