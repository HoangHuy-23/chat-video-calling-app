import Peer from "simple-peer";

export type dataRegister = {
  name: string;
  email: string;
  password: string;
};

export type dataLogin = {
  email: string;
  password: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  profilePic: string;
  lastSeen: string;
};

export type Member = {
  _id: string;
  name: string;
  profilePic: string;
  lastSeen?: string;
};

export type lastMessage = {
  content: string;
  senderId: string;
};

export type Conversation = {
  _id: string;
  profilePic: string;
  isGroup: boolean;
  name?: string; // is group
  members: Member[];
  createdAt: string;
  lastMessage: lastMessage;
  updatedAt: string;
};

export type MessageResponse = {
  _id: string;
  conversationId: string;
  senderId: Member;
  content?: string;
  media?: string;
  unreadBy: string[];
  emotions?: any[];
  status: string;
  createdAt: string;
};

export type MyContact = {
  _id: string;
  userId: string;
  contacts: Contact[];
  createdAt: string;
  updatedAt: string;
};

export type Contact = {
  userId: User;
  status: string;
  _id: string;
};

export type FriendRequest = {
  _id: string;
  senderId: User;
  receiverId: string;
  status: string;
  createdAt: string;
};

// call types
export type Participants = {
  caller: SocketUser;
  receiver: SocketUser;
};

export type OngoingCall = {
  participants: Participants;
  isRinging: boolean;
};

export type PeerData = {
  peerConnection: Peer.Instance;
  stream: MediaStream | undefined;
  participantUser: SocketUser;
};

// socket.io-client
export type SocketUser = {
  userId: string;
  socketId: string;
};
