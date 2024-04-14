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
};
