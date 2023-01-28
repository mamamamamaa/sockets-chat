const {model, Schema} = require("mongoose");

const messageSchema = new Schema({
    message: String,
    author: String,
    time: Date
});

const Message = model("message", messageSchema);

module.exports = {Message};