import express  from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {  deleteUser, forgetpassword, getAdmins, getFarmers, getUser, getUsers, getWholesellers, resetpassword, signout, test, updateResetPassword, updateUser, weatherData } from "../controllers/user.controller.js";


const router = express.Router();

router.get('/test',test);
router.put("/update/:id" , verifyToken , updateUser);
router.delete("/delete/:id" , verifyToken , deleteUser);
router.get('/signout',signout);
router.get('/getadmins', getAdmins);
router.get('/getfarmers', getFarmers);
router.get('/getwholesellers', getWholesellers);
router.get('/getusers', verifyToken, getUsers);
router.post('/forgetpassword',forgetpassword);
router.get('/resetpassword/:id/:token',resetpassword);
router.post('/updateResetPassword/:id/:token',updateResetPassword);
router.get('/getUser/:userId', getUser);

router.get('/weather/forecast', weatherData);

export default router;