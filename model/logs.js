import mongoose from 'mongoose'

const logs = new mongoose.Schema({
    level: String,
    message: String,
    label: String,

})

const LogErr = mongoose.model('logs', logs);
export default LogErr;
