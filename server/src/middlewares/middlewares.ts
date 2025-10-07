// middlewares.ts
import { RequestHandler } from "express";

export const middleware: RequestHandler = (req, res) => {
  res.send("Hello Workflow!");
  console.log("Response sent");
};
