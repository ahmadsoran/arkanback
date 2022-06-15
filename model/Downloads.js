import mongoose from 'mongoose'
const { Schema, model } = mongoose
const fontsData = new Schema({
    name: String,
    styles: [
        {
            name: String,
            url: String

        }
    ],
    regular: String,
    testText: {
        type: String,
        default: 'لە ژیانماندا ماری زۆر ھەن لە شێوەی مرۆڤ خودایە بمانپارێزە لە خراپی ژەھریان '
    },
    uploadDate: {
        type: Date,
        default: Date.now
    },
    uploader: {
        username: String,
        image: String,
        role: String,
        id: String
    },

    fileSize: String,
    DownloadedTimes: {
        type: Number,
        default: 0
    },
    zipPath: String,

})

const fontsDatas = model('fontsData', fontsData);
export default fontsDatas;

