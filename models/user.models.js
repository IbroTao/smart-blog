const { Schema, model } = require('mongoose'); 

const UserSchema = new Schema({
    name: {
        type: String,
        minlength: 6,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    pics: {
        type: String,
        required: false
    },
    bio: {
        type: String,
        maxlength: 350,
    }
}, {
    timestamps: true
});

const UserModel = model('users', UserSchema);

module.exports = {UserModel}