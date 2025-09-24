import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import{createUser} from '../services/user.js';
import {compare} from 'bcryptjs';
import User from '../models/user.js';

const  generateToken =asyncHandler(async (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET,{expiresIn: '15d'}); 
});

const register = asyncHandler(async (req, res) => {

   try {

    const user  = await createUser(req.body);
    const token = await generateToken(user._id);
    res.status(201).json({token});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

      /*  const user = await createUser(req.body);
        const token = await generateToken(user._id);
        res.status(201).json({ token  });*/

});

//export {generateToken, register};

const login = asyncHandler(async (req, res) => {
   /* try {
    const { email, password } = req.body;   
    const user = await User.findOne({ email });
    if(!user){
        throw new Error("User not found");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if(!isPasswordCorrect){
        throw new Error("Invalid credentials");
    }
    const token = await generateToken(user._id);
    res.status(200).json({ token });
} catch (error) {
    res.status(400).json({ message: error.message });
  } */
const { email, password } = req.body;
const user = await User.findOne({ email });
if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
}
const isPasswordCorrect = await compare(password, user.password);
if (!isPasswordCorrect) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
}
const token = await generateToken(user._id);
res.status(200).json({ token });
});



export { register, login, generateToken };



