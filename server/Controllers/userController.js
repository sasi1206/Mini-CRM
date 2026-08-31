const users = require("../Models/users");
const bcrypt = require("bcrypt");

async function getUsers(req, res) {
  try {
    const allUsers = await users.find({}, { username: 1, email: 1 });

    res
      .status(200)
      .json({ success: true, message: "Users retrieved", users: allUsers });
  } catch (error) {
    console.log("Error while getting users", error);
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

async function createUser(req, res) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await users.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(200).json({ success: true, message: "User created" });
  } catch (error) {
    console.log("Error while creating user", error);
    if (error.name === "MongoServerError" && error.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    res.status(500).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

module.exports = { getUsers, createUser };
