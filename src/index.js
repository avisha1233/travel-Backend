import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./handlers/index.js";
import { authMiddleware } from "./middlewares/authmiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cors from "cors";

dotenv.config();

const app = express();

mongoose
  .connect(process.env.MANGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })

  .catch((err) => {
    console.error(err);
  });
  app.use(
  cors({
    origin:"http://localhost:5173",
    methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
    allowedHeaders:["Content-Type","Authorization"]
  })
  );

app.use(express.json());
app.use(authMiddleware); // Apply auth middleware globally
app.use("/", routes);
app.use(errorHandler); // Error handling middleware



app.listen(process.env.PORT, () => {
 console.log(`Server is running on port ${process.env.PORT}`);
// console.log(`API +Socket.IO running on http://localhost:${port}`);
});
 