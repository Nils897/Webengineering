const UserModel = require('../Models/userModel');

exports.registerUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({message: "Username is required"});
    }

    UserModel.addUser(username, password);
    res.json({message: "User saved successfully."});
}