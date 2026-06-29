const mongoose = require("mongoose");
const User = require("../models/user");
const passportlocal = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});
User.plugin(passportlocal);