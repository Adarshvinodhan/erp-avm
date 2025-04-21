import mongoose from 'mongoose';
import { Company } from './companies';
import { Item } from './item';

const invoiceSchema = new mongoose.Schema({
    company:{
        type:mongoose.Schema.ObjectId,
        ref:Company
    },
    date:{
        type:Date,
        default:Date.now
    },
    Item:{
        type:mongoose.Schema.ObjectId,
        ref:Item
    },
    type:{
        type:String,
        enum:["Sales","Purchase"],
    }
});

const Invoice = mongoose.model('Invoice',invoiceSchema);

export default Invoice;