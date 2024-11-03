import { Schema, model } from "mongoose";


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
        enum:["work","home","personal"],
        default: 'personal',
    },
}, {
    versionKey: false,
    timestamps: true,
});



const contactColection = model('contact', contactSchema);


export default contactColection;