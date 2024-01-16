require("dotenv").config();
const express = require("express");
const Cors = require("cors");
const fileUpload = require("express-fileupload");

const adminRouter = require("./Admin/Admin.route");
const supplierRouter = require("./Admin/Supplier/Supplier.route");

const app = express();

app.use(express.json());
app.use(
  Cors({
    origin: [
      "http://localhost:3000",
      "https://spontaneous-marigold-50802b.netlify.app/",
    ],
    allowedHeaders: ["*", "authorization"],
  })
);
app.use(fileUpload());

app.use("/api/admin", adminRouter);
app.use("/api/supplier", supplierRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("Server is Running for Admin");
});
