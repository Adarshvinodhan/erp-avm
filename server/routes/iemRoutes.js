import { Router } from "express";
import { createItem, deleteItem, deleteSubcategory, getAllItems, updateItem, getItemById } from "../controllers/itemControllers.js";

const itemRouter = Router();

itemRouter.post('/item',createItem);
itemRouter.get('/items',getAllItems);
itemRouter.get('/item/:id',getItemById);
itemRouter.put('/item/:id',updateItem);
itemRouter.delete('/item/:id',deleteItem);
itemRouter.delete('/item/:id/sub/:subcategoryId',deleteSubcategory);

export default itemRouter;