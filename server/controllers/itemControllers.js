import { Item } from "../models/item.js";

export const createItem = async (req, res) => {
    try {
        const { name, price, brand, subcategories, gst } = req.body;
        const item = new Item({
            name,
            price,
            brand,
            subcategories,
            gst,
        });
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating item" });
    }
};

export const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching items" });
    }
};

export const getItemById = async (req, res) => {
    try {
        const id = req.params.id;
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json(item);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching item" });
    }
};  

export const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, gst, subcategories, brand } = req.body;
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        item.name = name;
        item.brand = brand;
        item.price = price;
        item.gst = gst;
        item.subcategories = subcategories;
        const updatedItem = await item.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating item" });
    }
};  

export const deleteItem = async (req, res) => {
    try {
        const id  = req.params.id;
        const item = await Item.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting item" });
    }
};

export const deleteSubcategory = async (req, res) => {
    try {
        const { id, subcategoryId } = req.params;
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        item.subcategories.pull(subcategoryId);
        const updatedItem = await item.save();
        res.status(200).json(updatedItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting subcategory" });
    }
};



