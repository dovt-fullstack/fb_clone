import mongoose from 'mongoose';
const { Schema } = mongoose;

// Định nghĩa schema cho các collection
const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  avatar: String,
});

const conversationSchema = new Schema({
  type: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const messageSchema = new Schema({
  conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
  senderId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: String,
  timestamp: Date,
});

const User = mongoose.model('User', userSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);
const Message = mongoose.model('Message', messageSchema);
async function getUserById(userId) {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}
async function createConversation(type, members) {
  try {
    const conversation = await Conversation.create({ type, members });
    return conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    throw error;
  }
}
async function sendMessage(conversationId, senderId, content) {
  try {
    const message = await Message.create({
      conversationId,
      senderId,
      content,
      timestamp: new Date(),
    });
    return message;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
}

const userId = '6527baf2654b2fa462bd84e8';
getUserById(userId)
  .then((user) => {
    console.log('User:', user);
    return createConversation('private', [userId, 'otherUserId']);
  })
  .then((conversation) => {
    console.log('Conversation:', conversation);
    return sendMessage(conversation._id, userId, 'Hello!');
  })
  .then((message) => {
    console.log('Message sent:', message);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
