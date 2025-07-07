import { Server as socketIOServer } from "socket.io"; 
import Message from "./models/MessagesModel.js"; 
import User from "./models/UserModel.js"; // Pastikan ini adalah model yang sesuai untuk pengguna

const setupSocket = (server) => {
    const io = new socketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    const userSocketMap = new Map(); 

    const handleDisconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId); 
                break;
            }
        }
    };

    const sendMessage = async (data) => {
        try {
            const { sender, recipient, messageType, content } = data;

            // Simpan pesan ke database
            const createdMessage = await Message.create({
                sender,
                recipient,
                messageType,
                content,
            });

            // Dapatkan data pesan terbaru
            const messageData = await Message.findById(createdMessage._id)
                .populate("sender", "id email firstName lastName")
                .populate("recipient", "id email firstName lastName");

            const recipientSocketId = userSocketMap.get(recipient);
            const senderSocketId = userSocketMap.get(sender);
          
            console.log(`Sending message to recipient socket: ${recipientSocketId}`);

            if (recipientSocketId) {
                io.to(recipientSocketId).emit("receiveMessage", messageData); 
            } else {
                console.log(`Recipient is not online: ${recipient}`);
            }

            if (senderSocketId) {
                io.to(senderSocketId).emit("receiveMessage", messageData);
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            const user = await User.findById(userId); // Ambil data pengguna berdasarkan userId
            userSocketMap.set(userId, socket.id); 
            console.log(`User Connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided for connection");
        }

        socket.on("sendMessage", sendMessage); 

        socket.on("typing", async (data) => {
            console.log(data);
            const { userId } = data; 
            const user = await User.findById(userId); // Ambil nama pengguna berdasarkan userId
            if (user) {
                const name = user.firstName; // Ambil nama depan pengguna
                socket.broadcast.emit("typing", { userId, name }); // Broadcast status mengetik
            }
        });

        socket.on("disconnect", () => handleDisconnect(socket)); 
    });
};

export default setupSocket;