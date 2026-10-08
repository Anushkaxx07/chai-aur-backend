//dekho ki ye logged in banda h bhi ki ni
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
export const verifyJWT=asyncHandler(async(req, _,next)=>{

    //step1 :access token nikalo
    //Web me direct req.cookies m accesstoken mil jaega
    //In app we have to find req.header m authorization and the usme
    //Bearer ko replace krke "" empty kr denge and access token le lenge

    try {
        const token=req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
        const user=await User.findById(decodedToken?._id).select
        ("-password -refreshToken")
        if(!user){
            //todo:discuss about frontend
            throw new ApiError(401,"Invalid Acess Token")
        }
        req.user=user;
        next()
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid access token")
    }

})