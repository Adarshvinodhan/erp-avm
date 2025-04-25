import { Company } from "../models/companies.js";

const getAllCompanies = async(req,res)=>{
    try{
        const companies = await Company.find();
        return res.status(200).json({
            companies:companies
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error"
        })
    }
}

const getCompanyById = async (req, res) => {
    try {
      const company = await Company.findById(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company" });
    }
  };
  
  // Create new company
  const createCompany = async (req, res) => {
    try {
      const company = new Company(req.body);
      await company.save();
      res.status(201).json(company);
    } catch (error) {
      res.status(400).json({ message: "Failed to create company" });
    }
  };
  
  // Update existing company
  const updateCompany = async (req, res) => {
    try {
      const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json(company);
    } catch (error) {
      res.status(400).json({ message: "Failed to update company" });
    }
  };
  
  // Delete a company
  const deleteCompany = async (req, res) => {
    try {
      const company = await Company.findByIdAndDelete(req.params.id);
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.json({ message: "Company deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete company" });
    }
  };
  

export {getAllCompanies,getCompanyById,deleteCompany,updateCompany,createCompany}