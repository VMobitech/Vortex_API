var mysql=require('mysql');
 var connection=mysql.createPool({
host:'localhost',
 user:'vmcoin_dhukan',
 password:'@Dhukan123@',
 database:'vmcoin_dhukan'
 
});
 module.exports=connection;