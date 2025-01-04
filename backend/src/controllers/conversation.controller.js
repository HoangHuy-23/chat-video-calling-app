import Conversation from "../models/conversation.model.js";

export const createConversationAsGroup = async (req, res) => {
  try {
    const { name, profilePic, members } = req.body;
    const adminId = req.user._id;
    if (!name || !members || members.length < 2) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const conversation = await Conversation.create({
      name,
      profilePic,
      isGroup: true,
      admin: adminId,
      members: [...members, adminId],
    });

    if (!conversation) {
      return res
        .status(400)
        .json({ error: "Conversation could not be created" });
    }

    return res.status(201).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const createConversationAsTwo = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const adminId = req.user._id;
    if (!recipientId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const conversation = await Conversation.create({
      members: [adminId, recipientId],
    });

    if (!conversation) {
      return res
        .status(400)
        .json({ error: "Conversation could not be created" });
    }

    return res.status(201).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const conversations = await Conversation.find({
      members: userId,
    })
      .populate("members", "_id name profilePic lastSeen")
      .sort({ timeOfNewMessage: -1 });

    if (!conversations) {
      return res
        .status(400)
        .json({ error: "Conversations could not be found" });
    }

    return res.status(200).json(conversations);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const conversationId = req.params.id;
    const userId = req.user._id;
    const conversation = await Conversation.findOne({
      _id: conversationId,
      members: userId,
    }).populate("members", "_id name profilePic lastSeen");

    if (!conversation) {
      return res.status(400).json({ error: "Conversation could not be found" });
    }

    return res.status(200).json(conversation);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};
