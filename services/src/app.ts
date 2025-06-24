import dotenv from 'dotenv';
import express from 'express';
import connectDB from './database.js';
import { User } from './models/user.js';
import cookieParser from 'cookie-parser';
import { authRouter } from './routes/auth.js';
import { profileRouter } from './routes/profile.js';
import { requestRouter } from './routes/request.js';
import { userRouter } from './routes/user.js';
import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
// Use PORT from environment variable for Render compatibility, default to 3000 for local development
const port = process.env.PORT || 3000;
//Add middleware to handle data and make it json to javascript object
app.use(cors({
  origin: "https://devsyncc.me",
  credentials: true
})
);
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


//getUserByEmail Api
app.get('/user', async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if ((users).length === 0) {
      res.status(400).send("User not found");
    }
    else {
      res.send(users);
    }
  }
  catch {
    res.status(400).send("Something went wrong");
  }
});

//Delete User Api
app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  }
  catch {
    res.status(400).send("Something went wrong");
  }

})

//Update User Api
app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User updated successfully");
  }
  catch {
    res.status(400).send("Something went wrong");
  }
})

// Update User by Email ID API
app.patch('/updateByEmail', async (req, res) => {
  const emailId = req.body.emailId;
  const data = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate({ emailId: emailId }, data, { new: true });
    if (!updatedUser) {
      res.status(404).send("User not found");
    } else {
      res.send("User updated successfully");
    }
  } catch {
    res.status(400).send("Something went wrong");
  }
});

// Connect to the database
connectDB().then(() => {
  console.log('Database connection established');

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});