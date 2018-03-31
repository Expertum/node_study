const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Task = new Schema ({
    name: {
        type: String,
        required: true
    },
    text: {
        type: String
    }
});

module.exports = mongoose.model('Task', Task);
