import commentPost from '../models/commentPost.model.js';
import Post from '../models/post.models.js';
import User from '../models/user.model.js';

export const portControllers = {
  createPostByUser: async (req, res) => {
    const { data } = req.body;
    const { id } = req.params;
    console.log('1');
    try {
      const newData = await Post.create({
        name: data.name,
        image: data.image,
        location: data.location,
        users: id,
      });
      const nextResult = await User.findByIdAndUpdate(
        id,
        {
          $push: {
            posts: newData._id,
          },
        },
        {
          new: true,
        }
      );
      return res.status(201).json(nextResult);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  getPostByUser: async (req, res) => {
    const { id } = req.params;
    try {
      const post = await Post.findById(id).populate([
        {
          path: 'users',
          select: '-password -refreshToken',
        },
      ]);
      return res.status(200).json({
        message: 'success',
        post,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  updatePostByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, image, location } = req.body.data;
      console.log(name, image, location);
      const data = await Post.findByIdAndUpdate(
        id,
        {
          $set: {
            name: name,
            location: location,
            image: image,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: 'successfully updated',
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  removePostByUser: async (req, res) => {
    const { id } = req.params;
    const { reverse } = req.query;
    try {
      if (reverse !== 2 || !reverse) {
        const data = await Post.findByIdAndUpdate(
          id,
          {
            $set: {
              status: 1,
            },
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          message: 'deleted successfully',
          data: data,
        });
      } else if (reverse == 2) {
        const data = await Post.findByIdAndUpdate(
          id,
          {
            $set: {
              status: 0,
            },
          },
          {
            new: true,
          }
        );
        return res.status(200).json({
          message: 'reverse successfully',
          data: data,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  getAllPostByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const data = await User.findById(id)
        .select('-avatar -refreshToken -coverImage -friends')
        .populate([
          {
            path: 'posts',
            populate: {
              path: 'users',
              select: ' -refreshToken -coverImage -friends',
            },
          },
        ]);
      data.posts.sort((a, b) => b.updatedAt - a.updatedAt);

      return res.json(data.posts);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  likePostByUser: async (req, res) => {
    console.log('1');
    try {
      const { id } = req.params;
      const { idUser, tym, like } = req.query;
      if (like == 1) {
        const dataPost = await Post.findById(id);
        const indexUser = dataPost.like.findIndex((items) => items == idUser);
        const indexUserTym = dataPost.tym.findIndex((items) => items == idUser);
        if (indexUser != -1) {
          dataPost.like.splice(indexUser, 1);
          dataPost.tym.splice(indexUserTym, 1);
        } else {
          dataPost.like.push(idUser);
          dataPost.tym.splice(indexUserTym, 1);
        }
        await dataPost.save();
        return res.json({
          message: 'success update like',
          data: dataPost,
        });
      } else if (tym == 1) {
        const dataPost = await Post.findById(id);
        const indexUserTym = dataPost.tym.findIndex((items) => items == idUser);
        const indexUser = dataPost.like.findIndex((items) => items == idUser);
        if (indexUserTym != -1) {
          dataPost.like.splice(indexUser, 1);
          dataPost.tym.splice(indexUserTym, 1);
        } else {
          dataPost.tym.push(idUser);
          dataPost.like.splice(indexUser, 1);
        }
        await dataPost.save();
        return res.json({
          message: 'success update tym',
          data: dataPost,
        });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  commentPostByUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { message, idUser, image } = req.query;
      console.log(message, idUser);
      const dataPost = await Post.findById(id);
      const newComment = await new commentPost({
        comment: message,
        image: image,
        idPost: id,
        idUser: idUser,
      }).save();
      await dataPost.cmt.push(newComment.id);
      await dataPost.save();
      return res.json({ data: dataPost });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  removeComment: async (req, res) => {
    try {
      const { id } = req.params;
      const { idPost } = req.query;
      await commentPost.findByIdAndDelete(id);
      const dataPost = await Post.findById(idPost);
      const checkIdComment = dataPost.cmt.findIndex((items) => items == id);
      if (checkIdComment != -1) {
        dataPost.cmt.splice(checkIdComment, 1);
      }
      await dataPost.save();
      return res.status(200).json({
        message: 'delete successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  editCommend: async (req, res) => {
    try {
      const { id } = req.params;
      const { comment, image } = req.query;

      const newComment = await commentPost.findByIdAndUpdate(
        id,
        {
          $set: {
            comment: comment,
            image: image,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json(newComment);
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
  getInteractPost: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;
      const dataRactPost = await Post.findById(id);
      const dataLike = dataRactPost.like;
      const dataTym = dataRactPost.tym;
      const userReactLike = await User.find({ _id: { $in: dataLike } }).select('-refreshToken');
      const userReactTym = await User.find({ _id: { $in: dataTym } }).select('-refreshToken');
      switch (status) {
        // get all
        case '0':
          return res.status(200).json({
            message: 'all react',
            data: {
              like : userReactLike,
              tym : userReactTym
            },
          });
        // like
        case '1':
          return res.status(200).json({
            message: 'like post',
            data: userReactLike,
          });
        // tym
        case '2':
          return res.status(200).json({
            message: 'tym post',
            data: userReactTym,
          });
        default:
          return res.status(400).json({
            message: 'Invalid status',
          });
      }
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
};
