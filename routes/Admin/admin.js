var express = require('express');
var router = express.Router();
var dateTime = require('node-datetime');
var dt = dateTime.create();
var formatted = dt.format('Y-m-d H:M:S');
//var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const config = require('../../config/config');
const user = require('../../model/usermodal.js');
const admin = require('../../model/adminmodal.js');

var generator = require('generate-password');

const nodemailer = require('nodemailer');
const mailconfig = require('../../config/mailconfig');
const uniqid = require('uniqid');




var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: mailconfig.forgotMailUsername, // Your email id
        pass: mailconfig.forgotMailPassword // Your password
    }
})

const common = require('../../common');

// var usersService = require('../../services/usersService');
// var cartService = require('../../services/cartService');

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});


router.post("/createuser", function(req, res, next) {
    
        if (!req.body.email) {
            res.status(200).json({ "status": 412, "err_field": "email", "message": "Email is required" });
        }else if (!req.body.password) {
            res.status(200).json({ "status": 412, "err_field": "password is required", "message": "password is required" });
        }else if (!req.body.fullname) {
            res.status(200).json({ "status": 412, "err_field": "fullname is required", "message": "fullname is required" });
        }else 
        {
            
            req.body.logintype="Normal";
            user.findUserByEmailsocilal(req.body,function(err,data)
            {
                if(err)
                {
                    res.status(400).send(err)
                }else
                {
                    
                   if(data.status==200 && data.data.length>0)
                   {
                         res.status(200).json({"status":"400","message":"Email Id already exist"})
                       
                   }else if(data.status==200 && data.data.length<=0)
                   {
                         user.createuser(req.body,function(err,data)
                       {
                       if(err)
                        {
                        res.status(200).json({"status":"400","message":"Something went wrong please trygain"})
                    
                       }else
                        {
                        res.send(data)
                    // if(data.length>0)
                    // {
                    //     res.send(data)
                    // }
                        }
            
            
                         })
                     }
                   
                   
                    
                }
            })
            
        }
})


router.post("/login",function(req,res)
{
    
    
     if (!req.body.email) {
            res.status(200).json({ "status": 400, "err_field": "Email is required", "message": "Email is required" });
        }else if (!req.body.password) {
            res.status(200).json({ "status": 400, "err_field": "Email is required", "message": "Email is required" });
        }
        else {
            
            
            
            
             user.find({"email":req.body.email},function(err,data)
            {
                if(err)
                {
                    res.status(400).send(err)
                }else
                {
                    
                   if(data.length>0)
                   {
                       //console.log(data.data);
                       
                        user.comparePassword(req.body.password, data[0].password, (err, ismatch) => {
                            
                            console.log(ismatch);
                        if (err) {
                            res.status(200).json({ "status": 400, "message": "error at compare password", "error_field": "error at compare password" })
                        } else if (ismatch.result) {    

                            var token = jwt.sign({ userid: data[0]._id }, config.secretekey)
                            res.status(200).json({ "status": 200, "message": "user login sucessfully", token: token, result:data[0],profilepath:config.image_path })
                        }
                        else {

                            res.status(200).json({ "status": 400, "message": "passwod does not matched", "error_field": "passwod does not matched" })
                        }
                    })
                    
                    

                   }else
                   {
                        res.status(200).json({ "status": 400, "message": "Please Provide registered email" });
                        
                     }
                   
                   
                    
                }
            })
            
            
            
            
            
            
        }
})



