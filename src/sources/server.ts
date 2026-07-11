// This file contains the logic about our server

import express, { Application } from "express";
import { GlobalErrorHandler } from "modules/middlewares/global-error-handler.middleware";
import morgan from "morgan";
import router from "sources/routes";

const app: Application = express();

// Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan("dev")); // Log HTTP requests to the console

app.use("/api/v1", router); // Use the router for all routes starting with /api/v1

// 404 Handler:
// todo: add more details about uri.
app.use(function (_, res) {
    res.status(404).json({
        status: "success",
        message: "Sorry, your request has not been processed successfully.",
    });
});

// Global Error Handler. It always has to be at the end.
app.use(GlobalErrorHandler);

export default app;
