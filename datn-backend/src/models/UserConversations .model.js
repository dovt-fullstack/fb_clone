import moment from 'moment';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const UserConversations  = mongoose.model(
  'UserConversations ',
  mongoose.Schema(
    {
      conversationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversations',
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    { timestamps: true, versionKey: false }
  )
);

export default UserConversations ;
