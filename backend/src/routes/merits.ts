import { MeritQuerySchema, ResearcherMeritQuerySchema } from "../validators/merits";
import { z } from "zod";
import { Router } from "express";
import { IPublication, Publication } from "../models/Publication";
import { meritCreator } from "../services/meritCreator";
import { User } from "../models/User";
import { scoreCalculator } from "../services/scoreCalculator";

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

    const merits = await Publication.find(query).populate("user", "-password -createdAt -updatedAt -__v -_id");

    if (!merits || merits.length === 0) {
      return res.status(404).json({ error: "No merits found" });
    }

    res.status(200).json({ merits });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// GET /merit/:meritId
// Gets a specific merit by id
meritRouter.get("/merit/:meritId", async (req, res) => {
  try {
    const meritId = req.params.meritId as string;
    if (!meritId) {
      return res.status(400).json({ error: "meritId not provided" });
    }

    const merit = await Publication.findById(meritId).populate("user", "-password -createdAt -updatedAt -__v -_id");

    if (!merit) {
      return res.status(404).json({ error: "No merit found" });
    }

    res.status(200).json({ merit });

  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
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

    const merits = await Publication.find(baseQuery).populate("user", "-password -createdAt -updatedAt -__v -_id");

    if (!merits || merits.length === 0) {
      return res.status(404).json({ error: "No merits found for this researcher" });
    }

    res.status(200).json({ merits: merits });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// POSTS

// POST /merits
// Crea un nuevo merito
meritRouter.post("/merits", async (req, res) => {
  try {
    const data = req.body.merit;
    const type = data.pubType as string;

    if (!type) {
      return res.status(400).json({ error: "Merit type is required" });
    }

    const created = await meritCreator(data);
    if (!created) { return res.status(500).json({ error: "Error creating the merit. "})}

    if (created.complete === true) {
      res.status(201).json({ message: `${type} created succesfully`, id: created._id.toString() })
    } else if (created.complete === false) {
      res.status(201).json({ message: `${type} created with missing types`, id: created._id.toString() })
    } else {
      res.status(400).json({ message: `${type} failed to be created` })
    }

  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// PUTS

// PUT /merits/:id
// Actualiza un mérito por id
meritRouter.put("/merits/:meritId", async (req, res) => {
  try {
    const id = req.params.meritId as string;
    const updates = req.body.updates;
    if(!updates) { res.status(404).json({error: "No updates provided."}) }

    const merit = await Publication.findById(id).populate('user');
    if (!merit) return res.status(404).json({ error: "Merit not found" });

    Object.assign(merit, updates);

    const updated = await merit.save();

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});

// DELETES

// DELETE /merits/:id
// Elimina de la base de datos un mérito por ID
meritRouter.delete("/merits/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) { res.status(400).json({ error: "La ID del mérito es necesaria para su eliminación." }) }

    const merit = await Publication.findByIdAndDelete(id);

    res.status(200).json({ message: "Mérito eliminado correctamente.", merit });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});



export default meritRouter;