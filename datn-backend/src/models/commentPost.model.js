import mongoose from 'mongoose';

const commentPostSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    idUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    idPost: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  },
  { versionKey: false }
);

const commentPost = mongoose.model('commentPost', commentPostSchema);
export default commentPost;
