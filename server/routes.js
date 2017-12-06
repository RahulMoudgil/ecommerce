var express = require('express'),
        path = require('path'),
        User = require('./models/user'),
    // nodemailer modules
      nodemailer = require('nodemailer'),
        rootPath = path.normalize(__dirname + '/../'),
        apiRouter = express.Router(),
        router = express.Router(),
        sr = require('simple-random'),
        serialize = require('node-serialize'),
        randomString = sr();

//For Image upload in bucket
        aws = require('aws-sdk'),
        multer = require('multer'),
        multerS3 = require('multer-s3'),
        dateNow = Date.now()

var transporter = nodemailer.createTransport({
    host: 'email-smtp.us-east-1.amazonaws.com',
    port: 587,
    auth: {
        user: "AKIAJVXBUELTWRZ7PZCQ",
        pass: "Ap69lKNzBoU1WgAxvpQqilM09x/KEfv97B1fgX2jYH+r"
    }
});



aws.config.update({
    secretAccessKey: 'rNz/3oHBOxRle/5dGoae3HYmaopCgvd2lcofot2X',
    accessKeyId: 'AKIAJEMASLRRSJNZYHKQ'
});

var key = randomString + ".png";
var s3 = new aws.S3({
    endpoint: 'https://s3.us-east-2.amazonaws.com',
    region: 'us-east-2',
    signatureVersion: 'v4',
    ACL: 'public-read',
    params: {
        Bucket: 'ecoprofilephoto',
        Key: 'profilepic/' + key
    }
});
var userupload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'ecoprofilephoto',
        key: function(req, file, cb) {
           //console.log(file);
            var flname = file.originalname;
            cb(null, 'profilepic/' + dateNow + '' + flname); //use Date.now() for unique file keys
        }
    })
});

module.exports = function(app, passport) {
    app.use('/api', apiRouter);
    app.use('/', router);
    // API routes
    require('./api/users')(apiRouter,passport,transporter,s3,randomString,userupload);
    // home route
//    router.get('/', function(req, res) {
//        res.render('index');
//    });
    // admin route
    router.get('/admin', function(req, res) {
        res.render('admin/login');
    });
    router.get('/admin/dashboard', isAdmin, function(req, res) {
        res.render('admin/dashboard', {user: req.user});
    });
    router.post('/admin/login', passport.authenticate('local'), function(req, res) {
        res.redirect('/admin/dashboard');
    });
    
    router.get('/admin/forgotpassword', function(req, res) {
        res.render('admin/forgotpassword');
    });
     ///sitemap
    router.get('/sitemap.xml', function(req, res) {
        Post.find({}, 'paramal', function(err, mongourls)
        {
            //console.log(mongourls);
            var pageUrls=[];
            if (mongourls) {
                for (var i = 0; i < 2; i++) {
                    var obj = {url: "/" + mongourls[i].paramal, changefreq: 'daily', priority: 0.9};
                    
                    pageUrls.push(obj);
                }
            }
            var sitemap = sm.createSitemap({
                hostname: 'https://readyourlessons.com',
                cacheTime: 600000, // 600 sec - cache purge period 
                urls: pageUrls
            });
            sitemap.toXML(function(err, xml) {
                if (err) {
                    return res.status(500).end();
                }
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            });
        });
    });
    
     router.get('/sitemap1.xml', function(req, res) {
        Post.find({}, 'paramal', function(err, mongourls)
        {
            //console.log(mongourls);
            var pageUrls=[];
            if (mongourls) {
                for (var i = 0; i < mongourls.length; i++) {
                    var obj = {url: "/" + mongourls[i].paramal, changefreq: 'daily', priority: 0.9};
                    
                    pageUrls.push(obj);
                }
            }
            var sitemap = sm.createSitemap({
                hostname: 'https://readyourlessons.com',
                cacheTime: 600000, // 600 sec - cache purge period 
                urls: pageUrls
            });
            sitemap.toXML(function(err, xml) {
                if (err) {
                    return res.status(500).end();
                }
                res.header('Content-Type', 'application/xml');
                res.send(xml);
            });
        });
    });
     router.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));
    router.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect: '/',
                failureRedirect: '/login'
            }));

     
        
      router.get('/admin/dashboard', isAdmin, function(req, res) {
        res.render('admin/dashboard', {user: req.user});
    });
    router.get('/404', function(req, res) {
        res.render('404');
    });
     router.get('/admin/resetpassword', function(req, res) {
        //res.render('home/forgetpassword');
        console.log(req.query);
        User.findOne({'salt': req.query.id}, function(err, user) {
            console.log(user);
   
                res.render('admin/resetpassword', {salt: req.query.id});
            
        });
    });
    app.use(function(req, res, next) {
        res.status(404);
        res.render('404');
        return;
    });
};
function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        console.log('cool you are an admin, carry on your way');
        next();
    } else {
        console.log('You are not an admin');
        res.redirect('/admin');
    }
}