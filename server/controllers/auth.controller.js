import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


//generate jwt tokens for every sessions
const generateToken = (userId, res) => {
	const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
		expiresIn: "5d",
	});

	res.cookie("jwt", token, {
		maxAge: 5 * 24 * 60 * 60 * 1000, //It will expire in 5 days 
		httpOnly: true, 
	});
};


export const signup = async (req, res) => {
	try {
		const { email, username, password, confirmPassword } = req.body;

		if (password !== confirmPassword) {
			return res.status(400).json({ error: "Please Enter Same Password" });
		}

		const user = await User.findOne({ username });

		if (user) {
			return res.status(400).json({ error: "Please Enter different Username" });
		}

		// We will hash our password here and then save 
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		

		const newUser = new User({
			email,
			username,
			password: hashedPassword,
			
		});

		if (newUser) {
			
			generateToken(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				email: newUser.email,
				username: newUser.username,
				
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		res.status(500).json({ error});
	}
};

export const login = async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateToken(user._id, res);

		res.status(200).json({
			_id: user._id,
			email: user.email,
			username: user.username,
			
		});
	} catch (error) {
		res.status(500).json({ error });
	}
};

//Set maxAge to 0 to immediately remove jwt token
export const logout = (req, res) => {
	try {
		res.cookie("jwt", "", { maxAge: 0 });
		res.status(200).json({ message: "Logged out successfully" });
	} catch (error) {
		res.status(500).json({ error});
	}
};
