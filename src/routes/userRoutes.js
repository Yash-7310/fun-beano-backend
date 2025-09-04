import express from "express";
import { getAllUsers } from "../controllers/userController.js";

const router = express.Router();

//Get All Users
router.get("/", getAllUsers);

// create a user
// router.post("/", createUser);

export default router;