const mongoose = require('mongoose');

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        // We will not exit the process here so that the server still runs if MongoDB fails during local testing.
        // process.exit(1); 
    }
};

module.exports = connectMongoDB;
