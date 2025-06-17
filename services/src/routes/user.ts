import express from "express"
import { userAuth } from "../middlewares/auth";
import { AuthenticatedRequest } from "../types/express";
import connectionRequest from "../models/connectionRequest";
import mongoose from "mongoose";

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