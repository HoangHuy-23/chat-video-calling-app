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

// socket.io-client
export type SocketUser = {
  userId: string;
  socketId: string;
};
