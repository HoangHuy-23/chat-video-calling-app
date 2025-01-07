import User from "../models/user.model.js";

export const searchUser = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    const userId = req.user._id;

    if (!keyword) {
      return res.status(200).json([]);
    }

    const users = await User.find({
      _id: { $ne: userId },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    }).select("_id name email profilePic lastSeen");

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};
