import mongoose from 'mongoose';
import { Company } from './companies.js';
import { Item } from './item.js';

const invoiceSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.ObjectId,
        ref: Company
    },
    date: {
        type: Date,
        default: Date.now
    },
    item: [{
        ItemId: {
            type: mongoose.Schema.ObjectId,
            ref: Item
        },
        name: {
            type: String,
        },
        brand: {
            type: String,
        },
        price: {
            type: Number,
        },
        gst: {
            type: String,
        }
    }],
    subItems: [
        {
            subId: mongoose.Schema.ObjectId,
            quantity: Number,
            price: Number,
            model: String,
            size: String,
        }
    ],
    type: {
        type: String,
        enum: ["Sales", "Purchase"],
    },
    total: {
        type: Number
    }
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;