router.post("/socialLogins",function(req,res)
{
    if (!req.body.autharizationid) {
            res.status(200).json({ "status": 400, "err_field": "autharizationid", "message": "Please provide autharizationid" });
        }else if(!req.body.logintype)
        {
            res.status(200).json({ "status": 400, "err_field": "logintype", "message": "Please provide logintype" });
            
        }else if(req.body.email){
            
              user.findUserByEmailsocilal(req.body,function(err,data)
            {
                if(err)
                {
                    res.status(400).send(err)
                }else
                {
                    
                   if(data.status==200 && data.data.length>0)
                   {
                       
                      var token = jwt.sign({ userid: data.data[0]._id }, config.secretekey);
                        res.status(200).json({ "status": 200, "message": "user login sucessfully", token: token, result:data.data[0],profilepath:config.image_path});
                         //res.status(200).json({"status":"400","message":"Success","data":data.data[0],"path"})
                       
                   }else if(data.status==200 && data.data.length<=0)
                   {
                       
                       user.findUserByAuthId(req.body.autharizationid,function(err,data)
                       {
                           
                           if(err)
                            {
                                res.status(400).send(err)
                            }else
                            {
                                
                             if(data.status==200 && data.data.length>0)
                             {
                                 
                                 var token = jwt.sign({ userid: data.data[0]._id }, config.secretekey);
                                 res.status(200).json({ "status": 200, "message": "user login sucessfully", token: token, result:data.data[0],profilepath:config.image_path});
                                 
                                // res.status(200).json({"status":"200","message":"Success","data":data.data[0]})
                                 //   res.status(400).json({"status":"400","message":"Email Id already exist"})
                        
                                }else if(data.status==200 && data.data.length<=0)
                                {
                                      create_user(req.body);
                                 }
                                
                              }
                          //  create_user(req.body);
                           
                       })
                       
                       
                       
                       
                       
                     }
                    
                }
                
            })
            
            
        }else
        {
             user.findUserByAuthId(req.body.autharizationid,function(err,data)
                       {
                           if(err)
                            {
                                res.status(400).send(err)
                            }else
                            {
                                
                             if(data.status==200 && data.data.length>0)
                             {
                                 
                                    var token = jwt.sign({ userid: data.data[0]._id }, config.secretekey)
                               res.status(200).json({ "status": 200, "message": "user login sucessfully", token: token, result:data[0].data,profilepath:config.image_path});
                                 
                               //  res.status(200).json({"status":"200","message":"Success","data":data.data[0]})
                                 //   res.status(400).json({"status":"400","message":"Email Id already exist"})
                        
                                }else if(data.status==200 && data.data.length<=0)
                                {
                                      create_user(req.body);
                                 }
                                
                              }
                          //  create_user(req.body);
                           
                       })
                       
           
            
        }
        
        
        function create_user(data)
        {
            
            var image="";
            var imagePath="";
            
            if(data.profile!="")
            {
                
                let d = new Date();
                let time = d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()
                let image =time +uniqid() + ".png";
                data.profile=image;
                

                let imagePath = "./images/" + image;
                 require("fs").writeFileSync(imagePath, data.profile, 'base64',(err,data)=>{
                 if (err) {
            console.log('err', err);
             }
           })
                
                
            }
            
           // data.profile=image;
            
            
            
            user.savesocialLogin(data,function(err,data)
                       {
                       if(err)
                        {
                        res.status(200).json({"status":"400","message":"Something went wrong please trygain"})
                    
                       }else
                        {
                            console.log(data);
                            
                        var token = jwt.sign({ userid: data.data._id }, config.secretekey)
                        res.status(200).json({ "status": 200, "message": "user login sucessfully", token: token, result:data.data,profilepath:config.image_path })
                            
                      //  res.send(data)
                    // if(data.length>0)
                    // {
                    //     res.send(data)
                    // }
                        }
            
            
                         })  
            
        }
    
})

router.post("/change_password",function(req,res)
{
    
    if (!req.body.password) {
            res.status(200).json({ "status": 400, "err_field": "password", "message": "password  is required" });
        }else if(!req.body._id)
        {
             res.status(200).json({ "status": 400, "err_field": "_id", "message": "Please provide user id" });
            
        }else if(!req.body.new_password)
        {
             res.status(200).json({ "status": 400, "err_field": "new_password", "message": "Please provide New password"});
            
        }else
        {
            user.find({"_id":req.body._id},function(err,data)
            {
                
                if(err)
                {
                     res.status(200).json({ "status": 400, "err_field": "_id", "message": "Please provide user id" });
                    
                }else
                {
                    if(data.length>0)
                    {
                        
                        user.comparePassword(req.body.password,data[0].password, (err, ismatch) => {
                            
                            console.log(ismatch);
                        if (err) {
                            res.status(200).json({ "status": 400, "message": "error at compare password", "error_field": "error at compare password" })
                        } else if (ismatch.result) {
                            
                            
                            user.insertpassword(req.body,function(err,data)
                            {
                                if(err)
                                {
                                    res.status(400).json(err);
                                    
                                }else
                                {
                                    res.status(200).json(data)
                                    
                                }
                            })
                            
                          

                            // var token = jwt.sign({ userid: data.data[0]._id }, config.secretekey)
                            // res.status(200).json({ "status": 200, "message": "user login sucessfully", token: token, result:data.data[0],profilepath:config.image_path })
                        }
                        else {

                            res.status(200).json({ "status": 400, "message": "passwod does not matched", "error_field": "passwod does not matched" })
                        }
                    })
                        
                        
                    }else
                    {
                         res.status(200).json({ "status": 400, "message": "Please provide valid password", "error_field": "password" })
                        
                    }
                    
                }
                
                
                
            })
            
        }
    
    
})



