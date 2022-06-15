import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";

const GetFonts = async (req, res) => {
    try {
        const fonts = await fontsDatas.find();
        return res.status(200).json(fonts)
    } catch (error) {
        winston.error(error.message + 'this error happen while getting all fonts');
        return res.status(400).json({ error: error.message })
    }
}
export default GetFonts;