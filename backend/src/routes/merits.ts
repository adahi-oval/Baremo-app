import { Router } from "express";
import { Publication } from "../models/Publication";
import { meritCreator } from "../services/meritCreator";

const meritRouter = Router();

// GETTERS

// GET /merit/:id
// Devuelve la info de un merito concreto
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
});

// GET /merit/complete
// Devuelve los meritos con el flag de completos
meritRouter.get("/merit/status/complete", async (req, res) => {
    try {
        const completeMerits = await Publication.find({ complete: true });

        if (!completeMerits || completeMerits.length === 0) {
            return res.status(404).json({ error: "No complete merits found" });
        }

        res.status(200).json({ merits: completeMerits })

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// POSTS

// POST /merit
// Crea un nuevo merito
meritRouter.post("/merit", async (req, res) => {
    try {
        const data = req.body.merit;
        const type = data.type as string;
        if (!type) {
            return res.status(400).json({ error: "Merit type is required" });
        }

        const created = await meritCreator(data);

        if (created === true) {
            res.status(201).json({ message: `${type} created succesfully` })
        } else if (created === false) {
            res.status(201).json({ message: `${type} created with missing types` })
        } else {
            res.status(400).json({ message: `${type} failed to be created` })
        }

    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

export default meritRouter;