router.post("/upload_images",function(req,res)
{
    let image="";
    let imagePath="";
    var imagesarray=[];
    var update_data={};
    
    if (!req.body.userId) {
            res.status(200).json({ "status": 400, "err_field": "Email", "message": "Please provide id"});
        }else
        {
            
            if(req.body.images_info.length>0)
            {
            
             var file=req.body.images_info
            for (let i = 0; i < file.length; i++) {
            let d = new Date();
            let time = d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()
               image=time+uniqid()+".png";
               imagePath="./images/"+image;
               imagesarray.push({"image":image});
              require("fs").writeFileSync(imagePath, file[i], 'base64',(err,data)=>{
             if (err) {
            console.log('err', err);
            }
            else{
            console.log('success');
             }


             })
             }
             
           
            }
            
            if(req.body.description)
            {
                update_data.description=req.body.description;
                
            }
            
        user.update({_id: req.body.userId},{$pushAll: {userImage:imagesarray},"description":req.body.description},{upsert:true},function(err){
        if(err){
                res.status(200).json({ "status": 400, "err_field": "", "message": err});
        }else{
            user.findOne({"_id":req.body.userId},function(err,data)
            {
                if(err)
                {
                     res.status(200).json({ "status": 400,"message": "Something Went wrong please try again","err":err});
                    
                }else
                {
                res.status(200).json({ "status": 200,"message": "success","result":data,profilepath:config.image_path});
                }
                
            })
                
        }
        });
        
      //  res.send(imagesarray);
            
            
    }
    
    
})


router.post("/edit_profile",function(req,res)
{
    
        if(!req.body.userId)
        {
             res.status(200).json({ "status": 400, "err_field": "userId", "message": "userId is required" });
            
        }else if(!req.body.gender)
        {
             res.status(200).json({ "status": 400, "err_field": "gender", "message": "userId is required" });
            
        }else if(!req.body.dateofbirth)
        {
             res.status(200).json({ "status": 400, "err_field": "dateofbirth", "message": "dateofbirth is required" });
            
        }else if(!req.body.fullname)
        {
             res.status(200).json({ "status": 400, "err_field": "fullname", "message": "fullname is required" });
            
        }else
        {
            var user_update_data={"fullname" :req.body.fullname,"dateofbirth" :req.body.dateofbirth ,"gender" :req.body.gender };
            
            if(req.body.profile!="")
            {
                
                 let d = new Date();
                let time = d.getDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds()
                let image =time +uniqid() + ".png";
                user_update_data.profile=image;
                let imagePath = "./images/" + image;
                 require("fs").writeFileSync(imagePath, req.body.profile, 'base64',(err,data)=>{
                 if (err) {
                console.log('err', err);
             }
           })
                
                
                
            }
            
            
            user.update({"_id":req.body.userId},{$set:user_update_data},function(err,data)
            {
              
              if(err)
              {
                  res.status(200).json({ "status": 400, "message": "Something Went wrong please try again","err":err});
                  
              }else
              {
                  user.findOne({"_id":req.body.userId},function(err,data)
                  {
                      if(err)
                      {
                          res.status(200).json({ "status": 400, "message": "Something Went wrong please try again","err":err});
                          
                      }else
                      {
                           res.status(200).json({ "status": 200, "message": "Profile information updated successfully","result":data,profilepath:config.image_path});
                          
                      }
                      
                  })
                  
              }
            })
            
            
            
            
        }
    
})






