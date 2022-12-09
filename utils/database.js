const mongoose = require('mongoose');

async function dbconnect() {
  try {
    mongoose.connect(process.env.MONGO_KEY);

    console.log('Connected to Mongoose DB'.bgGreen.bold);
  } catch (error) {
    console.log('Error connecting to DB'.bgRed.bold, error);
  }
}

module.exports = dbconnect;