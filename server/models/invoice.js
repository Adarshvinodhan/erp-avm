import mongoose from 'mongoose';
import { Company } from './companies.js';
import { Item } from './item.js';

const invoiceSchema = new mongoose.Schema({
    company:{
        type:mongoose.Schema.ObjectId,
        ref:Company
    },
    date:{
        type:Date,
        default:Date.now
    },
    item:[{
        type:mongoose.Schema.ObjectId,
        ref:Item
      }],
    subItems:[
        {
            subId:mongoose.Schema.ObjectId,
            quantity:Number,
            price:Number
        }
    ],
    products:[String],
    type:{
        type:String,
        enum:["Sales","Purchase"],
    },
    total:{
        type:Number
    }
});

const Invoice = mongoose.model('Invoice',invoiceSchema);

export default Invoice;