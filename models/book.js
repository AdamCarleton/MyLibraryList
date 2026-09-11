const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    cover: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Book', BookSchema);