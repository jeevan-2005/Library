require("dotenv").config();
const jwt = require("jsonwebtoken");

const auth = (req,res,next)=>{
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token);  
    if(!token){
        res.send("invalid token , Please Login!");
    }
    jwt.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
        if(err) res.send({msg: "invalid token"});
        req.body.userId = decoded._doc._id;
        req.body.userName = decoded._doc.name;
        next();
    })
}

module.exports = auth;