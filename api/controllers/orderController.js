import Order from '../models/Order.js';
import Product from '../models/product.model.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        // Calculate total amount and verify product availability
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            if (product.quantity < item.quantity) {
                return res.status(400).json({ message: `Insufficient quantity for ${product.name}` });
            }
            totalAmount += product.price * item.quantity;
        }

        const order = await Order.create({
            buyer: req.user._id,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod
        });

        // Update product quantities
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.quantity -= item.quantity;
            if (product.quantity === 0) {
                product.isAvailable = false;
            }
            await product.save();
        }

        // Send order confirmation email
        const populatedOrder = await Order.findById(order._id)
            .populate('items.product', 'name price');
        
        const emailSent = await sendOrderConfirmationEmail(populatedOrder, req.user);
        
        if (!emailSent) {
            console.error('Failed to send order confirmation email');
            // Don't fail the order creation if email fails
        }

        res.status(201).json({
            message: 'Order created successfully',
            order,
            emailSent
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('buyer', 'name email')
            .populate('items.product', 'name price');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is authorized to view this order
        if (order.buyer._id.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('buyer', 'name email')
            .populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private
export const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Only allow buyer or admin to update payment status
        if (order.buyer.toString() !== req.user._id.toString() && 
            req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update payment status' });
        }

        order.paymentStatus = paymentStatus;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders by status
// @route   GET /api/orders/status/:status
// @access  Private
export const getOrdersByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const query = {};

        // If user is not admin, only show their own orders
        if (req.user.role !== 'admin') {
            query.buyer = req.user._id;
        }

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        query.status = status;

        const orders = await Order.find(query)
            .populate('buyer', 'name email')
            .populate('items.product', 'name price')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders by payment status
// @route   GET /api/orders/payment/:paymentStatus
// @access  Private
export const getOrdersByPaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.params;
        const query = {};

        // If user is not admin, only show their own orders
        if (req.user.role !== 'admin') {
            query.buyer = req.user._id;
        }

        // Validate payment status
        const validPaymentStatuses = ['pending', 'completed', 'failed'];
        if (!validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({ message: 'Invalid payment status' });
        }

        query.paymentStatus = paymentStatus;

        const orders = await Order.find(query)
            .populate('buyer', 'name email')
            .populate('items.product', 'name price')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 