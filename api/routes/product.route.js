import express from "express";
import {
  getProducts,
  updateProduct,
  deleteProduct,
  addProduct,
  getProductListings,
  getProductById,
} from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/addproduct", verifyToken, addProduct);
router.get("/getProducts", getProducts);
router.get('/getproductlists', getProductListings);
router.get('/getproductlists/:id', getProductById);
router.put("/updateproduct/:productId/:farmer", verifyToken, updateProduct);
router.delete("/deleteproduct/:productId/:userId", verifyToken, deleteProduct);

export default router;
