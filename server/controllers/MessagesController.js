import Message from "../models/MessagesModel.js";


export const getMessages = async (request, response, next) => {
  try {
    const user1 = request.userId; // User ID dari token atau request
    const user2 = request.body.id; // User ID yang diminta dari body

    // Periksa apakah user1 dan user2 terisi
    if (!user1 || !user2) {
      return response.status(400).send("Both user ID's are required.");
    }

    // Log untuk melihat nilai user1 dan user2
    console.log(`user1: ${user1}, user2: ${user2}`);

    // Query untuk mengambil pesan antara user1 dan user2
    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });

    // Log untuk melihat jumlah pesan yang ditemukan
    console.log(`Messages found: ${messages.length}`);

    // Mengembalikan pesan dengan status 200
    return response.status(200).json(messages);
  } catch (error) {
    console.error(error); // Menampilkan kesalahan yang terjadi
    return response.status(500).send("Internal Server Error");
  }
};