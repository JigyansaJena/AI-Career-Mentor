const mongoose = require('mongoose');

const connectDB = async() => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);  //kills the server if connection doesn't open up to the local mongoDB
  }
};

module.exports = connectDB;