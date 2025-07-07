import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js"; // Pastikan untuk mengimpor model Message

export const searchContacts = async (request, response) => {
    try {
        const { searchTerm } = request.body; // Dapatkan searchTerm dari request body
        if (searchTerm === undefined || searchTerm === null) {
            return response.status(400).send("Search term is required.");
        }

        const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\___CODE_BLOCK_0__");
        const regex = new RegExp(sanitizedSearchTerm, "i");

        const contacts = await User.find({
            $and: [
                { _id: { $ne: request.userId } }, // Pastikan request.userId ada
                {
                    $or: [
                        { firstName: regex },
                        { lastName: regex },
                        { email: regex }
                    ]
                }
            ]
        });

        return response.status(200).json({ contacts });
    } catch (error) {
        console.log({ error });
        return response.status(500).send("Internal Server Error");
    }
};

export const getContactsForDMList = async (request, response, next) => {
    try {
        // Mengambil userId dengan benar dari request
        const userId = request.userId; // Pastikan userId diset sebelumnya dalam verifyToken middleware

        // Pastikan userId adalah ObjectId
        const convertedUserId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { sender: convertedUserId },
                        { recipient: convertedUserId }
                    ]
                }
            },
            { $sort: { timestamp: -1 } },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", convertedUserId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" },
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 1,
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color", // Perbaiki penamaan dari "contacctInfo.color"
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);

        return response.status(200).json({ contacts }); // Tambahkan respons untuk mengembalikan kontak
    } catch (error) {
        console.error("Error fetching DM contacts: ", error); // Log error lebih spesifik
        return next(error); // Pastikan untuk meneruskan kesalahan jika ada
    }
};