const {Message} = require("../models/message");

const findMessage = async () => {
    return Message.find();
}

const createMessage = async (message) => {
    return Message.create(message);
}

module.exports = {findMessage, createMessage};