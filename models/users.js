const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema ({
    name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model('User', User);