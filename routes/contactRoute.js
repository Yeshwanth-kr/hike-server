import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  getAllContacts,
  getContactForDMList,
  searchContact,
} from "../controllers/contactController.js";

const contactRoute = Router();

contactRoute.post("/search", verifyToken, searchContact);
contactRoute.get("/getcontactsfordm", verifyToken, getContactForDMList);
contactRoute.get("/getallcontacts", verifyToken, getAllContacts);

export default contactRoute;
