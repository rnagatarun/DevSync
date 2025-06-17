import express from "express"
import { userAuth } from "../middlewares/auth";
import { AuthenticatedRequest } from "../types/express";
import connectionRequest from "../models/connectionRequest";

export const userRouter = express.Router();

//Get loggedIn User pending requests
userRouter.get("/user/requests", userAuth, async (req: AuthenticatedRequest, res) => {
    try {
        const loggedInUser = req.user;
        if (!loggedInUser) {
            res.status(401).send("Unauthorized: User not found");
            return;
        }
        const connectionRequests = await connectionRequest.find({
            toUserId: loggedInUser._id,
            status: "intrested"
        }).populate("fromUserId", ["firstName", "lastName"]);
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
    }

});