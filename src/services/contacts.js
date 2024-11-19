import contactColection from "../db/models/Contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";


export const getContacts = async ({ page = 1, perPage = 10, sortBy = "_id", sortOrder = "asc", filter={} }) => { 
    const skip = (page - 1) * perPage;
    const query = contactColection.find().skip(skip).sort({ [sortBy]: sortOrder });
    if (filter.parsedIsFavorite=="true") {
        query.where("isFavourite").equals("true");
    }
    if (filter.parsedIsFavorite=="false") {
        query.where("isFavourite").equals("false");
    }
    if (filter.parsedTypeContact) {
        query.where("contactType").equals(filter.parsedTypeContact);
    }
    if (filter.userId) {
        query.where("userId").equals(filter.userId);
    }
    
    const totalItems = await contactColection.find().merge(query).countDocuments();
    const data = await query.limit(perPage);
    const paginationData = calculatePaginationData({ totalItems, page, perPage });
    return {
        data,
        ...paginationData,
    };
};

export const getContact = (id, userId) => {
    const query = contactColection.findById(id);
    if (userId) {
        query.where("userId").equals(userId);
    }
    return query;
};

export const addContact = payload => contactColection.create(payload);

export const updateContact = async ({ _id, userId, payload, options={} }) => {
    const rawResult = await contactColection.findOneAndUpdate({ _id, userId }, payload, {
        ...options,
        includeResultMetadata: true,
    });
    if (!rawResult || !rawResult.value) {
        return null;
    }
    return {
        data: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted),
    };
};

export const deleteContact = async filter => contactColection.findOneAndDelete(filter);