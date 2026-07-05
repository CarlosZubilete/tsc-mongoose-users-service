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

// Global Error Handler. It always has to be at the end.
app.use(GlobalErrorHandler);


export default app;
