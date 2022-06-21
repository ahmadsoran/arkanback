import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";

const Editfonts = async (req, res) => {
    const { fontId, KUname, ENname, description } = req.body;
    try {
        const findById = await fontsDatas.findById(fontId);
        // const UpdateCategory = []
        // if (!Array.isArray(category)) {
        //     UpdateCategory.push(category)
        // } else {
        //     category.map(cat => {
        //         UpdateCategory.push(cat)
        //     })
        // }
        if (findById) {
            await fontsDatas.findByIdAndUpdate(fontId, {
                name: {
                    kurdish: KUname,
                    english: ENname
                },
                // category: UpdateCategory,
                testText: description
            });
            return res.status(200).json({ message: `font updated successfully` })
        }
        return res.status(400).json({ error: `font not found` })


    } catch (error) {
        winston.error(error.message + ' this error happen while editing a font');
        return res.status(400).json({ error: error.message })

    }
}
export default Editfonts
