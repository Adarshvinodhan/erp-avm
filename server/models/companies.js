import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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

export const Company = mongoose.model('Company', companySchema);
