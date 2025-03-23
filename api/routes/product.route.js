import express from "express";
import {
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/addproduct", verifyToken, addProduct);
router.get("/getProducts", getProducts);
//router.get('/:id', getProductById);
//router.get('/farmer/:id', getFarmerProducts);
router.put("/updateproduct/:productId/:farmer", verifyToken, updateProduct);
router.delete("/deleteproduct/:productId", verifyToken, deleteProduct);

export default router;
