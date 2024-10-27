import express from "express";
import cors from "cors";
import pino from "pino-http";
import { env } from "./utils/env.js";
import * as contactServises from "./services/contacts.js";

//Vol_odya_Node
//qwerty12345678


export const setupServer = () => {
    const app = express();
    app.use(cors());
    const logger = pino({
        transport: {
            target: "pino-pretty",
        }
    })
    //app.use(logger);
    app.get("/contacts", async (req, res) => {
        const data = await contactServises.getContacts();
        res.json({
            status: 200,
            message: "Successfully found contacts!",
            data,
        });
    });

    app.get("/contacts/:contactId", async (req, res) => {
        const { contactId } = req.params;
        const data = await contactServises.getContact(contactId);
        if (!data) {
            return res.status(404).json({
                message: 'Contact not found',
            });
        }
        res.json({
            status: 200,
            message: `Successfully found contact with id ${contactId}!`,
            data,
        });
    });
    
    app.use((req, res) => {
        res.status(404).json({
            message: `${res.url} not found`,
        })
    });
    
    app.use((error, req, res, next) => {
        res.status(500).json({
            message: error.message,
        })
    });

    const port = Number(env("PORT", 3000));

    app.listen(port, () => console.log(`Server is running on port ${port}`));
};