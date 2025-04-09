import express from 'express'
import { createOrder, deleteOrder, getAllOrders, updateOrder, getOrder, testOrder, updatedeliverystatus} from '../controllers/orderController.js';

const router = express.Router();

//custommer order handeling routes
router.post('/create',createOrder);
router.get('/test', testOrder)
router.get('/getorders',getAllOrders);
router.get('/getorder/:id', getOrder);
router.delete('/deleteorder/:id',deleteOrder);
router.put('/updatedeliverystatus/:orderId',updatedeliverystatus);



export default router;