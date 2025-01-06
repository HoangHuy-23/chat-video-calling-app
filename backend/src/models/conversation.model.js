import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    // option if group chat
    name: {
      type: String,
    },
    // option if group chat
    profilePic: {
      type: String,
      default: "",
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    // option if group chat
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // option if group chat then more than two member
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    lastMessage: {
      content: {
        type: String,
        default: "",
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
