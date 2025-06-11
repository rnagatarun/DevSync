import express from 'express';
import connectDB from './database.js';

const app = express();
const port = 3000;




// Connect to the database
connectDB().then(() => {
  console.log('Database connection established');

  app.use('/', (req, res) => {
    res.send('Hello World!');
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});