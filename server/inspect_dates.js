
import mongoose from "mongoose";
import Show from "./models/Show.js";
import 'dotenv/config';
import connectDB from "./configs/db.js";

const inspectShows = async () => {
    try {
        await connectDB();
        const count = await Show.countDocuments();
        console.log(`Total Shows: ${count}`);

        const pastShows = await Show.countDocuments({ showDateTime: { $lt: new Date() } });
        console.log(`Past Shows: ${pastShows}`);

        const futureShows = await Show.countDocuments({ showDateTime: { $gte: new Date() } });
        console.log(`Future Shows: ${futureShows}`);

        if (count > 0) {
            const sample = await Show.findOne();
            console.log("Sample Show Date:", sample.showDateTime);
            console.log("Current Date:", new Date());
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

inspectShows();
