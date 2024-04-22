import moment from 'moment';
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const Conversations = mongoose.model(
  'Conversations',
  mongoose.Schema(
    {
      members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      }],
      type: String,
    },
    { timestamps: true, versionKey: false }
  )
);

export default Conversations;
