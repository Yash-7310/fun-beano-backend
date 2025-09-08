import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        default: "",
        lowercase: true,
    },
    contact: {
        type: String,
        required: true,
        unique: true,
    },
    password_hash: {
        type: String,
    },
    role: {
        type: String,
        enum: ['user', 'vendor', 'admin'],
        default: 'user',
    }, 
}, {
        timestamps: true
    })

// Middleware to hash password before saving the user document
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password_hash')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
});

// Method to check password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password_hash);
};

const Users = mongoose.model("users", userSchema)
export default Users; 