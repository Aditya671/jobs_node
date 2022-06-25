import express from "express";
import JobController from "../controller/jobController.js";

const jobRouter = express.Router();
const jobController = new JobController()

jobRouter.get("/jobs", () => jobController.getAllJob());

jobRouter.post("/create",() => jobController.create());

jobRouter.delete("/delete/:id",() => jobController.delete());

jobRouter.patch("/update",() => jobController.updateJob());

jobRouter.get("/status/:id",() => jobController.showStatus());

export default jobRouter;