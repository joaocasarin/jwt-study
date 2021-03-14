const mongoose = require('mongoose');
const sha256 = require('sha256');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

UserSchema.pre('save', async function(next) {
    const hash = sha256(`${sha256(this.password)}${sha256(process.env.SALT)}`);
    this.password = hash;
    next();
});

const User = mongoose.model('user', UserSchema);

module.exports = User;