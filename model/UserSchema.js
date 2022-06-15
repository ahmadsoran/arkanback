import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        trim: true,

    },
    password: {
        type: String,
        minlength: 8,
    },
    email: {
        type: String,
        minlength: 5,
    },
    role: {
        type: String,
        default: 'moderator',
        enum: ['dev', 'admin', 'moderator'],

    },
    created_at: {
        type: Date,
        default: Date.now
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    name: {
        type: String,
        trim: true,
        maxlength: 20,
    },
    image: {
        type: String,
        default: null,

    },







})

export default mongoose.model('User', UserSchema);

