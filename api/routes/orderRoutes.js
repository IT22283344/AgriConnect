import express from 'express';
import {
    createOrder,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus,
    updatePaymentStatus,
    getOrdersByStatus,
    getOrdersByPaymentStatus
} from '../controllers/orderController.js';


const router = express.Router();

// Protected routes
router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/payment', updatePaymentStatus);

// Order status and payment status routes
router.get('/status/:status', getOrdersByStatus);
router.get('/payment/:paymentStatus', getOrdersByPaymentStatus);

// Admin routes
router.get('/',  getOrders);
router.put('/:id/status', updateOrderStatus);

export default router; 