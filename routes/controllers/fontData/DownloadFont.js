import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";

const DownloadFont = async (req, res) => {
    const { fontId } = req.body;
    try {
        const fontData = await fontsDatas.findById(fontId);
        if (!fontData) {
            winston.error(`font with id ${fontId} not found`);
            return res.status(400).json({ error: "font not found" })
        }
        fontData.DownloadedTimes += 1;
        await fontData.save();
        const stylesFonts = fontData.styles.map(style => {
            return {
                name: style.name,
                url: style.url
            }
        })
        winston.info(`font with name ${fontData?.name} downloaded`);
        return res.status(200).json({
            regular: fontData?.regular,
            styles: stylesFonts,
            zipPath: fontData?.zipPath,
        })
    } catch (error) {
        winston.error(error.message + 'this error happen while downloading a font');
        return res.status(400).json({ error: error.message })

    }

}
export default DownloadFont;