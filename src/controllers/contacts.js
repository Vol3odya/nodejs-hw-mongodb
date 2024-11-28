import createHttpError from "http-errors";


import * as contactServises from "../services/contacts.js";

import { contactAddSchema } from "../validation/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parse } from "dotenv";
import { parseSortParams } from "../utils/parseSortParams.js";
import { sortByList } from "../db/models/Contact.js";
import { parseContactFilter } from "../utils/parseContactFilter.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';


export const getContactsControllers = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);
    const filter = parseContactFilter(req.query);
    const { _id: userId } = req.user;
    filter.userId = userId;
    const data = await contactServises.getContacts({ page, perPage, sortBy, sortOrder, filter});
    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data,
    });
}

export const getContactByIdControllers = async (req, res) => {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServises.getContact(contactId, userId);
    if (!data) {
        throw createHttpError(404, 'Contact not found');
            //const error = new Error('Contact not found');
            //error.status = 404;
            //throw error;
        //return res.status(404).json({
            //message: 'Contact not found',
        //});
    }
    res.json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data,
    });
}

export const addContactControllers = async (req, res) => {
    const { _id: userId } = req.user;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === "true") {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
        photoUrl = await saveFileToUploadDir(photo);
        }
    }
    const data = await contactServises.addContact({...req.body, userId, photo:photoUrl});
    res.status(201).json({
        staus: 201,
        message: "Successfully created a contact!",
        data
    });
};

export const upsertContactControllers = async (req, res) => {
    const { contactId: _id } = req.params;
    const { _id: userId } = req.user;
    const result = await contactServises.updateContact({
        _id, userId, payload: req.body, options: {
        upsert: true
        }
    });
    const status = result.isNew ? 201 : 200;
    res.status(status).json({
        status,
        message: "Contact upserted.",
        data: result.data,
    });
};

export const patchContactControllers = async (req, res) => {
    const { contactId: _id } = req.params;
    const { _id: userId } = req.user;
    const photo = req.file;
    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === "true") {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
        photoUrl = await saveFileToUploadDir(photo);
        }
    }
    const result = await contactServises.updateContact({
        _id, userId, payload: {
            ...req.body,
            photo: photoUrl
        }
    });
    if (!result) {
        throw createHttpError(404, "Contact not found");
    }
    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: result.data,
    });
};

export const deleteContactControllers = async (req, res) => {
    const { contactId: _id } = req.params;
    const { _id: userId } = req.user;
    const data = await contactServises.deleteContact({ _id, userId });
    if (!data) {
        throw createHttpError(404, "Contact not found");
    }
    res.status(204).send();
}