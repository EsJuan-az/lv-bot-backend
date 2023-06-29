const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    userId: String,
    name: String,
    birthday: Date,
    profilePic: String,
    groups: {
      type: [{
        chatId: String,
        exp: {
          type: Number,
          default: 1
        },
        level: {
          type: Number,
          default: 1
        },
        totalMsg: {
          type: Number,
          default: 1
        },
      }],
      default: []
    }
  });

module.exports = model('User', userSchema);