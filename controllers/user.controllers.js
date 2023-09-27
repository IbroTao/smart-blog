const {UserModel} = require('../models/user.models');

const updateBio = async(req, res) => {
    try{
        const {bio} = req.body;
        
        const user = await UserModel.findByIdAndUpdate(req.userid, {bio}, {new: true}).select(['_id', 'bio']); // The constant 'user' is to find user by their ID and update their bio. Check for their ID, update their bio and always send it as new

        if(!user) return res.status(500).json({msg: "User bio failed to update!"});
        res.status(200).json({msg: "User bio updated successfully!", user}); // If user is find by ID, display the message that  user bio is updated successfully.
    } catch(e) {
        res.json(e)
    }
}

const getMe = async(req, res) => {
    try{
        const user = await UserModel.findById(req.userid).select(['-password']);
        if(!user) return res.status(404).json({msg: "User not found!"});
        res.status(200).json({msg: "User found!", user});
    } catch(e) {
        res.json(e)
    }
};

const getUserByID = async(req, res) => {
    try {
        const user = await UserModel.findById(req.params.userid).select(['-password']);
        console.log(user);
        if(!user) return res.status(404).json({msg: "User not found!"})
        res.status(200).json({msg: "User found!", user})
    } catch(e) {
        res.json(e)
    }
}

module.exports = {updateBio, getMe, getUserByID};