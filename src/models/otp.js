import mongoose from "mongoose";

const otp = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
        minLength: 10,
        maxLenght: 10
    },
    otp: {
        type: String,
    }
}, {timestamps: true})

const Otp = mongoose.model("otp", otp);
export default Otp;