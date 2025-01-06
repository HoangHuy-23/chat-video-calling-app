import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId, content, media } = req.body;

    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "_id profilePic"
    );

    // Kiểm tra nếu conversation không tồn tại
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Tạo một message mới
    const message = new Message({
      conversationId,
      senderId: userId,
      content,
      media,
      unreadBy: conversation.members
        .filter((member) => member._id.toString() !== userId.toString())
        .map((member) => member._id),
    });

    const response = await message.save();

    // update conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content,
        senderId: userId,
      },
    });

    const messageResponse = response.toObject();
    messageResponse.senderId = {
      _id: req.user._id,
      name: req.user.name,
      profilePic: req.user.profilePic,
    };

    res.status(201).json(messageResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId }).populate(
      "senderId",
      "_id name profilePic"
    );

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findByIdAndUpdate(
      messageId,
      {
        $set: {
          status: "deleted",
        },
      },
      { new: true }
    ).populate("senderId", "_id name profilePic");

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.senderId._id.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized" });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const emoteMessage = async (req, res) => {
  try {
    const userId = req.user._id;
    const { messageId } = req.params;
    const { type } = req.body;

    if (!["like", "love", "haha", "wow", "sad", "angry"].includes(type)) {
      return res.status(400).json({ message: "Invalid emotion type" });
    }

    const message = await Message.findOneAndUpdate(
      { _id: messageId },
      {
        $pull: {
          emotions: {
            user: userId,
            type,
          },
        },
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    return res.status(200).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
