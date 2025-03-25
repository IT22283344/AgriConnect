import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },

    userrefId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
       
    },
    productId:{
        type:String,
    },
    
    productname: {
        type: String,
        required:true
    },
    farmerId: {
        type: String,
        required:true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required:true,
        mib:1,max:5,
        
    },
 
    reviewimage:{
        type:String,
        default:"https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"
    },
    reply:{
        type:String,
        
    },
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;
