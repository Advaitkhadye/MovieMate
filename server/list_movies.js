
import mongoose from "mongoose";
import Show from "./models/Show.js";
import Movie from "./models/Movie.js";
import 'dotenv/config';
import connectDB from "./configs/db.js";

const listMovies = async () => {
    try {
        await connectDB();

        const validShowMovies = await Show.find({ showDateTime: { $gte: new Date() } }).distinct('movie');
        console.log(`Unique Movie IDs with Shows: ${validShowMovies.length}`);

        const movies = await Movie.find({ _id: { $in: validShowMovies } }).select('title');

        console.log("--- Available Movies ---");
        movies.forEach(m => console.log(m.title));
        console.log("------------------------");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

listMovies();
