import User from "../../../model/UserSchema.js";
import UsersValidation from "./usersValidation.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cloudinary from "cloudinary";
import winston from "winston";
import RoleVali from "./roleValidation.js";
const userRegister = async (req, res) => {
    const { username, password, email, name, phoneNumber, role } = req.body;
    const userId = req.headers.authorization;

    try {
        try {
            await UsersValidation.validateAsync({ username, password, email, name, phoneNumber, role });

        } catch (error) {
            winston.error(error.message + " in add admin validate");
            return res.status(400).json({ error: error.message });
        }
        jwt.verify(userId, process.env.PRV_KEY, (err, decoded) => {
            if (err) {
                winston.error(err.message + " in add admin token verifying");
                return res.status(401).json({ error: err.message });
            }
            User.findById(decoded.id).then(async (decodedUsr) => {
                if (decodedUsr.role === "admin" || decodedUsr.role === "dev") {
                    const salt = await bcrypt.genSalt(14);
                    const passwordEncrypt = bcrypt.hashSync(password, salt);
                    if (req.file) {

                        const uplodedImg = await cloudinary.v2.uploader.upload(req.file.path, {
                            allowed_formats: ["jpg", "png", "jpeg", "webp", "HEIC", "AVIF"],
                            quality: 40,
                            folder: "ArkanBack-profile-image",
                            public_id: username,
                            faces: true,
                            overwrite: true,
                            transformation: [{
                                width: 300,
                                crop: "fit",
                            }],

                        })
                        var imgURL = uplodedImg.secure_url;
                    }
                    const createUser = await new User({
                        username,
                        password: passwordEncrypt,
                        email,
                        name,
                        phoneNumber,
                        image: imgURL,
                        role,

                    });
                    await createUser.save();
                    winston.info(`${username} has been created by ${decodedUsr.username}`);
                    return res.status(201).json({ message: "You have registerd successfully" });
                } else {
                    winston.error(`${decodedUsr.username} is not an admin to create user`);
                    return res.status(400).json({ error: "Only admin or dev can create users" });
                }
            }).catch((err) => {
                winston.error(err.message + " in add admin user creation");
                if (err.message.includes("duplicate key error")) {
                    winston.error(`${decodedUsr?.username} try to create user with ${username} but this user already exists`);
                    return res.status(500).json({ error: 'This user allready exist try another username' });

                }
            });
        });


    } catch (error) {

        winston.error(error.message + " in add admin user creation");
        if (error.message.includes("duplicate key error")) {
            return res.status(400).json({ error: 'username allready exists' });
        } else {
            return res.status(400).json({ error: error.message });
        }

    }


}

const userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne().where('username').equals(username);
        if (!user) {
            winston.error(`someone with IP ( ${req.ip} ) tried login with ${username} but no Data found `);
            return res.status(400).json({ error: "User not found" });
        }
        const token = jwt.sign(
            {
                id: user._id,
            }
            , process.env.PRV_KEY, {
            algorithm: "HS512",

            // expiresIn: "1h"
        })
        bcrypt.compare(password, user.password, (err, result) => {

            if (result) {
                console.log(username + 'is logged in');
                winston.info(`${username} has been logged in by IP ${req.ip}`);
                res.setHeader('authorization', token);

                return res.status(200).json(token);
            } else {
                return [
                    res.status(400).json({ error: username + " not found" }),
                    winston.error(`trying login as ${username} but no Data found`)
                ]
            }

        });



    } catch (error) {
        console.log(error.message);
        winston.error(error.message + " in login user");
        return res.status(400).json({ error: error });

    }
}