router.post("/forgotpassword",function(req,res)
{
    
     if (!req.body.email) {
            res.status(200).json({ "status": 400, "err_field": "Email", "message": "Email is required" });
        }else
        {
            
            
                 user.findUserByEmail(req.body.email,function(err,data)
                 {
                if(err)
                {
                    res.status(400).send(err)
                }else
                {
                    
                   if(data.status==200 && data.data.length>0)
                   {
                       
                       var password = generator.generate({
                        length: 10,
                        numbers: true,
                        symbols:true
                        });
                        
                        var password=password+'@2';
                        
                        
                         user.hashpassword(password, (err, randompassword) => {
                                    if (err) {
                                        console.log(err)
                                    }
                                    else {
                                        
                                        console.log("-----------------------------------------------------------------------------------------"+data.data[0]+"-------------random password: "+randompassword.result);
                                        
                                 user.update({ '_id': data.data[0]._id, }, { $set: { password: randompassword.result } }, function (err, updateduser) {
                                 console.log("error", err)
                                            
                                            
                                            if(updateduser.ok==1)
                                            {
                                            
                           var mailOptions = {
                            from: '"VORTEX"<versatilemobitech@gmail.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: 'Change password', // Subject line
                            text: "Your new password is below", // plaintext body
                            html: 'Your password' + '&nbsp;  <b>' + password + '</b>' // You can choose to send an HTML
                            };
                           transporter.sendMail(mailOptions, function (err, data) {
                          if (err) {
                            res.status(200).json({ status: 400, err_field: "Something went wrong", message });
                           }
                           else {
                            console.log(data);
                            
                            
                            res.status(200).json({ status: 200, message: "Please check your mail for new password " });
                        }
                       });
                    }else
                    {
                         res.status(200).json({ status: 400,  message: "Password not update please try again","updateduser":updateduser});
                        
                    }
                       //res.send(updateduser);
                                            
                                            
                                            

                                          
                                          
                                        })
                                    }
                                })

                        
                        
                       //console.log(data.data);
                       
                       

                   }else if(data.status==200)
                   {
                        res.status(200).json({ "status": 400, "message": "Please Provide registered email" });
                        
                     }
                   
                   
                    
                }
            })
            
            
        }
    
    
})



router.get("/token", function () {
    const payload = {
        admin: "mahesgh"
    };
})


// login service
// router.post('/login', function(req, res) {

//     var reqdata = req.body;
//     var err_message = "";
//     var err_field = "";
//     var validate = true;
//     if (!reqdata.phone) {
//         err_message = "Please provide Mobile number";
//         err_field = "phone";
//         validate = false;
//     } else if (!reqdata.password) {
//         err_message = "Please provide Password";
//         err_field = "password";
//         validate = false;
//     }
//     if (validate && err_field == "") {

//         Users.validate_user_login(reqdata.phone, function (err, user_data) {

//             if (err) {
//                 res.status(200).json({ "status": 400, "err_field": "", "message": "something wentwrong please try agin" + err });
//             } else {
//                 if (user_data.length > 0) {
                    
//                     if((reqdata.password==user_data[0].password))
//                     {
//                          const payload = {
//                             u_id: user_data[0].u_id,
//                             type: "USER"
//                         };
//                         var token = token_create(payload);
//                         user_data[0].password = "";

//                         res.status(200).json({ "status": 200, "err_field": "", "message": "Your loged in successfully", "data": user_data[0], "token": token });
//                     }else
//                     {
//                       res.status(200).json({ "status": 400, "err_field": "password", "message": "Please Provide valida password" });

                        
//                     }
                    
//                     /*
//                     if (bcrypt.compareSync(reqdata.password, user_data[0].password)) {

//                         const payload = {
//                             u_id: user_data[0].u_id,
//                             type: "USER"
//                         };
//                         var token = token_create(payload);
//                         user_data[0].password = "";


//                         res.status(200).json({ "status": 200, "err_field": "", "message": "Your loged in successfully", "data": user_data[0], "token": token });

//                     } else {
//                         res.status(200).json({ "status": 400, "err_field": "password", "message": "Please Provide valida password" });

//                     }
//                     */

//                 } else {
//                     res.status(200).json({ "status": 400, "err_field": "phone", "message": "Please Provide valida mobile number" });

//                 }
//             }
//         })
//     } else {
//         res.status(200).json({ "status": 400, "err_field": err_field, "err_message": err_message });
//     }

// })




router.post("/viewdetails",function(req,res)
{
    
    
        if(!req.body.userId)
        {
             res.status(200).json({ "status": 400, "err_field": "userId", "message": "userId is required" });
            
        }else
        {
            
                  user.findOne({"_id":req.body.userId},function(err,data)
                  {
                      if(err)
                      {
                          res.status(200).json({ "status": 400, "message": "Something Went wrong please try again","err":err});
                          
                      }else
                      {
                           res.status(200).json({ "status": 200, "message": "Profile information updated successfully","result":data,profilepath:config.image_path});
                          
                      }
                      
                  })
            
        }
    
    
})





 function randomstring(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

function token_create(payload) {
    var token = jwt.sign(payload, config.secret);
    return token
}

//router.use(require('./tokenChecker'))





module.exports = router;


