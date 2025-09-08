import Users from "../models/userModels.js";
import Otp from "../models/otp.js";
import jwt from "jsonwebtoken";
import { sendSms } from "../utils/sendSms.js";
import bcrypt from "bcrypt";

const generateToken = (id) => jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});

// register user
export const registerVendor = async (req, res) => {
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
export const loginVendor = async (req, res) => {
    try{
        // parsing and taking the body
        const {email, password} = req.body;
        
        console.log(email, password)
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

// registering user with otp and contact information
export const registerUser = async (req, res) => {
    try{
    // take the data from body.
    const {name, contact} = req.body;
    if(!contact || !name) return res.status(400).json({ status: 400, message: "contact detail is required" })

    const existingContact = Users.findOne({contact: contact});
    if(!existingContact) return res.status(400).json({status: 400, message: "contact not found." })

        // creating otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const hashed_otp = await bcrypt.hash(otp, 10);

        await Otp.findOneAndUpdate(
            {name, contact},
            {name, contact, otp: hashed_otp, updatedAt: new Date()},
            {upsert: true, new: true}
        )

        await sendSms(contact, `${name} your otp is ${otp}`);

        return res.status(200).json({status: 200, message: "Otp send successfully"});
    } catch (e) {
        res.status(500).json({ message: `error while sending otp due to ${e.message}`})
    };
};

// verify user using contact number and otp
export const verifyOtp = async (req, res) => {
    try {
    console.log("in verify otp controller");

    // getting data
    const {name, contact, otp} = req.body;

    // validating contact and otp
    if(!contact || !otp) return res.status(400).json({status: 400, message: "Contact & Otp is required"});

    // fetching otp record from database
    const otpRecord = await Otp.findOne({contact});
    if(!otpRecord) return res.status(400).json({status: 400, message: "OTP expired or not found"});

    // check expiry in 5 min
     const isExpired = new Date().getTime() - otpRecord.createdAt.getTime() > 1 * 60 * 1000;
    if (isExpired) {
      await otpRecord.deleteOne();
      return res.status(400).json({ msg: "OTP expired" });
    }

    // matching the otp with the database otp
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if(!isMatch) return res.status(400).json({status: 400, message: "Invalid Otp"})

        // deleting the otp
        await otpRecord.deleteOne();

        // check or create user
        let userExists = await Users.findOne({contact})
        if(!userExists) {
           userExists = await Users.create({full_name: name, contact})
        }

        // generating access token
        const accessToken = generateToken(userExists._id);

        await userExists.save();
        return res.json({ msg: "Login successful", accessToken, user: userExists });
    } catch (e) {
        return res.status(500).json({ msg: "Error verifying OTP", error: e.message });
    }
}

// verify 
export const verifyVendor = async (req, res) => {
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