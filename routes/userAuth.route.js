const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/users.model");
const userRouter = express.Router();
require("dotenv").config();

userRouter.post("/register", async (req,res)=>{
    const user = req.body;
    console.log(user);
    try {
        const findUser = await UserModel.findOne({email: user.email});
        console.log(findUser);
        if(findUser){
           return  res.send({"msg": "User already exists with this email. Please Login"});
        }
        bcrypt.hash(user.password, 8, async (err, hash)=>{
            if(err) res.send({msg: "error occured while hashing password"});
            const newUser = new UserModel({...user, password:hash,});
            await newUser.save();
            res.send({msg: "Registration successful."});
        })
    } catch (error) {
        console.log(error);
        res.send({msg: "error occurred during registration."});
    }
})

userRouter.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    try {
        const findUser = await UserModel.findOne({email});
        console.log(findUser);
        if(findUser){
            bcrypt.compare(password, findUser.password, (err, result)=>{
                console.log(result);
                if(err) res.send({msg: "error occured while comparing password"});
                if(result){
                    const token = jwt.sign({...findUser}, process.env.JWT_SECRET , {expiresIn: "1d"});
                    res.send({msg: "login success", token: token,});
                }else{
                    res.send({msg: "Invalid credentials."});
                }
            })
        }else{
            res.send({msg: "email not found."})
        }
    } catch (error) {
        console.log(error);
        res.send({msg: "error occured while login"})
    }
})

module.exports = userRouter;