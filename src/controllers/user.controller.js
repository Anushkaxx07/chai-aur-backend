import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const registerUser=asyncHandler(async (req,res)=>{

    //user se detail lenge kya data lena h voh model se lenge
    //validation lagao-not empty
    //check if user already exists with username,email
    //check for images(mainly avatar)
    //upload to cloudinary
    //get url from cloudinary and console log,avatar check
    //create user object- create entry in db
    //remove password and refresh token feild from response
    //check user is created or not
    //return res

    //user detail request k andr milti jb body se aati
    //form ya json se aa rha toh direct req.body se
    //ulr wala dekhenge
    console.log(req.files);
    //step1
    const {fullName,email,username,password}=req.body
    //step2
    if(
        [fullName,email,password,username].some((feild)=>feild?.trim()==="")
    )
    {
        throw new ApiError(400,"This feild is required")
    }


    //step3
    const existedUser=await User.findOne({
        $or: [{ username } , { email }]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }

    //step4
    //multer already voh file lekr aagya h apne sotrage m
    //console.log(req.files);
    
    const avatarLocalPath=req.files?.avatar[0]?.path;
    // const coverImageLocalPath=req.files?.coverImage[0]?.path;
    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length >0){
        coverImageLocalPath=req.files.coverImage[0].path;
    }
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required")
    }
    //step5
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    //step 6

    if(!avatar){
        throw new ApiError(400,"Avatar upload failed")   
    }

    //step7
    const user=await User.create({
        username: username.toLowerCase(),
        fullName,
        avatar:avatar.url,
        coverImage: coverImage?.url || "",
        password,
        email
    })
    //step 8
    //user bana h ya ni
    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //step 9
    if(!createdUser){
        throw new ApiError(500,'Something went wrong while registering the User')

    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"User regisered successfully")
        
    )
})
export {
    registerUser,
}

