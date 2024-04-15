import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: String,
    location: {
      type: String,
    },
    like: [],
    tym: [],
    desc: [],
    cmt: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentPost',
      },
    ],
    users: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      default: '0',
    },
  },
  { timestamps: true, versionKey: false }
);

postSchema.plugin(mongoosePaginate);

const Post = mongoose.model('Post', postSchema);

export default Post;
