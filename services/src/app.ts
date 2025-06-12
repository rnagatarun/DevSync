import express from 'express';
import connectDB from './database.js';
import { User } from './models/user.js';
import bcrypt from 'bcrypt';
import { validateSignUpData } from './utils/validation.js';

const app = express();
const port = 3000;
//Add middleware to handle data and make it json to javascript object
app.use(express.json());

//SignUp Api
app.post('/signup', async (req, res) => {

  try {
    // validate the data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    //Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    //Create new instanceof the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });

    await user.save();
    res.send("User Saved Successfully");
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).send("Error saving user: " + errorMessage);
  }
});

//SignIn Api
app.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login Successful")
    }
    else {
      throw new Error("Invalid Credentials");
    }
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(400).send("Error: " + errorMessage)
  }
});

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

//Feed Api
app.get('/feed', async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  }
  catch {
    res.status(404).send("Something went wrong")
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