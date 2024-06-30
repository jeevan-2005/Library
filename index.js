const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const connection = require("./config/db");
const userRouter = require("./routes/userAuth.route");
const bookRouter = require("./routes/book.route");

const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use("/user",userRouter);
app.use("/books",bookRouter);

app.get("/health-check", (req,res)=>{
    res.send("Health-check server is running fine.");
})

app.listen(port, async ()=>{
    try {
        await connection;
        console.log(`DB is connected and app is running on the port:${port}.`);
    } catch (error) {
        console.log(error);
    }
})