import express from "express"
import { userAuth } from "../middlewares/auth";
import { AuthenticatedRequest } from "../types/express";
import connectionRequest from "../models/connectionRequest";
import mongoose from "mongoose";
import User from "../models/user";

export const userRouter = express.Router();
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//Get loggedIn User pending requests
userRouter.get("/user/requests/received", userAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const loggedInUser = req.user as { _id: mongoose.ObjectId };
        if (!loggedInUser) {
            res.status(401).send("Unauthorized: User not found");
            return;
        }
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested"
        }).populate("fromUserId", USER_SAFE_DATA);
        // .populate("fromUserId", ["firstName", "lastName"]);
        // .populate("fromUserId", "firstName lastName"); same as above just populate as string with space between attributes

        res.json({
            message: "Data fetched successfully",
            data: connectionRequests
        });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(400).send("ERROR : " + errorMessage);
        return;
    };
});

//GET loggedIn user connections
userRouter.get("/user/connections", userAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const loggedInUser = req.user as { _id: mongoose.ObjectId };
        if (!loggedInUser) {
            res.status(401).send("Unauthorized: User not found");
            return;
        }

        const connections = await connectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }
            ],
        }).populate("fromUserId", USER_SAFE_DATA).populate("toUserId", USER_SAFE_DATA);

        const data = connections.map((row) => {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({ data });
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(400).send("ERROR: " + errorMessage)
    }
});

//Feed Api
userRouter.get('/feed', userAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page as string) || 1;
        let limit = parseInt(req.query.limit as string) || 10;
        limit = limit > 50 ? 50 : limit;

        const skip = (page - 1) * limit;

        if (!loggedInUser) {
            res.status(401).send("Unauthorized: User not found");
            return;
        }

        // Add input validation for query parameters
        if (page < 1) {
            res.status(400).send("Page number must be greater than 0");
            return;
        }

        if (limit < 1 || limit > 50) {
            res.status(400).send("Limit must be between 1 and 50");
            return;
        }

        const connectionRequests = await connectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId toUserId")

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((req) => {
            hideUsersFromFeed.add(req.fromUserId.toString());
            hideUsersFromFeed.add(req.toUserId.toString());
        });

        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(USER_SAFE_DATA)
            .skip(skip)
            .limit(limit);

        res.json({ data: users });
    }
    catch {
        res.status(404).send("Something went wrong")
    }
});