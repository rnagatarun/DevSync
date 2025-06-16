import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum:{
            values: ["intrested", "ignore", "accepted", "rejected"],
            message: `{VALUE} is incorrect status type`
        },
    },
},
    {
        timestamps: true
    }
);

//PreSave  to validate the request
connectionRequestSchema.pre("save", function(next){
    // Check if user is sending request to their own account
    if (this.fromUserId.equals(this.toUserId)) {
        throw new Error("Cannot send connection request to yourself");
    }
    next();
})

export const connectionRequest = mongoose.model("connectionRequest", connectionRequestSchema);
export default connectionRequest;
