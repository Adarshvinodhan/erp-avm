import mongoose from 'mongoose';

export default function connectDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err));
}