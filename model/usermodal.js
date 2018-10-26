const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltval = 10
//var ObjectId = Schema.ObjectId;



var Schema = mongoose.Schema;

var images=new Schema({
    image:{
        type: String,
        default: ''
    }
    
})
var userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        //required: true

    }, email: {
        type: String,
        //required: true,
        //unique: true

    }, dateofbirth: {
        type: String,
        default: ''
    }, gender: {
        type: String,
        default: ''
    }, phonenumber: {
        type: String,
        default: ''
    }, password1: {
        type: String,
        //required: true
        default: ''
    },
    userImage:[images] ,
    profile: {
        type: String,
        default: ''
    }, logintype: {
        type: String,
        default: 'Normal'

    }, autharizationid: {
        type: String,
        default: ''
    },
    userId: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    date: {
        type: Date,
        default: new Date()
    },
    userType: {
        type: 'String',
       // require: true,
         default: 'user'
    }



})
/**
 * description:to used to the  creation of indexs
 */
userSchema.index({ email: 1 })
var User = mongoose.model('User', userSchema)

module.exports = User;


module.exports.savesocialLogin = (userobj, cb) => {
    //console.log(userobj)  
   
                    //console.log(hashpassword)
                   // userobj.password = hashpassword;
                    let user = new User(userobj);
                   user.save(function(err,result)
                   {
                       if(err)
                       {
                        cb(err,{"status": 401, "err_field": "", "message": "something wentwrong please try agin" + err });
                           
                       }else
                       {
                            cb("",{ "status": 200, "message": "Success","data":result });
                           
                       }
                       
                   });
                   
}




module.exports.createuser = (userobj, cb) => {
    //console.log(userobj)  
    bcrypt.genSalt(saltval, (err, salt) => {
        if (err) {
            console.log(err)
        } else {
            bcrypt.hash(userobj.password, salt, (err, hashpassword) => {
                if (err) {
                    console.log(err)
                }
                else {
                    //console.log(hashpassword)
                    userobj.password = hashpassword;
                    let user = new User(userobj);
                   user.save(function(err,result)
                   {
                       if(err)
                       {
                        cb(err,{"status": 401, "err_field": "", "message": "something wentwrong please try agin" + err });
                           
                       }else
                       {
                            cb("",{ "status": 200, "message": "Success","data":result });
                           
                       }
                       
                   });
                    // }


                }
            })
        }
    })
}


module.exports.findUserByEmail = (useremail, cb) => {
    User.find({ email: useremail }, function(err,result)
    {
        if(err)
        {
             cb(err,{"status": 400, "err_field": "", "message": "something wentwrong please try agin" + err });
            
        }else
        {
            cb("",{"status": 200, "message": "Proceed to next","data":result});
            
        }
    })

}
module.exports.findUserByEmailsocilal = (user_data, cb) => {
    User.find({ email: user_data.email,logintype:user_data.logintype}, function(err,result)
    {
        if(err)
        {
             cb(err,{"status": 400, "err_field": "", "message": "something wentwrong please try agin" + err });
            
        }else
        {
            cb("",{"status": 200, "message": "Proceed to next","data":result});
            
        }
    })

}


module.exports.findUserByAuthId = (autharizationid, cb) => {
    User.find({ autharizationid: autharizationid }, function(err,result)
    {
        if(err)
        {
             cb(err,{"status": 400, "err_field": "", "message": "something wentwrong please try agin" + err });
            
        }else
        {
            cb("",{"status": 200, "message": "Proceed to next","data":result});
            
        }
    })

}



module.exports.comparePassword = (password, hashpassword, cb) => {
    console.log(password, hashpassword)
    bcrypt.compare(password, hashpassword, function(err,result)
    {
        if(err)
        {
            
            cb(err,{"status": 400,  "message": "something wentwrong please try agin" + err });
            
        }else
        {
            cb("",{"status": 200,  "message": "Passwords","result": result });
        }
    })

}


    module.exports.insertpassword = (userobj, cb) => {
    //console.log("hii")
    //console.log(userobj.password1)
    bcrypt.genSalt(saltval, (err, salt) => {

        if (err) {
            console.log(err)
        } else {
            bcrypt.hash(userobj.new_password, salt, (err, hashpassword) => {
                if (err) {
                    console.log(err)
                }
                else {
                    //console.log(hashpassword)
                    // User.updateOne({password:hashpassword},cb)
                    User.updateOne({ _id: userobj._id }, { $set: { password: hashpassword } }, function(err,data)
                    {
                        if(err)
                        {
                             cb(err,{"status": 400,  "message": "something wentwrong please try agin" + err });
                            
                        }else
                        {
                             cb("",{"status": 200,  "message": "Password changed successfully" });
                            
                        }
                    })

                }
            })
        }
    })
}

module.exports.hashpassword = (password, cb) => {
    bcrypt.genSalt(saltval, (err, salt) => {
        if (err) {
            return cb(err)
        }
        else {
            console.log("crypto password")
            bcrypt.hash(password, salt, function(err,result)
              {
        if(err)
        {
            
            cb(err,{"status": 400,  "message": "something wentwrong please try agin" + err });
            
        }else
        {
            cb("",{"status": 200,  "message": "Passwords","result": result });
        }
         })
        }
    })
}


