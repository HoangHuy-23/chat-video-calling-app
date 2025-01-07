import Contact from "../models/contact.model.js";
import Conversation from "../models/conversation.model.js";
import FriendRequest from "../models/friendRequest.model.js";

export const createFriendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user._id;
    if (!receiverId) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const friendRequest = await FriendRequest.create({
      senderId,
      receiverId,
    });

    if (!friendRequest) {
      return res
        .status(400)
        .json({ error: "Friend request could not be created" });
    }

    const responseFriendRequest = await FriendRequest.findOne({
      _id: friendRequest._id,
    }).populate("senderId", "_id name email profilePic lastSeen");

    return res.status(201).json(responseFriendRequest);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendRequests = await FriendRequest.find({
      receiverId: userId,
      status: "pending",
    }).populate("senderId", "_id name email profilePic lastSeen");

    if (!friendRequests) {
      return res
        .status(400)
        .json({ error: "Friend requests could not be found" });
    }

    return res.status(200).json(friendRequests);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const receiverId = req.user._id;

    if (!requestId) {
      return res.status(400).json({ error: "Request ID is required" });
    }

    const friendRequest = await FriendRequest.findOneAndUpdate(
      { _id: requestId, receiverId },
      { status: "accepted" },
      { new: true }
    );

    if (!friendRequest) {
      return res.status(404).json({ error: "Friend request not found" });
    }

    const senderId = friendRequest.senderId;

    const contactReceiver = await Contact.findOneAndUpdate(
      { userId: receiverId },
      {
        $push: {
          contacts: {
            userId: senderId,
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!contactReceiver) {
      return res
        .status(400)
        .json({ error: "Could not update contact receiver" });
    }

    const contactSender = await Contact.findOneAndUpdate(
      { userId: senderId },
      {
        $push: {
          contacts: {
            userId: receiverId,
          },
        },
      },
      { new: true, upsert: true }
    );

    if (!contactSender) {
      return res.status(400).json({ error: "Could not update contact sender" });
    }

    const conversation = await Conversation.create({
      members: [receiverId, senderId],
    });

    if (!conversation) {
      return res.status(400).json({ error: "Could not create conversation" });
    }

    res.status(200).json(friendRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const receiverId = req.user._id;
    if (!requestId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const friendRequest = await FriendRequest.findOneAndUpdate(
      { _id: requestId, receiverId },
      {
        status: "rejected",
      },
      { new: true }
    );

    if (!friendRequest) {
      return res
        .status(400)
        .json({ error: "Friend request could not be rejected" });
    }

    return res.status(200).json(friendRequest);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const cancelFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const senderId = req.user._id;
    if (!requestId) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const friendRequest = await FriendRequest.findOneAndUpdate(
      { _id: requestId, senderId },
      {
        status: "cancelled",
      },
      { new: true }
    );

    if (!friendRequest) {
      return res
        .status(400)
        .json({ error: "Friend request could not be cancelled" });
    }

    return res.status(200).json(friendRequest);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};
