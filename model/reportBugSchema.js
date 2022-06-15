import mongoose from 'mongoose'

const ReportBug = new mongoose.Schema({
    title: String,
    message: String,
    date: {
        type: Date,
        default: Date.now
    },
})

export default mongoose.model('ReportBug', ReportBug);

