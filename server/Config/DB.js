const { connect } = require("mongoose");

async function connectDB() {
  try {
    await connect(process.env.DB_URI);
  } catch (error) {
    console.log("Error while connecting db", error);
    process.exit(1);
  }
}

module.exports = { connectDB };
