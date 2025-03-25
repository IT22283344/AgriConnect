import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const {
    username,
    email,
    password,
    mobile,
    adress,
    district,
    province,
    town,
    role,
    slug,
    userId,
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{5,}$/;

  // Validation
  if (
    !username || !email || !password || !mobile || !adress || !district || !role || !province || !town ||
    username.trim() === "" || email.trim() === "" || password.trim() === "" || mobile.trim() === "" ||
    province.trim() === "" || adress.trim() === "" || district.trim() === "" || town.trim() === "" || role.trim() === ""
  ) {
    return next(errorHandler(400, 'All fields are required'));
  } else if (!emailRegex.test(email)) {
    return next(errorHandler(400, 'Invalid email format'));
  } else if (!mobileRegex.test(mobile)) {
    return next(errorHandler(400, 'Invalid mobile number format'));
  } else if (!passwordRegex.test(password)) {
    return next(errorHandler(400, 'Password should be at least 5 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+).'));
  } else if (username.length < 7 || username.length > 20) {
    return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
  }

  try {
    // 1. Count existing users with same role
    const rolePrefixMap = {
      farmer: "FID",
      wholeseller: "WS",
    };

    const prefix = rolePrefixMap[role.toLowerCase()];
    if (!prefix) {
      return next(errorHandler(400, `Invalid role: ${role}`));
    }

    const count = await User.countDocuments({ role: role });

    // 2. Generate userId e.g., FID1, WS1, etc.
    const userId = `${prefix}${count + 1}`;

    // 3. Hash password and save user
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      adress,
      mobile,
      province,
      district,
      town,
      role,
      slug,
      userId,  // Add generated userId
    });
    console.log(newUser)

    const savedUser = await newUser.save();

    // Generate slug
    const generatedSlug = `${username.split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "")}-${savedUser._id}`;
    savedUser.slug = generatedSlug;

    const updatedUser = await savedUser.save();
    res.status(201).json(updatedUser);
  } catch (err) {
    next(err);
  }
};



export const signin = async(req,res,next)=>{
  const {email,password} = req.body;
  if(!email || !password || email==="" || password===""){
    next(errorHandler(400,"All fields are required"));
  }
  try{
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found!'));
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(400,'Invalid Credentials!'));
    const token = jwt.sign({id:validUser._id , isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
    console.log(token)
    const{password:hashedPassword, ...rest} = validUser._doc;
    const expiryDate = new Date(Date.now()+3600000);
    res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
  }catch(error){
    next(error);
  }
}

export const google = async (req,res,next) => {
  try{
    const user = await User.findOne({email:req.body.email});
    if (user){
      const token = jwt.sign({id:user._id , isAdmin:user.isAdmin},process.env.JWT_SECRET);
      const{password:hashedPassword, ...rest} = user._doc;
      
      res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
    }else{
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
        const newUser = new User({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-8), 
        email:req.body.email, password: hashedPassword, profilePicture:req.body.photo });

        await newUser.save();
         const token = jwt.sign({id:newUser._id , isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
         const{password:hashedPassword2, ...rest} = newUser._doc;
         const expiryDate = new Date(Date.now()+3600000);
         res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
    }
  }catch(error){
    next(error);
  }
}

