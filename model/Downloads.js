import mongoose from 'mongoose'
const { Schema, model } = mongoose
const fontsData = new Schema({
    name: {
        kurdish: String,
        english: String,
    },
    styles: [
        {
            name: String,
            url: String

        }
    ],
    regular: String,
    testText: {
        type: String,
        default: 'لەژیانماندا ماری زۆر هەن لە شێوەی مرۆڤ خودایا بمان پارێزە لە خراپی ژەهریان'
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
    category: [],

})

const fontsDatas = model('fontsData', fontsData);
export default fontsDatas;

