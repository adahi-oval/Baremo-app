import { Router } from "express";
import { Publication } from "../models/Publication";

const meritRouter = Router();

// GETTERS

// GET /merit/:id
// Returns the info of a given merit
meritRouter.get("/merit/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ error: "Merit ID is required" });
        }

        const merit = await Publication.findById(id);

        if (!merit) {
            return res.status(404).json({ error: "Merit not found" });
        }

        res.status(200).json(merit);
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
})

// POSTS
// POST /merit
// Creates a new merit
meritRouter.post("/merit", async (req, res) => {
    try {
        const data = req.body.merit;
        const type = data.type as string;
        if (!type) {
            return res.status(400).json({ error: "Merit type is required" });
        }

        
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
        
    }
})

export default meritRouter;