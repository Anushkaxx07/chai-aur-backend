import mongoose from "mongoose";
const subscriptionSchema=new mongoose.Schema(
    {
        //isme hm no of subscriber bhi dikhana
        channel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        //isme knse channel ko subscribe kre h ye bhi dikhana
        subscriber:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
    timestamps:true
})
export const Subscription=mongoose.model("Subscription",subscriptionSchema)