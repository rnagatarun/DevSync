import express from 'express';
import { validateSignUpData } from '../utils/validation.js';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

export const authRouter = express.Router();

//SignUp Api
authRouter.post('/signup', async (req, res) => {

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
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //Create a JWT Token
      const Token = await user.getJWT();
      //Add token to cookie and send response back to user
      res.cookie("Token", Token);
      res.json({
        message: "Login Successful",
        data: user
      })
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

//SignOut Api
authRouter.post('/logout', async (req, res) => {
  res.cookie("Token", null, {
    expires: new Date(Date.now()),
  })
  res.send("Logout Successful");
});
