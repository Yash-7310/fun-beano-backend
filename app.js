import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoute from "./src/routes/authRoutes.js";

dotenv.config();
const app = express();


// Middleware
// const corsOptions = {
//     origin: "http://localhost:3000"
// }
app.use(cors({ origin: "*" }));
// setting up the body parser middleware after doing the cors as priority.
app.use(express.json());


// Connect to db
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to FunBeano Backend")
});
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoute)

const PORT = process.env.PORT || 5001;
try{
    app.listen(PORT, () => console.log(`Port running on ${PORT}`))
} catch (e) {
    console.log(e);
}