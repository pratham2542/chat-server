import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";
import User from "../models/user.model.js";


export const sendMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message,
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		//functionality required in assignment
		const userToChat = await User.findById(receiverId);
		const userStatus = userToChat.status;
		if(userStatus==="busy"){
			const timeout = Math.random()*(10000)+5000;
			setTimeout(()=>{
				console.log(`User ${userToChat.username} is busy.`);
			},timeout);
			
		}

		//socket
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			//send message to specific client
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);
	} catch (error) {
		console.log( error.message);
		res.status(500).json({ error: "error" });
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate("messages"); 

		if (!conversation) return res.status(200).json([]);
		//functionality required in assignment
		// const userToChat = await User.findById(userToChatId);
		// const userStatus = userToChat.status;
		// if(userStatus==="busy"){
		// 	const timeout = Math.random()*(10000)+5000;
		// 	setTimeout(()=>{
		// 		console.log(`User ${userToChat.username} is busy.`);
		// 	},timeout);
			
		// }
		const messages = conversation.messages;

		

		res.status(200).json(messages);
	} catch (error) {
		console.log( error.message);
		res.status(500).json({ error: "error" });
	}
};
