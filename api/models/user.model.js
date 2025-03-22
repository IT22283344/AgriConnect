import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username:{
        type:String,
        required:true,
    },

    userId:{
        type:String,
        required:true,
        unique:true,
    },

    email:{
        type:String,
        required:true,
        unique:true

    },

    password:{

        type:String,
        required:true,

    },

    adress:{
        type:String,
       
    },

    mobile:{
        type:String,
        unique:true

    },

    province:{
        type:String,
        required:true,
    },

    district:{
        type:String,
        required:true,
    },

    town:{
        type:String,
        required:true,
    },

    role:{
        type:String,
        required:true,
    },

    Fexpereience:{
        type:String,
    },
    
    isAdmin:{
        type:Boolean,
        default:false
    },

    isFarmer:{
        type:Boolean,
        default: false,
    },

    isBuyer:{
        type:Boolean,
        default:false
    },

    verifytoken:{
        type:String
    },

    profilePicture:{
        type:String,
        default:"https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=612x612&w=0&k=20&c=dhV2p1JwmloBTOaGAtaA3AW1KSnjsdMt7-U_3EZElZ0=",
    },

    slug: {
        type: String,
        unique: true,
      },

   
},{timestamps:true})

const User = mongoose.model('User',userSchema);
export default User;