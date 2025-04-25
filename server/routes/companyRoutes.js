import { Router } from "express";
import { createCompany, deleteCompany, getAllCompanies, updateCompany } from "../controllers/companyControllers.js";

export const companyRouter = Router();

companyRouter.get('/companies',getAllCompanies)
companyRouter.post('/companies',createCompany)
companyRouter.put('/companies/:id',updateCompany)
companyRouter.delete('/companies/:id',deleteCompany)

