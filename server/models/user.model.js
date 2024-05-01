import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		//functionality required in assignment
		status: {
			type: String,
			enum: ["available", "busy"],
			default: "available",
		},
		
		
		
	},
	
);

const User = mongoose.model("User", userSchema);

export default User;
