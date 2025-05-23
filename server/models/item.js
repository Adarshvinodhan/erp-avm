import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    color: {
        type: String
    },
    quantity: {
        type: Number
    },
    model: {
        type: String
    },
    size: {
        type: String
    },
    price: {
        type: Number
    },
    img:{
        type:String
    }
});

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
    },
    price: {
        type: Number,
    },
    gst: {
        type: String,
    },
    subcategories: {
        type: [subCategorySchema],
    },


});

export const Item = mongoose.model('Item', itemSchema);