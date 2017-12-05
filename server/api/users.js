/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var User = require('../models/user');
var uuid = require('node-uuid');
var fs = require('fs');
nodemailer = require('nodemailer');
smtpTransport = require("nodemailer-smtp-transport");

// Users API   
module.exports = function(apiRouter,passport,transporter,s3,randomString,userupload) {
    
        

    
//**********************************Admin Add User******************************************************

    apiRouter.get('/users', function(req, res) {
        console.log("users");
        User.find({}, function(err, users) {
            console.log(users);
            if (err)
                res.send(err);

            res.send(users);
        }).sort({ created_at : -1 });
    });
    apiRouter.post('/deleteuser', function(req, res) {
        User.remove({
            _id: req.body.id
        }, function(err, user) {
            if (err)
               res.json({"message":err.message,"error":"1"});
             res.json({"message":"User Deleted Successfully","error":"0","data" : user});
        })
    });

//*************************************** Register Api ************************************************************
    apiRouter.post('/users/register', function(req, res) {
        if (req.body.password === req.body.confirm_password) {
            User.register(new User({
                full_name: req.body.full_name,
                email: req.body.email,
                role: req.body.role,
                username: req.body.username,
                gender: req.body.gender,
            }), req.body.password, function(err, user) {
                if (err) {
                    console.error(err.message);
                    res.json({"message": err.message, "error": "1"});
                } else {

                    res.json({"message": "User Added Successfully", "error": "0", "data": user});
                }

            });
        } else {
            res.json({"message": "Password and Confirm password are not same", "error": "2"});
        }
    });
    
  
     apiRouter.post('/users/login', function(req, res) {
         passport.authenticate('local')(req, res, function() {
             var userdata = {};
             if(req.user._id != ''){
                userdata.id = req.user._id;
                userdata.username = req.user.username;
                userdata.full_name = req.user.full_name;
                userdata.email = req.user.email;
                userdata.gender = req.user.gender;
               res.json({"message" : "Login Successfully" ,"error" : 0 , "user" : userdata});
             }
         
         });  
    }); 
    
    //Google Login Api
    apiRouter.post('/users/googlelogin', function(req, res) {
           if(req.body.google_id){ 
                User.findOne({'google_id': req.body.google_id}, function(err, user) {
                    if(user){
                        res.json({"message": "Result Fetched Successfully", "error": 0, "data": user});
                    }else{
                        var newUser = new User();
                        newUser.full_name = req.body.full_name;
                        newUser.email = req.body.email;
                        newUser.role = 'customer';
                        newUser.username = req.body.email;
                        //gender: req.body.gender,
                        newUser.google_id = req.body.google_id;
                        newUser.image = req.body.image;
                        newUser.save(function(err) {
                            if (err) {
                                console.error(err.message);
                                res.json({"message": err.message, "error": "1"});
                            }else {
                                res.json({"message": "User Added Successfully", "error": "0", "data": newUser});
                            }
                        });
                    }
                });
           }
    });
    
    //Facebook Login Api
    apiRouter.post('/users/facebooklogin', function(req, res) {
           if(req.body.facebook_id){ 
                User.findOne({'facebook_id': req.body.facebook_id}, function(err, user) {
                    if(user){
                        res.json({"message": "Result Fetched Successfully", "error": 0, "data": user});
                    }else{
                        var newUser = new User();
                        newUser.full_name = req.body.full_name;
                        newUser.email = req.body.email;
                        newUser.role = 'customer';
                        newUser.username = req.body.email;
                        //gender: req.body.gender,
                        newUser.google_id = req.body.facebook_id;
                        newUser.image = req.body.image;
                        newUser.save(function(err) {
                            if (err) {
                                console.error(err.message);
                                res.json({"message": err.message, "error": "1"});
                            }else {
                                res.json({"message": "User Added Successfully", "error": "0", "data": newUser});
                            }
                        });
                    }
                });
           }
    });
    
    //Upload Image
    apiRouter.post('/users/post_user_image_app', function(req, res) {
        if(req.body.user_id == null)
        {
            res.json({'message' : "No user available", 'status' : false, 'data' : "" });
            return false;
        }
        var user_id = req.body.user_id;
        var pic = req.body.profile_picture;
//        var base64Data = pic //.replace(/^data:image\/png;base64,/, "");
//        var img_base_name = uuid.v4() + ".png"
//        var imageName = 'https://s3.us-east-2.amazonaws.com/ecoprofilephoto/profilepic/' + img_base_name;
        //res.json(base64Data);
        
         buflic = new Buffer(pic.replace(/^data:image\/\w+;base64,/, ""),'base64');
   // console.log(buflic);
     var data = {
      Body: buflic,
      ContentEncoding: 'base64',
      ContentType: 'image/png'
    };
        
        s3.putObject(data, function(err, data){
            var pro_pic = "https://s3.us-east-2.amazonaws.com/ecoprofilephoto/profilepic/"+randomString+".png";
            User.findById(user_id, function(err, user) {
                user.image = pro_pic;
                if (err) {
                    res.json({'message': "Upload Error", 'status': false, 'data': err});
                    return false;
                }
                user.save(function(err) {
                    res.json({'message': "Profile image updated.", 'status': true, 'data': pro_pic});
                });
            })
        });
        
        
        
//        fs.writeFile(imageName, base64Data, 'base64', function(err) {
//            if(err)
//            {
//                res.json({'message' : "Upload Error", 'status' : false, 'data' : err });
//                return false;
//            }
//                    User.findById(user_id, function(err, user) {
//                            user.image = imageName;
//                            user.save(function(err) {
//                                    res.json({'message' : "Profile image updated.", 'status' : true, 'data' : img_base_name });
//                                });
//                    })
//    });

    });
    
    
    
    apiRouter.post('/users/fetchuserdeatils', function(req, res) {
        User.findOne({'_id': req.body.id}, function(err, user) {
            if (err) {
                res.json({"message": "Unable to fetch details", "error": 1});
            } else {
                res.json({"message": "Result Fetched Successfully", "error": 0, "data": user});
            }
        });
    });
     apiRouter.post('/users/editusrdetails', function(req, res) {
        console.log(req.body);
        
        User.findById({'_id': req.body.id}, function(err, user) {
            console.log("harmannnnn");
            
            if (err){
                res.send(err);
            }else{
            user.full_name=req.body.full_name;
            user.username = req.body.username;
            user.gender = req.body.gender;
            user.role = req.body.role;
            user.location=req.body.location;
            user.image=req.body.image;
            user.save(function(err) {
                if (err){
                    res.send({"error" : 1,"message" : "Unable to edit user"});
                }else{
                res.json({"error":0,"message":'Your Account Has been updated successfully','data':user});
            }
            })
        }
        });
    
    });
    
    apiRouter.post('/adminfetchuserdata', function(req, res) {
         console.log(req.body.path);
        User.findById({'_id': req.body.path}, function(err, user) {
            if (err){
                 res.json({"message" : "Unable to fetch details","error" : 1 });
            }else{
            res.json({"message" : "Result Fetched Successfully","error" : 0 ,"data" : user});
        }
        });
    });
    
     apiRouter.post('/editusrID', function(req, res) {
        console.log(req.body);
        
        User.findById({'_id': req.body.id}, function(err, user) {
            console.log("harmannnnn");
            
            if (err){
                res.send(err);
            }else{
            user.full_name = req.body.full_name;
            user.username = req.body.username;
            user.gender=req.body.gender;
            user.location=req.body.location;
            user.image=req.body.image;
            user.save(function(err) {
                if (err){
                    res.send({"error" : 1,"message" : "Unable to edit user"});
                }else{
                res.json({"error":0,"message":'Your Account Has been updated successfully','data':user});
            }
            });
        }
        });
    
    });
    
      
    apiRouter.post('/change_password_app', function(req, res) {
        console.log(req.body);
        passport.authenticate('local')(req, res, function() {

            if (req.body.new_password !== req.body.confirm_password) {
                res.json({'error': 1, 'message': "Password and confirm password do not match.", 'status': false});

            } else {
                if (req.body.new_password === req.body.password) {
                    res.json({'error': 1, 'message': "You have entered the same current password as new password", 'status': false});

                }else {
                    User.findOne({'_id': req.body.id}, function(err, sanitizedUser) {
                        console.log(sanitizedUser);
                        if (sanitizedUser) {
                            sanitizedUser.setPassword(req.body.new_password, function() {
                                sanitizedUser.save();
                                res.json({'error': 0, 'message': "Password has been Changed", 'status': true});
                            });
                        } else {
                            res.send({'error': 1, 'message': "User does not exist", 'status': false});
                        }

                    });
                }
            }


        });
    });
apiRouter.post('/change_passw', function(req, res) {
        console.log("api");
        console.log(req.body);
     
        User.findOne({'salt': req.body.salt}, function(err, sanitizedUser) {
        console.log(sanitizedUser);
        if (sanitizedUser) {
            sanitizedUser.setPassword(req.body.password, function() {
                sanitizedUser.save();
                res.send({message:"Password reset Successfully"});
            });
        } else {
            res.json({message:"Error"});
        }
    
    });
}); 
 apiRouter.post('/uploaduserimage',userupload.array('file',3), function(req, res, next) {
        console.log("upload");
        console.log(req.body);
        console.log(req.files);
        
        res.send(req.files);
        
    });

 apiRouter.post('/change_email', function(req, res) {
            console.log(req.body);

        User.findOne({'email': req.body.email}, function(err, sanitizedUser) {
        console.log(sanitizedUser);
        if (sanitizedUser) {
             User.findOne({'email': req.body.new_email}, function(err,User) {
                 if(User){
                 res.send({'error' : 1 , 'message' : "Your New Email Address is already taken by another user", 'status' : false});    
                 }else{
                     sanitizedUser.email=req.body.new_email;
                     sanitizedUser.save(function(err) {
                res.json({'error' : 0 , 'message' : "Email has been Changed", 'status' : true});
                 });
             }
            
                
            });
        } else {
            res.send({'error' : 1 , 'message' : "User does not exist", 'status' : false});
        }
    
    });
         });
     




apiRouter.post('/forgetpass', function(req, res) {
        
        console.log(req.body);
//        return false;
        User.findOne({ 'email': req.body.email }).select('+salt +hash').exec(function(err, user) {
            console.log("Hii forget pass");
            
            console.log(user);
                if (user) {
                    console.log("helloo");
                    console.log(user.email);
                    console.log(user.salt);
                host = req.get('host');//remember the server (i.e host) address
                link = "http://" + req.get('host') + "/admin/resetpassword?id=" + user.salt;//create a url of the host server
                var mailOptions = {
                    from: 'rakeshmoyal@avainfotech.com',
                    to: user.email,
                    subject: 'Forgot Password',
                    html: "Hello " + user.email + ",<br> Please Click on the link to change password.<br><a href=" + link + ">Click here to Change Password</a>"
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                         res.json({"error" : 1 ,"message" : "Email has not been sent!"});
                    } else {
                        res.json({"error" : 0 ,"message" :"Email has been sent please check your email"});
                    }
                });
            } else {
                res.json({"error" : 2 , "message" :"Email has not been registered!"});
            }

    });

    });
      
};