const users = require("../Models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = process.env;

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const isUserExist = await users.findOne({ email: email });

    if (!isUserExist) {
      return res.status(404).json({ message: "Invalid email" });
    }

    const isSamePassword = await bcrypt.compare(password, isUserExist.password);

    if (isSamePassword) {
      const access_token = jwt.sign(
        {
          id: isUserExist._id,
          user_email: email,
        },
        ACCESS_TOKEN,
        { expiresIn: "12h" },
      );

      res
        .cookie("CRMTOKEN", access_token, {
          sameSite: "none",
          secure: true,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 12,
        })
        .json({ success: true, message: "User authenticated", username: isUserExist.username });
    } else {
      return res.status(401).json("Email or password is incorrect");
    }
  } catch (error) {
    console.log("Error while login", error);
    res.status(500).json({
      message: error?.response?.data?.message || error?.message,
    });
  }
}
async function logout(req, res) {
  try {
    res
      .cookie("CRMTOKEN", "", {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        maxAge: 0,
      })
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.log(error);
  }
}

module.exports = { login, logout };
