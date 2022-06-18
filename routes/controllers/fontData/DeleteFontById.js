import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";
import cloudinary from "cloudinary";
const DeleteFontById = async (req, res) => {
    const { id } = req.query;

    try {
        if (id !== 'undefined') {
            const findById = await fontsDatas.findById(id);

            await cloudinary.v2.api.delete_folder(`fonts/${findById.ENname}|${findById.KUname}`).then((result) => {
                console.log(result)
            }).catch((err) => {
                winston.error(err.message + ' this is error from cloudinary');
                return res.status(400).json({ error: " error in deleting font" })
            }).finally(() => {
                findById.remove();
            });


            return res.status(200).json({ message: "font deleted" })
        }
        return res.status(200).json()
    } catch (error) {
        winston.error(error.message + 'this error happen while deleting a font');
        return res.status(400).json({ error: error.message })

    }
}

export default DeleteFontById;