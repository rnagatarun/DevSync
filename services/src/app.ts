import express from 'express';
import connectDB from './database.js';
import { User } from './models/user.js';

const app = express();
const port = 3000;

app.post('/signup', async(req,res) => {
  const user = new User({
  "firstName": "Alice",
  "lastName": "Smith",
  "emailId": "alice.smith@example.com",
  "password": "password123",
  "age": 25,
  "gender": "Female"
})
  try{
    await user.save();
    res.send("User Saved Successfully")
  }
  catch(error: unknown){
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).send("Error saving user: " + errorMessage);
  }
})


// Connect to the database
connectDB().then(() => {
  console.log('Database connection established');

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});