const mongoose = require('mongoose');
const { Schema } = mongoose;

const Post = new Schema({
    author: String,
    date: Date,
    hide: {
        type: Boolean,
        default: false
    },
    targetArtist: String,
    targetWork: String,
    content: String
});

module.exports = mongoose.model('Post', Post);