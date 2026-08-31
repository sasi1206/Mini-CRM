const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN } = process.env;

function verifyToken(req, res, next) {
  try {
    const access_token = req.cookies.CRMTOKEN || req.cookies["CRMTOKEN"];

    if (!access_token) {
      return res.status(401).json({ message: "Token not found, login again" });
    }

    const payload = jwt.verify(access_token, ACCESS_TOKEN);

    console.log(payload);

    if (req.baseUrl === "/user" && payload.user_email !== "admin@gmail.com") {
      return res.status(409).json({ message: "Not allowed" });
    }
    if (req.baseUrl === "/task") {
      req.user = payload.id;
    }
    next();
  } catch (error) {
    console.log("Error while verifying user", error);
    res.status(401).json({
      message:
        error?.response?.data?.message || error?.message || "Unknown error",
    });
  }
}

module.exports = verifyToken;
