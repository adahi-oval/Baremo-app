import { Router } from "express";
import { IPublication, Publication } from "../models/Publication";
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

// GET /merits/status/complete
// Devuelve los meritos con el flag de completos
meritRouter.get("/merits/status/complete", async (req, res) => {
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

// GET /merits/status/incomplete
// Gets all incomplete merits (flag set to false)
meritRouter.get("/merits/status/incomplete", async (req, res) => {
    try {
        const incompleteMerits = await Publication.find({ complete: false });

        if (!incompleteMerits || incompleteMerits.length === 0) {
            return res.status(404).json({ error: "No incomplete merits found" });
        }

        res.status(200).json({ merits: incompleteMerits });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// GET /merits/:researcherId
// Devuelve todos los méritos de un invest. concreto por Id
meritRouter.get("/merits/:researcherId", async (req, res) => {
    try {
        const researcherId = parseInt(req.params.researcherId as string);

        if (!researcherId) {
            return res.status(400).json({ error: "Researcher ID required." });
        }

        const meritsOfResearcher = await Publication.findAllMeritsByResearcherId(researcherId);

        res.status(200).json({ merits: meritsOfResearcher });

    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// GET /merits/:researcherId/complete
// Devuelve todos los méritos COMPLETOS de un invest. concreto por Id 
meritRouter.get("/merits/:researcherId/complete", async (req, res) => {
    try {
        const researcherId = parseInt(req.params.researcherId as string);

        if (!researcherId) {
            return res.status(400).json({ error: "Researcher ID required." });
        }

        const completeMeritsOfResearcher = await Publication.findCompleteMeritsByResearcherId(researcherId);

        res.status(200).json({ merits: completeMeritsOfResearcher });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// GET /merits/:researcherId/incomplete
// Devuelve todos los méritos INCOMPLETOS de un invest. concreto por Id 
meritRouter.get("/merits/:researcherId/incomplete", async (req, res) => {
    try {
        const researcherId = parseInt(req.params.researcherId as string);

        if (!researcherId) {
            return res.status(400).json({ error: "Researcher ID required." });
        }

        const incompleteMeritsOfResearcher = await Publication.findIncompleteMeritsByResearcherId(researcherId);

        res.status(200).json({ merits: incompleteMeritsOfResearcher });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// POSTS

// POST /merits
// Crea un nuevo merito
meritRouter.post("/merits", async (req, res) => {
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