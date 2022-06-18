import winston from "winston";
import cloudinary from "cloudinary";
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
        const zipUrl = await cloudinary.v2.utils.download_folder(`fonts/${fontData.name.english}|${fontData.name.kurdish}`, {
            target_public_id: fontData.name.english,
        });
        const stylesFonts = fontData.styles.map(style => {
            return {
                name: style.name,
                url: style.url
            }
        })
        winston.info(`font with name ${fontData?.name.kurdish} downloaded`);
        return res.status(200).json({
            regular: fontData?.regular,
            styles: stylesFonts,
            zipUrl,
        })
    } catch (error) {
        winston.error(error.message + ' this error happen while downloading a font');
        return res.status(400).json({ error: error.message })

    }

}
export default DownloadFont;