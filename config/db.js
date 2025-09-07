const mongoose = require("mongoose");

const connectDB = async () => {

    const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/carLental";
  try {
    await mongoose.connect( MONGODB_URL, // replace with Atlas URI if using cloud
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('-----------------------------------------------------------')
    console.log(`${process.env.DB_NAME.toLocaleUpperCase()} DB:connected ✅`);
        console.log('-----------------------------------------------------------')

  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
