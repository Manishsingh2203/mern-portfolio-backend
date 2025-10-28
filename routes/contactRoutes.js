import express from 'express';
import {
  submitContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats,
  healthCheck
} from '../controllers/contactController.js';
import { validateContact } from '../middleware/validation.js';
import rateLimit from 'express-rate-limit';

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many contact attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiting for admin endpoints
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

const router = express.Router();

// Public routes
router.post('/submit', contactLimiter, validateContact, submitContact);
router.get('/health', healthCheck);

// Admin routes
router.get('/messages', adminLimiter, getContacts);
router.get('/stats', adminLimiter, getContactStats);
router.get('/messages/:id', adminLimiter, getContactById);
router.patch('/messages/:id/status', adminLimiter, updateContactStatus);
router.delete('/messages/:id', adminLimiter, deleteContact);

export default router;