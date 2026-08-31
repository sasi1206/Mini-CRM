require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { connection } = require("mongoose");

const { connectDB } = require("./Config/DB");
const authRoute = require("./Routes/authRoute");
const dashboardRoute = require("./Routes/dashboardRoute");
const leadRoute = require("./Routes/leadRoute");
const companyRoute = require("./Routes/companyRoute");
const taskRoute = require("./Routes/taskRoute");
const userRoute = require("./Routes/userRoute");

const ALLOWED_ORIGINS = ["https://mini-crm-bay.vercel.app","https://apimini-crm-lilac.vercel.app"];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, cb) {
      if (
        !origin ||
        origin.includes("localhost") ||
        ALLOWED_ORIGINS.includes(origin)
      ) {
        cb(null, origin);
      } else {
        cb(new Error("Blocked by cors"), null);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  }),
);
connectDB();

app.use("/auth", authRoute);
app.use("/dashboard", dashboardRoute);
app.use("/lead", leadRoute);
app.use("/company", companyRoute);
app.use("/task", taskRoute);
app.use("/user", userRoute);

connection.on("connected", () => {
  console.log("Database connected");
  app.listen(process.env.PORT, () => {
    console.log("Server is running");
  });
});

module.exports = app;