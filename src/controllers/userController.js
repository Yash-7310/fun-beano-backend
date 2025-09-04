import Users from "../models/userModels.js";
import bcrypt from "bcrypt";

// fetch all the users
export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (e) {
        res.status(400).json({status: 400, message: `Unable to fetch user details.`})
    }
}

//create user
// export const createUser = async (req, res) => {
//     try {
//     const {full_name, email, contact, password} = req.body;
//      if (!full_name || !email || !password) {
//        return res.status(400).json({status: 400, message: "Please provide all required fields."});
//     }

//     const userExists = await Users.findOne({ email: email.toLowerCase() });

//     if (userExists) {
//         return res.status(400).json({status:400, message: "User with this email already exists."});
//     }

//         const user = new Users({full_name, email, contact, password_hash: password})
//         await user.save();
//         res.status(200).json(user);
//     } catch (e) {
//         res.status(400).json({status: 400, message: `Cannot create user due to - ${e}`});
//     }
// }