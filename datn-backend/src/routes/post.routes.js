import { portControllers } from '../controllers/post.controllers.js';
import express from 'express';

const postsRoutes = express.Router();

postsRoutes.post('/remove-post/:id', portControllers.removePostByUser);
postsRoutes.get('/get-post/:id', portControllers.getPostByUser);
postsRoutes.get('/get-all-post/by-user/:id', portControllers.getAllPostByUser);
postsRoutes.post('/post/update-post/:id', portControllers.updatePostByUser);

export default postsRoutes;
