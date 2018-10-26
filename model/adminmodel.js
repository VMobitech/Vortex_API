const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const saltval = 10
var Schema = mongoose.Schema;

var adminSchema = new Schema({
    fullname : {
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    password:{
        type:String,
    },
    createDate : {
        type:Date,
        default:new Date()
    }
})

adminSchema.index({email:1});

var Admin =module.exports= mongoose.model('Admin',adminSchema);

module.exports.findAdminByEmail = (adminEmail,cb) => {
    Admin.findOne({email:adminEmail},cb)
}

module.exports.createAdmin = (adminObj,cb)=>{
    bcrypt.genSalt(saltval,(err,salt)=>{
        if(err){
            console.log(err)
        }else{
            bcrypt.hash(adminObj.password,salt,(err,hashPassword)=>{
                adminObj.password = hashPassword;
                let admin = new Admin(adminObj);
                admin.save(cb)
            })
        }
    })
}

module.exports.comparePassword = (adminpassword,hashpassword,cb) => {
    bcrypt.compare(adminpassword,hashpassword,cb)
}