import winston from "winston";
import fontsDatas from "../../../model/Downloads.js";

const GetFonts = async (req, res) => {
    const { sort, category } = req.query
    console.log(sort + ' ' + category)
    console.log(req.query)
    try {
        var fonts = await fontsDatas.find()

        if (category !== 'all' && category !== 'undefined' && category !== 'null' && category !== '') {

            fonts = fonts.filter(font => font?.category.includes(category))

        }
        if (sort === 'new') {
            fonts.reverse()

        } else if (sort === 'old') {
        } else if (sort === 'popular') {
            fonts.sort((a, b) => b.DownloadedTimes - a.DownloadedTimes)
        } else if (sort === 'A_Z') {
            fonts.sort((a, b) => {
                return a.name.english.localeCompare(b.name.english)
            })

        } else if (sort === 'Z_A') {
            fonts.sort((a, b) => {
                if (a.name.english > b.name.english) {
                    return -1
                }

            })

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