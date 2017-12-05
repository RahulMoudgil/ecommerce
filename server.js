
var express = require('express'),
       
mongoose = require('mongoose'),
        bodyParser = require('body-parser'),
        passport = require('passport'),
        cookieParser = require('cookie-parser'),
        methodOverride = require('method-override'),
        cors = require('cors'),
        app = express();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
        envConfig = require('./server/env')[env];

mongoose.connect('mongodb://ABHI:future123@ds127938.mlab.com:27938/e_commerce');
mongoose.connection.on('open', function() {
    console.log('Mongoose connected');
});

// PASSPORT CONFIG
require('./server/passport')(passport);



app.use(bodyParser.json({limit:'50mb'}));
 app.use(bodyParser.urlencoded({extended:true, limit:'50mb', parameterLimit:50000}));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));


// ROUTES
require('./server/routes')(app, passport);

// Start server
app.listen(envConfig.port, function() {
    console.log('Server listening on port ' + envConfig.port)
});