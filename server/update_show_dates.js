
import mongoose from "mongoose";
import Show from "./models/Show.js";
import 'dotenv/config';
import connectDB from "./configs/db.js";

const updateShows = async () => {
    try {
        await connectDB();

        // Update all shows by adding 30 days to their current time
        // This ensures preserved time-of-day but moves them to the future
        const shows = await Show.find({});
        console.log(`Found ${shows.length} shows to update.`);

        const dayInMillis = 24 * 60 * 60 * 1000;
        const offset = 30 * dayInMillis; // Shift forward by 30 days

        let updatedCount = 0;
        const operations = shows.map(show => {
            const oldDate = new Date(show.showDateTime);
            const newDate = new Date(oldDate.getTime() + offset);

            return {
                updateOne: {
                    filter: { _id: show._id },
                    update: { $set: { showDateTime: newDate } }
                }
            };
        });

        if (operations.length > 0) {
            const result = await Show.bulkWrite(operations);
            console.log(`Updated ${result.modifiedCount} shows.`);
        }

        const futureShows = await Show.countDocuments({ showDateTime: { $gte: new Date() } });
        console.log(`Future Shows Now: ${futureShows}`);

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

updateShows();
