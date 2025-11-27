import express from 'express';
import userRoutes from './userRoutes.js';
import authRoutes from './authRoutes.js';
import postRoutes from './postRoutes.js';

const router = express.Router();

router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

export default router;