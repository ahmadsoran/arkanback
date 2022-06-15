import winston from "winston";
import LogErr from "../../../model/logs.js";
const getAllLogFromWinston = async (req, res) => {
    try {
        const logs = await LogErr.find()
        return res.status(200).json(logs);
    } catch (error) {
        winston.error(error.message);
        return res.status(400).json({ error: error.message });
    }
}

export default getAllLogFromWinston;