import contactColection from "../db/models/Contact.js";


export const getContacts = () => contactColection.find();

export const getContact = id => contactColection.findById(id);

export const addContact = payload => contactColection.create(payload);

export const updateContact = async ({ _id, payload, options={} }) => {
    const rawResult = await contactColection.findOneAndUpdate({ _id }, payload, {
        ...options,
        new: true,
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