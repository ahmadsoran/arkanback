import mongoose from 'mongoose'

const Visits = new mongoose.Schema({
    visits: {
        type: Number,
        default: 0,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
    IPAddress: {
        type: String,
        default: '',
    },
    location: {
        type: String,
        default: '',
    }
})

export default mongoose.model('Visits', Visits);

