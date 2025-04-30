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
    discountedPrice:{
        type:Number,
        required:true,
    },
    offer:{
        type:Boolean,
    },
    userId: {
        type: String,
        ref: 'User',
    },
    province:{
        type:String,
        ref: 'User',
    },

    district:{
        type:String,
        ref: 'User',
    },
    town:{
        type:String,
        ref: 'User',
    },

    images: [{
        type: String
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    productSlug: {
        type: String, 
        unique: true,
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);
export default Product;
