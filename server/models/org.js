import mongoose from "mongoose";

const orgSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    gst: {
        type: String,
    },
    phone: {
        type: String,
    },
    address: {
        type: String,
    }
});

const Org = mongoose.model('Org', orgSchema);

export default Org; 