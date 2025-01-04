import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
    },
    media: {
      type: String,
    },
    // option if reply to message then put message id else null
    reply: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    // option if one to one chat then only one member
    unreadBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      enum: ["send", "delivered", "read", "failed", "deleted"],
      default: "send",
    },
    emotions: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        type: {
          type: String,
          enum: ["like", "love", "haha", "wow", "sad", "angry"],
        },
      },
    ],
    callInfo: {
      type: {
        type: String,
        enum: ["audio", "video"],
      },
      status: {
        type: String,
        enum: ["initiated", "missed", "ongoing", "complete", "failed"],
      },
      duration: {
        type: Number,
      },
      startAt: {
        type: Date,
      },
      endAt: {
        type: Date,
      },
      // participant if group call
      participant: {
        type: Object,
        default: undefined,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
