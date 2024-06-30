const express = require("express");
const auth = require("../middlewares/auth.middleware");
const BookModel = require("../models/books.model");
const bookRouter = express.Router();

bookRouter.post("/create", auth, async (req,res)=>{
    const {title, cost, totalPages, userId, userName} = req.body;
    try {
        const book = new BookModel({title, cost, totalPages, userId, userName});
        await book.save();
        res.send({msg: "book created."});
    } catch (error) {
        console.log(error);
        res.send({msg: "error occured"});
    }
})

bookRouter.get("/all", async (req,res)=>{
    try {
        const allBooks = await BookModel.find();
        res.send(allBooks);
    } catch (error) {
        console.log(error);
        res.send({msg: "error occured"});
    }
})

bookRouter.get("/mybooks", auth, async (req,res)=>{
    const {userId} = req.body;
    try {
        const allBooks = await BookModel.find({userId});
        if(allBooks.length>0){
            res.send(allBooks);
        }else{
            res.send("No books created by you yet.")
        }
    } catch (error) {
        console.log(error);
        res.send({msg: "error occured"});
    }
})



module.exports = bookRouter;