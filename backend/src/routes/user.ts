import { Router } from "express";
import { User } from "../models/User";

const userRouter = Router();

// GETTERS

// GET /user/:username
// Returns the user with the given username
userRouter.get("/user/:username", async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({ error: "Username is required" });
        }
        
        const user = await User.findByUsername(username);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
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
userRouter.delete("/user/:username", async (req, res) => {
    try {
        const username = req.params.username;

        if (!username) {
            return res.status(400).json({ error: "Username is required"});
        }

        const user = await User.findOneAndDelete({ username });

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

// PUT /user/:username
// Updates the user with the given username
userRouter.put("/user/:username", async (req, res) => {
    try {76
        const username = req.params.username;
        const updates = req.body.updates;

        if (!updates) {
            return res.status(400).json({ message: "Updates not provided" });
        }
        
        const user = await User.findOneAndUpdate({ username }, updates, { new: true, runValidators: true }).select("-password");

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