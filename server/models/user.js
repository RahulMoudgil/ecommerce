var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
	email: {
		type: String, 
		required: '{PATH} is required!'
	},
	full_name:{type:String},
        username:{type:String},
	role:{type:String},
        gender:{type:String},
	password:{type:String},
        new_password:{type:String},
        confirm_password:{type:String},
        location:{type:String},
        image:{type:String},
	facebook_id:{ type: String},
        google_id:{ type: String},
        twitter_id:{ type: String},
        facebook_token:{ type: String},
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now }
});

// Passport-Local-Mongoose will add a username, 
// hash and salt field to store the username, 
// the hashed password and the salt value

// configure to use email for username field
User.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', User);