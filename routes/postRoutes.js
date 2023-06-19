import { Router } from "express";
import {
  addPost,
  checkPostPaymentIntent,
  editPost,
  getPostData,
  getUserAuthPosts,
  searchPosts,
  addReview,
} from "../controllers/PostsController.js";
import { verifyToken,authorizeCreator } from "../middleware/AuthMiddleware.js";

import {postImageUpload,fileUpload} from "../middleware/multer.js";


export const postRoutes = Router();

postRoutes.post("/add", verifyToken, authorizeCreator,postImageUpload,fileUpload, addPost);
postRoutes.post("/get-user-posts", verifyToken, getUserAuthPosts);
postRoutes.post("/get-post-data/", getPostData);
postRoutes.post("/edit-post/", verifyToken,authorizeCreator, postImageUpload,fileUpload, editPost);
postRoutes.post("/search-posts", searchPosts);
postRoutes.post("/add-review", verifyToken, addReview);
postRoutes.post("/check-post-paymentIntent/", verifyToken, checkPostPaymentIntent);
postRoutes.post("/add-review/", verifyToken, addReview);