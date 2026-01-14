import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        console.log(`Connecting to DB: ${uri}`);
        await mongoose.connect(uri);
    } catch (error) {
        console.log(error.message);

    }
}

export default connectDB;