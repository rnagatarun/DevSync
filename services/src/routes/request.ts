import express from "express";
import { userAuth } from "../middlewares/auth.js";
import { AuthenticatedRequest } from "../types/express";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

export const requestRouter = express.Router();

requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
    try {
        const user = req.user as unknown as { _id: string; firstName: string };
        if (!user) {
            res.status(401).send("Unauthorized: User not found");
            return;
        }
        const fromUserId = user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        //Validate Request status
        const allowedStatus = ["intrested", "ignored"];
        if (!allowedStatus.includes(status)) {
            res.status(400).json({ message: "Invalid status type" + status });
            return;
        }

        //Validate if the toUser exists on DB
        const toUser = await User.findById(toUserId);
        if (!toUser) {
            res.status(400).json({ message: "User not found" });
            return;
        };

        //Validate if req already present
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ],
        });

        if (existingConnectionRequest) {
            res.status(400).send({ message: "Connection Request Already Exists!!" });
        }

        //Send connection request;
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message: user.firstName + " is " + status + " in " + toUser.firstName,
            data
        });
        return;
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(400).send("ERROR : " + errorMessage);
        return;
    }
});