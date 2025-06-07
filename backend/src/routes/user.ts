import { Router } from "express";
import { User } from "../models/User";
import { Publication } from "../models/Publication";
import { userScorer } from "../services/userScorer";

const userRouter = Router();

// GETTERS

// GET /user/:researcherId
// Returns the user with the given researcherId
userRouter.get("/user/:researcherId", async (req, res) => {
    try {
        const researcherId = Number(req.params.researcherId);

        if (!researcherId) {
            return res.status(400).json({ error: "Researcher ID is required" });
        }
        
        const user = await User.findOne({researcherId});
        const userScore = await userScorer(researcherId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({user: user, userScore: userScore});
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// GET /users
// Get all users
userRouter.get("/users", async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        res.status(200).json({ "users": users });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// GET /user/:researcherId/score
// Puntuación total de un investigador concreto
userRouter.get("/user/:researcherId/score", async (req, res) => {
    const researcherId = Number(req.params.researcherId);
    if (isNaN(researcherId)) return res.status(400).json({ error: 'Invalid researcher ID' });

    try {
        const totalScore = await userScorer(researcherId);
        return res.json({ researcherId, totalScore });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// POSTS

// POST /user
// Creates a new user
userRouter.post("/user", async (req, res) => {
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

// DELETES

// DELETE /user/:username
// Deletes the user with the given username
userRouter.delete("/user/:researcherId", async (req, res) => {
    try {
        const researcherId = req.params.researcherId;

        if (!researcherId) {
            return res.status(400).json({ error: "Researcher ID is required"});
        }

        const user = await User.findOneAndDelete({ researcherId });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
            
        }

        res.status(200).json({ message: "user deleted", user: user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }   
    }
});

// PUTS

// PUT /user/:researcherId
// Updates the user with the given researcherId
userRouter.put("/user/:researcherId", async (req, res) => {
    try {76
        const researcherId = req.params.researcherId;
        const updates = req.body.updates;

        if (!updates || typeof updates !== 'object' || Array.isArray(updates) || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Invalid or empty updates object" });
        }
        
        const user = await User.findOneAndUpdate({ researcherId }, updates, { new: true, runValidators: true }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated", user: user });
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

export default userRouter;