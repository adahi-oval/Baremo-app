import { MeritQuerySchema, ResearcherMeritQuerySchema } from "../validators/merits";
import { z } from "zod";
import { Router } from "express";
import { IPublication, Publication } from "../models/Publication";
import { meritCreator } from "../services/meritCreator";
import { User } from "../models/User";
import { scoreCalculator } from "../services/scoreCalculator";


interface MeritQueryParams {
  id?: string;
  status?: 'complete' | 'incomplete';
  year?: string;
}


const meritRouter = Router();

// GETTERS

// GET /merits
// Handles all merits, optionally by ID or status

meritRouter.get("/merits", async (req, res) => {
  try {
    const parseResult = MeritQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }

    const { status, year } = parseResult.data;
    const query: any = {};

    if (status) query.complete = status === "complete";
    if (year) query.year = parseInt(year);

    const merits = await Publication.find(query);

    if (!merits || merits.length === 0) {
      return res.status(404).json({ error: "No merits found" });
    }

    res.status(200).json({ merits });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});


// GET /merits/researcher/:researcherId
// Handles merits for a specific researcher with optional status filtering
meritRouter.get("/merits/:researcherId", async (req, res) => {
  try {
    const researcherId = parseInt(req.params.researcherId as string);
    if (isNaN(researcherId)) {
      return res.status(400).json({ error: "Invalid researcher ID" });
    }

    const user: string = await User.findIdByResearcherId(researcherId) as string;

    const parseResult = ResearcherMeritQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ error: parseResult.error.errors });
    }

    const { status, year } = parseResult.data;

    const baseQuery: any = { user };

    if (status) baseQuery.complete = status === "complete";
    if (year) baseQuery.year = parseInt(year);

    const merits = await Publication.find(baseQuery);

    if (!merits || merits.length === 0) {
      return res.status(404).json({ error: "No merits found for this researcher" });
    }

    res.status(200).json({ merits });
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown error" });
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

// PUTS

// PUT /merits/:id
// Actualiza un mérito por id
meritRouter.put("/merits/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const merit = await Publication.findById(id).populate('user');
        if (!merit) return res.status(404).json({ error: "Merit not found" });

        Object.assign(merit, updates);

        const reScored = scoreCalculator(merit);

        const updated = await merit.save();

        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});
  


export default meritRouter;