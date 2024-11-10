import { Schema, model } from "mongoose";
import { typeList } from "../../constants/contacts.js";
import { handleSaveError, setUpdateSettings } from "./hooks.js";


const contactSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    isFavourite: {
        type: Boolean,
        required: true,
        default:false,
    },
    contactType: {
        type: String,
        required: true,
        enum:typeList,
        default: 'personal',
    },
}, {
    versionKey: false,
    timestamps: true,
});

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateSettings);

export const sortByList = ["name", "phoneNumber", "email"];


const contactColection = model('contact', contactSchema);


export default contactColection;