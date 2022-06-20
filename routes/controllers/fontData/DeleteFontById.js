import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";
import cloudinary from "cloudinary";
const DeleteFontById = async (req, res) => {
    const { id } = req.query;

    try {
        if (id !== 'undefined') {
            const findById = await fontsDatas.findById(id);

            return res.status(200).json({ message: `font deleted successfully` })
        }
        return res.status(200).json()
    } catch (error) {
        winston.error(error.message + 'this error happen while deleting a font');
        return res.status(400).json({ error: error.message })

    }
}

export default DeleteFontById;