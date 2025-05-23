import { Router } from "express";
import { createInvoice, getAllInvoice, getInvoiceById, getSaleInvoice } from "../controllers/invoiceController.js";

export const invoiceRouter = Router();

invoiceRouter.get('/invoices',getAllInvoice)
invoiceRouter.post('/invoice',createInvoice)
invoiceRouter.get('/invoice/:id',getInvoiceById)
invoiceRouter.get('/invoices/sales',getSaleInvoice)