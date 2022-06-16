import VisitsSchema from "../../../model/VisitsSchema.js";
const Visitors = async (req, res) => {
    const { location } = req.query;
    try {

        if (location) {
            const visitors = await VisitsSchema.find({ location });
            // if the location is not found, then create a new one and save it

            if (visitors.length === 0) {
                const newVisitor = new VisitsSchema({
                    visits: 1,
                    location,
                    IPAddress: req.ip,
                });
                await newVisitor.save();
            } else {
                const visitor = visitors[0];
                visitor.visits += 1;
                visitor.IPAddress = req.ip;
                await visitor.save();
            }

            return res.status(200).json('done');
        }
        return res.status(400).json({ message: 'Bad request' });
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }

}

const getVisitors = async (req, res) => {
    try {
        const visitors = await VisitsSchema.find({});

        return res.status(200).json(visitors);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Server error' });
    }
}


export default { Visitors, getVisitors };