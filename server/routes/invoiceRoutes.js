import { Router } from "express";
import { createInvoice, getAllInvoice } from "../controllers/invoiceController.js";

export const invoiceRouter = Router();

invoiceRouter.get('/invoices',getAllInvoice)
invoiceRouter.post('/invoice',createInvoice)