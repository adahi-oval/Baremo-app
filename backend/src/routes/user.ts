import { Router } from "express";
import { User } from "../models/User";
import { Publication } from "../models/Publication";
import { userScorer } from "../services/userScorer";
import bcrypt from "bcrypt";
import { userLoader } from "../services/userLoader";

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
        const userScore = await userScorer(researcherId, false);

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

        res.status(200).json({ users: users });
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
        const totalScore = await userScorer(researcherId, false);
        return res.json({ researcherId, totalScore });
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// GET /users/score
// Todos los usuarios y sus puntuaciones
userRouter.get("/users/score", async (req, res) => {
    try {
        const users = await User.find();

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        const usersWithScores = await Promise.all(
            users.map(async (user) => {
                const totalScore = await userScorer(user.researcherId, false);
                return {...user.toObject(), totalScore};
            })
        );

        return res.json({users: usersWithScores});
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// GET /users/score
// Todos los usuarios y sus puntuaciones
userRouter.get("/users/score/:researcherId", async (req, res) => {
    try {
        const researcherId = parseInt(req.params.researcherId as string);

        const loggedUser = await User.findOne({researcherId});
        if (!loggedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const institutes = loggedUser.institutes;
        if (!institutes || institutes.length === 0) {
            return res.status(400).json({ error: "User has no associated institutes" });
        }

        const users = await User.find({ institutes: { $in: institutes } })

        if (!users || users.length === 0) {
            return res.status(404).json({ error: "No users found" });
        }

        const usersWithScores = await Promise.all(
            users.map(async (user) => {
                const totalScore = await userScorer(user.researcherId, false);
                return {...user.toObject(), totalScore};
            })
        );

        return res.json({users: usersWithScores});
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// GET /institute/score
// puntuación total del instituto
userRouter.get("/institute/score/:selectedInstitute", async (req, res) => {
  try {
    const selectedInstitute = req.params.selectedInstitute;

    const users = await User.find({ institutes: { $in: [selectedInstitute] } });

    if (users.length === 0) {
      return res.json({instituteScore: 0});
    }

    const results = await Promise.allSettled(
      users.map(user => userScorer(user.researcherId, false))
    );

    const instituteScore = results.reduce((acc, result) =>
      result.status === 'fulfilled' ? acc + result.value : acc, 0
    );

    return res.json({ instituteScore });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
  }
});


userRouter.get("/users/:researcherId/institute", async (req, res) => {
    try {
        const researcherId = parseInt(req.params.researcherId as string);

        const loggedUser = await User.findOne({researcherId});
        if (!loggedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const institutes = loggedUser.institutes;
        if (!institutes || institutes.length === 0) {
            return res.status(400).json({ error: "User has no associated institutes" });
        }

        const usersInInstitutes = await User.find({ institutes: { $in: institutes } })

        res.status(200).json({users: usersInInstitutes});

    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});

// GET /users/score/average
// Media de puntuacion de los últimos 3 años
userRouter.get("/user/:researcherId/score/average", async (req, res) => {
    try {
        const researcherId = Number(req.params.researcherId);
        if (isNaN(researcherId)) return res.status(400).json({ error: 'Invalid researcher ID' });

        const averageScore = (await userScorer(researcherId, true)) / 3;

        return res.json({averageScore: averageScore});
    } catch (err) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Unknown error" });
    }
});

userRouter.get("/users/load", async (req, res) => {
    try {
        
        userLoader();

        return res.json({message: "Users loaded succesfully"});
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
        if (!data) { return res.status(400).json({ error: "User not provided" })}

        const user = new User(data);
        await user.save();

        res.status(201).json({id: user.id});
    } catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(400).json({ error: "Unknown error" });
        }
    }
});

// DELETES

// DELETE /user/:researcherId   
// Elimina el usuario por researcherId
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
    try {
        const researcherId = req.params.researcherId;
        const updates = req.body.updates;

        if (!updates || typeof updates !== 'object' || Array.isArray(updates) || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "Invalid or empty updates object" });
        }

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }
        
        const user = await User.findOneAndUpdate({ researcherId }, updates, { new: true, runValidators: true }).select("-password -createdAt -__v");
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