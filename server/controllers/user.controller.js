import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		res.status(200).json(filteredUsers);
	} catch (error) {
		console.error( error.message);
		res.status(500).json({ error: "error" });
	}
};

export const setUserStatus = async (req, res) => {
	const { userId } = req.params;
	const { status } = req.body;
  
	try {
	  const user = await User.findById(userId);
  
	  if (!user) {
		return res.status(404).json({ error: "User not found" });
	  }
	  // Updating the user's status
	  user.status = status;
	  await user.save();
  
	  res.status(200).json({ message: "User status updated successfully", user });
	} catch (error) {
	  console.error("Error updating user status:", error.message);
	  res.status(500).json({ error: "Internal Server Error" });
	}
  };

