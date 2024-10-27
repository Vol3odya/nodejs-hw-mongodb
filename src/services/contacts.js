import contactColection from "../db/models/Contact.js";


export const getContacts = () => contactColection.find();

export const getContact = id => contactColection.findById(id);