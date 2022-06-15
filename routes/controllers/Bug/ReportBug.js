import winston from 'winston';
import reportBugSchema from '../../../model/reportBugSchema.js';
import reportValidation from './reportValidation.js';

const ReportBug = async (req, res) => {
    const { title, message } = req.body;
    try {
        try {
            await reportValidation.validateAsync({ title, message });
        } catch (error) {
            winston.error(error.message);
            return res.status(400).json({ message: error.message });
        }
        const reportBug = new reportBugSchema({
            title,
            message,
        });
        await reportBug.save();
        winston.info(`reported a bug check the Report Bugs collection`);
        return res.status(200).json('Reported successfully');
    } catch (error) {
        winston.error(error.message + 'this error happen while reporting a bug');
        return res.status(500).json({ message: error.message });
    }
}

const getReportBugs = async (req, res) => {
    try {
        const reportBugs = await reportBugSchema.find({});
        return res.status(200).json(reportBugs);
    } catch (error) {
        winston.error(error.message + 'this error happen while getting all report bugs');
        return res.status(500).json({ message: 'Server error' });
    }
}

export default { ReportBug, getReportBugs };