const { Schema, model, now } = require('mongoose');

const memorySchema = Schema({
    id: {
        type: String,
        unique: true, 
        required: true
    },
    title:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        default: ''
    },
    stars:{
        type: Number,
        min: 1,
        max: 5,
        defualt: 1,
    },
    tags: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    },
    deleted: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: now
    },
    authorId: {
        type: String
    }
});
module.exports = model('Memory', memorySchema);