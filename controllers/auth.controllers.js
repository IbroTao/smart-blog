const { hashSync, compareSync } = require("bcryptjs"); // Import 'hashSync' and 'compareSync' from bycrptjs because that what we need to hash and compare the password(s).
const { UserModel } = require("../models/user.models"); // Import our user database
const {sign} = require('jsonwebtoken') // Import 'sign' from jsonwebtoken because that's what we use in creating token.
require('dotenv').config({}); // Import SECRET from '.env' file. 

const SECRET = process.env.SECRET;


const registerUser = async(req, res) => {
    try{
        const {name, password, email} = req.body; // This code is asking for us to input our name, password and email.
        const user = await UserModel.findOne({email}); // The constant, 'user' is used to find if the email already exist in our database. We added 'await' at the front of our code cos it is to receive promise.

        if(user) return res.status(400).json({msg: "Existing email, try another email"}) // If user (that is the user has register with that same email before)already exist, that's if the email we inputed is in our database, it should return 400{Bad Request} error.
        await UserModel.create({name, email, password: hashSync(password, 11)}); // This code is to create a new user logging for the 1st time with a new email. It will store the new user name, email and password in the database. Note the password will be hashed so that another user will not be able to change or know the password.
        res.status(201).json({msg: "User created!"});
    } catch(e) {
        console.log(e)
    }
};

// The code below is to create jsonwebtoken(JWT) which will be used to authenticate user each time they try to login
const createJWT = (userid) => {
    return sign({
        sub: userid,
        exp: 300000,
    }, SECRET)
}

const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body; // This code is asking for us to input our name, password and email.
        const user = await UserModel.findOne({email}); // The constant, 'user' is used to find if the email already exist in our database. We added 'await' at the front of our code cos it is to receive promise.
       
        if(!user) return res.status(404).json({msg: "This user does not exist!"}); // if user is not found, display that user does not exist

        const isPasswordCorrect = compareSync(password, user.password); // If user exist, then try to check if the password they inputed the first time is the same with what they are put now

        if(!isPasswordCorrect) return res.status(401).json({msg: "Wrong Password!"}); // If the new password is not the same with the new one, display that the password is wrong.

        const jwtToken = createJWT(user._id) // This code is send token using user._id

        // The code below is to find user in our database(UserModel) but should not return password since it can be taken directly by hackers or other users.
        const returnUser = await UserModel.findById(user._id).select(['-password']) // This code is used to find user by their ID and send the result but should remove the password fron it. 

        res.status(200).json({
            user: returnUser, // User should be the constant 'returnUser
            token: jwtToken, // Token should be the 'jwtToken' we created
            msg: "User logged in successfully!" // Display the message
        })
    } catch(e) {
        res.json(e);
    }
}

module.exports = {registerUser, loginUser};