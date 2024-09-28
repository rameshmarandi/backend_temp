import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel :{
      type: Schema.Types.ObjectId,
      ref: "User",
    }
    // plan: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Plan",
    // },
    // status: {
    //   type: String,
    //   enum: ["active", "inactive"],
    //   default: "active",
    // },
  },
  {
    timestamps: true,
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
