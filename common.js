const jwt = require('jsonwebtoken')
const config = require('./config/config.json');
var verify_token = function(req,res,next){
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(400).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(400).json({ "status": 400, "message": "Token not found" });
  }
}

var check_token = function(req,callback){
  const token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.token;
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            callback({ "status": 400, "message": "Unauthorized access.", decoded : decoded });
        }else{
            callback({ "status": 200, "message": "Success", decoded : decoded });
        }
    });
  } else {
    // if there is no token return an error
    callback({ "status": 400, "message": "Token not found" });
  }
}

var gNUE = function(data){
  if(data === 'undefined' || data === undefined || data === 'null' || data === null){
    data = '';
  }
  return data;
}

var random_an = function(length) {
  chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var result = '';
  for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
  return result;
}

var mysql_real_escape_string = function(str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
          case "\0":
              return "\\0";
          case "\x08":
              return "\\b";
          case "\x09":
              return "\\t";
          case "\x1a":
              return "\\z";
          case "\n":
              return "\\n";
          case "\r":
              return "\\r";
          case "\"":
          case "'":
          case "\\":
          case "%":
              return "\\"+char; // prepends a backslash to backslash, percent,
                                // and double/single quotes
      }
  });
}

var formInsertQuery = function(obj){
  var query = "insert into " + obj.table_name + " ";
  var fieldsObj = obj.fields;
  var fields = "";var values = "";var ObjLen = 0;
  for(let key in fieldsObj){
    ObjLen++;
    fields += key + ', ';
    if(fieldsObj[key] == 'now()'){
      values += fieldsObj[key] + ', ';
    }else if(typeof(fieldsObj[key]) != "string"){
        values += '"' + gNUE(fieldsObj[key]) + '", ';
    }else{
        values += '"' + mysql_real_escape_string(gNUE(fieldsObj[key])) + '", ';
    }
  }
  if(ObjLen == 0){
    return query;
  }else{
    var fields = fields.substring(0,fields.length - 2);
    var values = values.substring(0,values.length - 2);
    query += "("+fields+") values ("+values+")";
    console.log(query);
    return query;
  }
}

var formUpdateQuery = function(obj){
    var query = "update " + obj.table_name + " set ";
    var fieldsObj = obj.fields;
    var whereConditions = obj.whereConditions;
    var values = "";var ObjLen = 0;
    for(let key in fieldsObj){
        if(gNUE(key) != ''){
            ObjLen++;
            if(fieldsObj[key] == 'now()'){
                values += key + '=' + fieldsObj[key] + ', ';
            }else if(typeof(fieldsObj[key]) != "string"){
                values += key + '=' + '"' + gNUE(fieldsObj[key]) + '", ';
            }else{
                values += key + '=' + '"' + mysql_real_escape_string(gNUE(fieldsObj[key])) + '", ';
            }
        }
    }
    var whereStr = "";
    for(let key in whereConditions){
    whereStr += key + " = '" + whereConditions[key] + "' and ";
    }

    if(ObjLen == 0){
    return query;
    }else{
    var whereStr = whereStr.substring(0,whereStr.length - 4);
    var values = values.substring(0,values.length - 2);
    query += " "+values+" where " + whereStr;
    return query;
    }
}

// if key not existed in object return false, if exists return true
var checkKeyInObj = function(key){
    if(key == undefined){
        return false
    }
    return true;
}

module.exports = {
  verify_token : verify_token,
  check_token : check_token,
  gNUE:gNUE,
  random_an:random_an,
  mysql_real_escape_string:mysql_real_escape_string,
  formInsertQuery:formInsertQuery,
  formUpdateQuery:formUpdateQuery,
  checkKeyInObj:checkKeyInObj
};
