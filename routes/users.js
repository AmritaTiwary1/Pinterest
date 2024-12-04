const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pinterest');

 const passport = require('passport');
const plm = require('passport-local-mongoose');


// Define the schema for the user model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true, // Ensures that usernames are unique
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensures that emails are unique
    },
    password: {
        type: String,
        //required:true --> if we write password requires then we will get error 
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId, //type:id should be written but id is not a datatype in mongoose, instead we have mongoose.schema.types.objectId to declare type:id
        ref: 'Post' //to associate users with their posts Assuming you have a Post model defined
    }],
    fullname: {
        type: String,
        required: true,
    },
    dp: {
        type: String, // URL or path to the display picture
        default: '' // Default to an empty string or a placeholder image URL
    }
});

userSchema.plugin(plm);

module.exports = mongoose.model('User', userSchema);
