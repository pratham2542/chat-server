import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";
import { app, server } from "./socket/socket.js";

dotenv.config();


const PORT = process.env.PORT || 8080; //By default we will give 8080 as port

app.use(express.json()); 
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/messages", messageRoutes);
app.use("/users", userRoutes);

try {
	await mongoose.connect(process.env.MONGO_URL);
	console.log("Connected to MongoDB");
} catch (error) {
	console.log("Error : ", error.message);
}

server.listen(PORT, () => {
	console.log(`Server Running on port ${PORT}`);
});
