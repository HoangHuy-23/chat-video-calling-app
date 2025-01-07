import Contact from "../models/contact.model.js";

export const getMyContacts = async (req, res) => {
  try {
    const userId = req.user._id;

    const contacts = await Contact.findOne({
      userId,
    }).populate("contacts.userId", "_id name email profilePic lastSeen");

    if (!contacts) {
      return res.status(400).json({ error: "Contacts could not be found" });
    }

    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ message: "Server error: " + error.message });
  }
};

// export const addNewFriendToContact = async (req, res) => {
//   try {
//     const { userId } = req.body;
//     const contactId = req.user._id;
//     if (!userId) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const contact = await Contact.findOneAndUpdate(
//       { userId: contactId },
//       {
//         $push: {
//           contacts: {
//             userId,
//           },
//         },
//       },
//       { new: true }
//     );

//     if (!contact) {
//       return res.status(400).json({ error: "Contact could not be added" });
//     }

//     return res.status(201).json(contact);
//   } catch (error) {
//     return res.status(500).json({ message: "Server error: " + error.message });
//   }
// };