const getUserData = async (req, res) => {
    const userId = req.headers.authorization;
    try {
        jwt.verify(userId, process.env.PRV_KEY, (err, decoded) => {
            if (err) {
                winston.error(err.message);
                return res.status(401).json({ error: err.message });
            }
            User.findById(decoded.id).then(async (decodedUsr) => {
                if (decodedUsr.role === "admin" || decodedUsr.role === "dev") {
                    await User.find().then(async (usr) => {
                        const users = usr.filter(user => user.role !== "dev");
                        return res.status(200).json(users);
                    })
                }
            }).catch((err) => {
                winston.error(err.message + " in get user data");
                return res.status(500).json({ error: err.message });
            }
            );
        }
        );


    } catch (error) {
        winston.error(error.message + " in get user data");
        return res.status(400).json({ error: error.message })

    }

}
const editUserRole = async (req, res) => {
    const userId = req.headers.authorization;
    const { userIdForRole, role } = req.body;
    try {
        try {
            await RoleVali.validateAsync({ role });

        } catch (error) {
            winston.error(error.message + " in edit user role validate");
            return res.status(400).json({ error: error.message });
        }
        jwt.verify(userId, process.env.PRV_KEY, (err, decoded) => {
            if (err) {
                winston.error(err.message);
                return res.status(400).json({ error: "invalid token" })
            }
            User.findByIdAndUpdate(decoded.id).then(async (decodedUsr) => {
                console.log(decodedUsr.username);
                if (decodedUsr.role === 'admin' || decodedUsr.role === 'dev') {
                    User.findById(userIdForRole).then(async (user) => {
                        if (user.role !== 'dev') {

                            user.role = role;
                            await user.save();
                            winston.info(`${user.username} role has been changed to ${role} by ${decodedUsr.username}`);
                            return res.status(200).json({ message: "user role has been changed" });
                        } else {
                            winston.error(`${user.username} is a dev user can not be edit  ${decodedUsr.username} is trying to edit his role`);
                            return res.status(400).json({ error: "user is a dev user can not be edited" });
                        }
                    }).catch(err => {
                        winston.error(err.message + " in edit user role");
                        return res.status(404).json({ error: 'user id not found' })
                    })
                } else {
                    winston.error(`${decodedUsr.username} is not an admin to edit user role`);
                    return res.status(400).json({ error: "Only admin can edit roles" })

                }
            }).catch(err => {
                winston.error(err.message + " in edit user role");
                return res.status(404).json({ error: 'user id not found' })
            })

        })

    } catch (error) {
        winston.error(error.message + " in edit user role");
        return res.status(400).json({ error: error.message })

    }

}

const getMyProfile = async (req, res) => {
    const userId = req.headers.authorization;
    try {
        jwt.verify(userId, process.env.PRV_KEY, (err, decoded) => {
            if (err) {
                winston.error(err.message);
                return res.status(400).json({ error: "invalid token" })
            }
            User.findById(decoded.id).then(async (user) => {
                if (user) {
                    return res.status(200).json({
                        username: user.username,
                        email: user.email,
                        name: user.name,
                        phoneNumber: user.phoneNumber,
                        image: user.image,
                        role: user.role,
                        created_at: user.created_at,
                    });
                } else {
                    winston.error(`${user.username} not found`);
                    return res.status(400).json({ error: "user not found" });
                }
            }).catch(err => {
                winston.error(err);
                return res.status(404).json({ error: 'user id not found' })
            })

        })

    } catch (error) {
        winston.error(error.message);
        return res.status(500).json({ error: error.message })
    }
}

const deleteById = async (req, res) => {
    const userId = req.headers.authorization;
    const { userIdForDelete } = req.body;
    try {
        jwt.verify(userId, process.env.PRV_KEY, (err, decoded) => {
            if (err) {
                winston.error(err.message);
                return res.status(400).json({ error: "invalid token" })
            }
            User.findById(decoded.id).then(async (decodedUsr) => {
                if (decodedUsr.role === 'admin' || decodedUsr.role === 'dev') {
                    User.findById(userIdForDelete).then(async (user) => {
                        if (user.role !== 'dev') {
                            winston.info(`${user.username} has been deleted by ${decodedUsr.username}`);
                            await user.remove();
                            return res.status(200).json({ message: "user has been deleted" });
                        } else {
                            winston.error(`${user.username} is a dev user can not be deleted  ${decodedUsr.username} is trying to delete his Account`);
                            return res.status(400).json({ error: "user is a dev user can not be deleted" });
                        }
                    }).catch(err => {
                        winston.error(err);
                        return res.status(404).json({ error: 'user id not found' })
                    })
                } else {
                    return res.status(400).json({ error: "Only admin can delete users" })

                }
            }).catch(err => {
                winston.error(err);
                return res.status(404).json({ error: 'user id not found' })
            })

        })

    } catch (error) {
        winston.error(error.message);
        return res.status(500).json({ error: error.message })
    }
}



export default {
    userRegister,
    userLogin,
    getUserData,
    editUserRole,
    getMyProfile,
    deleteById,
};