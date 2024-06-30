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
    const {status, title } = req.query;
    const filter = {};
    if(status) filter.status = new RegExp(status, "i");
    if(title) filter.title = new RegExp(title, "i");

    try {
        const allBooks = await BookModel.find(filter);
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


bookRouter.patch("/update/:bookId", auth, async (req,res)=>{
    const updatedData = req.body;
    const {bookId} = req.params;
    const {userId} = req.body;
    try {
        const book = await BookModel.findOne({_id:bookId});
        console.log(book);
        if(book){
            if(book.userId == userId){
                await BookModel.findByIdAndUpdate({_id: bookId}, {$set: {...updatedData}});
                res.send({msg: "book updated."})
            }else{
                res.send({msg: "you are not authorized to update this book"});
            }
        }else{
            res.send("book not found")
        }
    } catch (error) {
        console.log(error);
        res.send({msg: "error occured"});
    }
})

bookRouter.delete("/delete/:bookId", auth, async (req,res)=>{
    const {userId} = req.body;
    const {bookId} = req.params;
    try {
        const book = await BookModel.findOne({_id:bookId});
        if(book){
            if(book.userId == userId){
                await BookModel.findByIdAndDelete({_id: bookId});
                res.send({msg: "book deleted."})
            }else{
                res.send({msg: "you are not authorized to delete this book"});
            }
        }else{
            res.send("book not found");
        }
    } catch (error) {
        console.log(error);
        res.send({msg: "error occured"});
    }
})


module.exports = bookRouter;