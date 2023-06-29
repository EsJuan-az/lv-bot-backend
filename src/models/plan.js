const { Schema, model } = require('mongoose');

const planSchema = Schema({
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
        defualt: ''
    },
    priority: {
        type: Number,
        min: 1,
        max: 4,
        default: 4
    },
    status: {
        type:String,
        enum: ['r', 'pn', 'pl', 'h', 'e'],
        required: true,
        default: 'pn'
    },
    tags: {
        type: [String],
        default: []
    },
    images: {
        type: [String],
        default: []
    }
});
module.exports = model('Plan', planSchema);