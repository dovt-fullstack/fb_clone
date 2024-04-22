import moment from 'moment';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const messageUser = mongoose.model(
  'messageUser',
  mongoose.Schema(
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations',
      },
      senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      MessageContents: String,
    },
    { timestamps: true, versionKey: false }
  )
);

export default messageUser;
