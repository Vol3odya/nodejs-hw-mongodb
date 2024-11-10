import Joi from "joi";
import { typeList } from "../constants/contacts.js";



export const contactAddSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        "any.required": "Потрібно вказати ім'я."
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        "any.required": "Потрібно вказати номер телефону."
    }),
    email: Joi.string().min(3).max(20),
    isFavourite: Joi.boolean().valid(true, false),
    contactType:Joi.string().valid(...typeList),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20),
    //isFavourite: Joi.boolean().valid(true, false),
    //contactType:Joi.string().valid(...typeList),
});