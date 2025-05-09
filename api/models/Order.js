import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    farmerId: {
      type: String,
      ref: "User",
    },
    productsId: {
      type: Array,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    subtotal: {
      type: Number,
      default: 0.0,
    },
    deliveryfee: {
      type: Number,
      default: 300,
    },
    cartTotalQuantity: {
      type:Number,
      required:true,
    },
    totalcost: {
      type: Number,
      required: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["Pending","ready", "OnTheWay", "Arrived"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
