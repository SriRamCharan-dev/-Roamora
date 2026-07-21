const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    clerkId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);
