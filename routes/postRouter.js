import express from "express";
import * as postController from "../controllers/postController.js";

const router = express.Router();

import protect from '../middleware/authMiddleware.js'

router
  .route("/")
  .get(postController.getAllPosts)
  .post(protect, postController.createPost);
router
  .route("/:id")
  .get(postController.getPost)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

export default router;
