import fontsDatas from "../../../model/Downloads.js";
import jwt from "jsonwebtoken";
import winston from "winston";
import cloudinary from "cloudinary";
import User from "../../../model/UserSchema.js";
import fs from "fs";
const UploadFont = async (req, res) => {
    const userId = req.headers.authorization;
    const { KUname, ENname, testText, category } = req.body;
    if (!req.files[0]) {
        console.log('no file');
        return res.status(400).json({ error: "no file attached" })
    }
    const files = req.files;
    // fileName.split('.').shift();
    console.log(category)

    try {
        jwt.verify(userId, process.env.PRV_KEY, (err, decoded) => {
            if (err) {
                winston.error(err);
                return res.status(400).json({ error: "invalid token" })
            }
            User.findById(decoded.id).then(async (decodedUsr) => {
                if (decodedUsr.role === 'admin' || decodedUsr.role === 'moderator' || decodedUsr.role === 'dev') {
                    const regularFontFile = files.filter(file => file.fieldname === 'regular')[0]?.originalname;
                    if (!regularFontFile) {
                        winston.error(`${decodedUsr?.username} tried to upload font file without attach regular font file `);
                        return res.status(400).json({ error: "Please attach regular font file " })
                    }




                    const uploader = async (path, name) => await cloudinary.v2.uploader.upload(path, {
                        resource_type: 'raw',
                        folder: `fonts/${ENname}|${KUname}`,
                        overwrite: true,
                        use_filename: true,
                        public_id: name,
                    });

                    if (req.method === 'POST') {
                        const urls = []
                        for (const file of files) {
                            const { path, originalname } = file;
                            /// remove numbers and special characters from file name
                            const fileName = originalname.replace(/[^a-zA-Z-.]/g, '')
                            const newPath = await uploader(path, fileName);
                            /// remove spically characters from file name
                            urls.push({
                                name: originalname.split('.').shift(),
                                url: newPath.secure_url,
                                fieldname: file.fieldname,
                                size: file.size,

                            })
                            fs.unlinkSync(path)
                        }
                        const stylesFontFiles = urls.filter(file => file.fieldname === 'styles')
                        const regularFontsFile = urls.filter(file => file.fieldname === 'regular')[0]
                        const compressAllFileSizes = urls.map(file => file.size).reduce((acc, curr) => acc + curr)
                        const turnFileSizeToMB = (compressAllFileSizes / 1024 / 1024).toFixed(2)


                        if (decodedUsr.role !== 'dev') {
                            var uploadby = {
                                username: decodedUsr.username,
                                image: decodedUsr.image,
                                role: decodedUsr.role,
                                id: decodedUsr._id,
                            }
                        }
                        const categoryies = []
                        category?.forEach(cat => {
                            categoryies.push(cat)
                        })

                        const fontsData = new fontsDatas({
                            name: {
                                kurdish: KUname,
                                english: ENname,
                                filename: regularFontFile.split('.').shift()
                            },
                            testText,
                            regular: regularFontsFile.url,
                            styles: stylesFontFiles,
                            uploader: uploadby,
                            fileSize: `${turnFileSizeToMB} MB`,
                            category: categoryies


                        })
                        fontsData.save().then(() => {
                            winston.info(`${decodedUsr?.username} uploaded ${regularFontsFile?.name} font`);
                            return res.status(200).json({ message: `${regularFontsFile?.name} uploaded to server successfully` })
                        }
                        ).catch(err => {
                            winston.error(err.message);
                            return res.status(400).json({ error: err.message })
                        })

                    }

                } else {
                    winston.error(`${decodedUsr?.username} tried to upload font file without admin or moderator role`);
                    return res.status(400).json({ error: "you are not allowed to upload font" })
                }
            }).catch(err => {
                winston.error(err.message + 'this error happen while uploading a font');
                return res.status(400).json({ error: err.message })
            })
        })

    } catch (error) {
        winston.error(error.message);
        return res.status(400).json({ error: error.message })
    }

}

export default UploadFont;