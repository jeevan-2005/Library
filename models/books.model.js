const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: {type:String, required: true},
    cost: {type:String, required: true},
    totalPages: {type:String, required: true},
    status: {type: String, default:"pending"},
    userId: {type: String, required: true},
    userName: {type:String, required: true}
})

const BookModel = mongoose.model('book',bookSchema);

module.exports = BookModel;