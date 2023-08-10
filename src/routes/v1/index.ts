import express from 'express';
import contactRoutes from './contact.route';

const router = express.Router();

router.use("/contact", contactRoutes);

export default router;