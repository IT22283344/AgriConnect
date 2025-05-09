import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import reviewRoute from "./routes/review.route.js";
import productRoute from "./routes/product.route.js";
import orderRoute from "./routes/orderRoutes.js"

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cookieParser());
app.use(express.json());

app.listen(3000, () => {
  console.log("Server is Running on Port 3000");
});

const corsOptions = {
  origin: "http://localhost:5173",
};
app.use(cors(corsOptions));

app.use("/api/auth",authRoute);
app.use("/api/user",userRoute);
app.use("/api/reviews",reviewRoute);
app.use("/api/product", productRoute);
app.use("/api/orders",orderRoute)

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});
