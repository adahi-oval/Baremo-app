import { Router } from "express";
import { User } from "../models/User";
import { Award } from "../models/publications/Award";

const testRouter = Router();

testRouter.post("/user", async (req, res) => {
    try {
        let data = req.body.user;

        const user = new User(data);
        await user.save();

        res.status(201).json(user);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

testRouter.post("/publication", async (req, res) => {
    try {
        const type = req.query.type as string;

        if (!type) {
            return res.status(400).json({ error: "Publication type is required" });
        }

        let publication;
        let data = req.body.publication;

        if (type === "award") {
            publication = new Award(data);
        } else {
            return res.status(400).json({ error: `Invalid publication type: ${type}` });
        }

        await publication.save();
        res.status(201).json(publication);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

export default testRouter;