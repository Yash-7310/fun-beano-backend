import jwt from "jsonwebtoken";
import Users from "../models/userModels.js";

export const authenticate = async (req, res, next) => {
    try{
        let token; // a variable that will hold the token

        // 1: read token from Authorization Header
        const authHeader = req.headers.authorization || "";
        if(authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1].trim();
        }

        // 2: fallback: check from httponly cookie
        if(!token){
            return res.status(401).json({status: 401, message: "Not authorized, missing token" });
        }

        // verify token using jwt.verfiy
        const decoded = jwt.verify(token, process.env.JWT_SECRET, {
            algorithms: ["HS256"]
        })

        // load user
        const user = await Users.findById(decoded.id).select("-password_hash");

        if(!user) {
            return res.status(401).json({status: 401, message: "User no longer exists" });
        }

        // attach the user in req
        const {full_name, _id, contact, email} = user;
        req.user = {name: full_name, _id, contact, email};
        req.tokenPayload = decoded;

        next();
    }catch(e) {
        if (e.name === "TokenExpiredError") {
            return res.status(401).json({ status: 401, refresh: true, message: "Token expired" });
        } 
        return res.status(401).json({ message: "Not authorized" });
  } 
}