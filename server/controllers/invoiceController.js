import Invoice from "../models/invoice.js";
import { Item } from "../models/item.js";

const getAllInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("company");
        return res.status(200).json({
            invoices
        })
    }
    catch (err) {
        return res.status(500).json({
            message: err
        })
    }
}

const getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id).populate("company");
        if (!invoice) return res.status(404).json({ error: "Invoice not found" });
        res.json(invoice);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch invoice" });
    }
}

const createInvoice = async (req, res) => {
    try {
        const { companyId, date, item, subItems, type, total } = req.body;
        for (const subItem of subItems) {
            await Item.updateOne(
                { "subcategories._id": subItem.subId },
                { $inc: { "subcategories.$.quantity": -subItem.quantity } }
            );
        }

        const newInvoice = await Invoice.create({
            companyId, date, item, type, total, subItems
        });

        res.status(201).json({
            message: "Invoice Created Successfully",
            invoice: newInvoice
        })
    }
    catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).json({ message: "validation failed" })
        }
        else if (err.code === 1100) {
            return res.status(409).json({ message: "Duplicate entries found" })
        }
        else return res.status(500).json({ message: `Internal Server Error:${err.message}` })
    }
}

const updateInvoice = async (req, res) => {
    try {
        
    }
    catch (err) {

    }
}

const deleteInvoice = async (req, res) => {
    try {

    }
    catch (err) {

    }
}

const getSaleInvoice = async (req, res) => {
    try {
        const invoices = await Invoice.find({type:"Sales"}).populate("companyId").sort({date: -1});
        return res.status(200).json({ invoices })
    }
    catch (err) {
        return res.status(500).json({message:err})
    }
}

export { getAllInvoice, getSaleInvoice ,getInvoiceById, createInvoice, updateInvoice, deleteInvoice, }