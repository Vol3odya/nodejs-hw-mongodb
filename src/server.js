import express from "express";
import cors from "cors";
import { env } from "./utils/env.js";
import contactsRouter from "./routers/contacts.js";
import { notFoundHendler } from "./middlewares/notFoundHendler.js";
import { errorHendler } from "./middlewares/errorHendler.js";
import { logger } from "./middlewares/legger.js";

//Vol_odya_Node
//qwerty12345678


export const setupServer = () => {
    const app = express();
    app.use(cors());

    app.use(express.json());

    //app.use(logger);
    
    app.use("/contacts", contactsRouter);

    app.use(notFoundHendler);
    
    app.use(errorHendler);

    const port = Number(env("PORT", 3000));

    app.listen(port, () => console.log(`Server is running on port ${port}`));
};