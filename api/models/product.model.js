import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productname: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'g', 'l', 'ml', 'piece']
    },
    category: {
        type: String,
        required: true,
        enum: ['vegetables', 'fruits', 'meat', 'grains', 'other']
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    images: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    productSlug: {
        type: String,  // ✅ Fixed the missing type
        required: true,
        unique: true,
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
