import Users from "../models/userModels.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1m"});

// register user
export const registerUser = async (req, res) => {
    try{
    // getting the user data after parsing using express.json() middleware on app.js
    // destructuring the data
    const {full_name, email, contact, password} = req.body;

    // checking if any field is empty or not
    if(!full_name || !email || !contact || !password){
        return res.status(400).json({status: 400, message: "Fields are required"})
    }

    // checking if the user existed or not
    const existingUser = await Users.findOne({ email: email.toLowerCase() });
    if(existingUser) {
        return res.status(400).json({status: 400, message: "user already existed with this email." })
    }

    const user = new Users({full_name, email, contact, password_hash: password});
    user.save();
    res.status(200).json({user});
    } catch (e) {
        res.status(400).json({status: 400, message: `error occured while registering user ${e}`})
    }
}

// login user
export const loginUser = async (req, res) => {
    try{
        // parsing and taking the body
        const {email, password} = req.body;
        
        const user = await Users.findOne({ email: email})
        if(user && (await user.matchPassword(password))){ // the matchPassword here is created in userModal.js where we have checked it with password_hash of individual user.
            res.status(200).json({
                user: {
                    _id: user._id,
                    name: user.full_name,
                    email: user.email,
                    contact: user.contact,
                },
                refresh: false,
                token: generateToken(user._id)
            })
        } else {
            res.status(401).json({status: 401, message: "Invalid user credentials"});
        } 
    } catch(e) {
        res.status(500).json({status: 500, message: e.message });
    }
}

// verify 
export const verifySession = async (req, res) => {
    console.log("in verify Session controller.")
    const {iat, exp} = req.tokenPayload;
     const ttlMs = typeof exp === "number" ? exp * 1000 - Date.now() : null;

  return res.json({
    ok: true,
    user: req.user,    // already sanitized (no password)
    token: {
      iat,             // seconds since epoch
      exp,             // seconds since epoch
      ttlMs,           // time-to-live remaining in ms (convenience for frontend)
    },
  });
}