import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";

const GetFonts = async (req, res) => {
    const { sort } = req.query
    console.log(sort)
    try {
        if (sort === 'new') {
            var fonts = await fontsDatas.find()
            fonts.reverse()

        } else if (sort === 'old') {
            var fonts = (await fontsDatas.find())
        } else if (sort === 'popular') {
            var fonts = await fontsDatas.find()
            fonts.sort((a, b) => b.DownloadedTimes - a.DownloadedTimes)
        } else {
            var fonts = await fontsDatas.find()
        }

        return res.status(200).json(fonts)
    } catch (error) {
        winston.error(error.message + 'this error happen while getting all fonts');
        return res.status(400).json({ error: error.message })
    }
}
export default GetFonts;