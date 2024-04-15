import { portControllers } from '../controllers/post.controllers.js';
import express from 'express';

const postsRoutes = express.Router();

postsRoutes.post('/remove-post/:id', portControllers.removePostByUser);
postsRoutes.get('/get-post/:id', portControllers.getPostByUser);
postsRoutes.get('/get-all-post/by-user/:id', portControllers.getAllPostByUser);
postsRoutes.post('/post/update-post/:id', portControllers.updatePostByUser);
postsRoutes.get('/post/like-post/:id', portControllers.likePostByUser);
postsRoutes.get('/post/comment-post/:id', portControllers.commentPostByUser);
postsRoutes.get('/post/comment-remove/:id', portControllers.removeComment);
postsRoutes.get('/post/comment-edit/:id', portControllers.editCommend);
postsRoutes.get('/post/react-post/:id', portControllers.getInteractPost);



export default postsRoutes;
