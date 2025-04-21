import { Company } from "../models/companies";
import Invoice from "../models/invoice";
import { Item } from "../models/item";

const getAllInvoice = async (req,res)=>{
    try{

    }
    catch(err){

    }
}

const getInvoiceById = async (req,res)=>{
    try{

    }
    catch(err){

    }
}

const createInvoice = async (req, res) => {
    try{
        const newInvoice = await Invoice.create(req.body);
        res.status(201).json({message:"Invoice Created Successfully",
            invoice:newInvoice
        })
    }
    catch(err){
        if(err.name === "ValidationError"){
            return res.status(400).json({message:"validation failed"})
        }
        else if(err.code === 1100){
            return res.status(409).json({message:"Duplicate entries found"})
        }
        else return res.status(500).json({message:`Internal Server Error:${err.message}`})
    }
}

const updateInvoice = async(req,res)=>{
    try{

    }
    catch(err){

    }
}

const deleteInvoice = async(req,res)=>{
    try{

    }
    catch(err){

    }
}

export {getAllInvoice,getInvoiceById,createInvoice,updateInvoice,deleteInvoice,}