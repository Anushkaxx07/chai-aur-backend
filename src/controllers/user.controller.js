import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiError} from '../utils/ApiError.js'
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
const generateAccessandRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        //refresh token in db
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken};
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}
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

const loginUser=asyncHandler(async(req,res)=>{
    //my  steps
    /*
    step 1.User se email,username aur password lena h
    step 2.Validate karane h password ki user register h ya ni
    step3. If not registered then signup pe bhejna
    step4. If register h toh login karana h ek token generate karana h
    step5. Access token and refresh token dono generate honge
    step6. User ka token agar shi h toh usse hme home page pe redirect karna
     */

    //sir steps
    /*
    req body se data le aao
    username or email check krna 
    find the user 
    password check
    access and refresh token generate
    token send in cookies
    Send a response that login is successful
     */
    const {email,password,fullName,username}=req.body;
    if(!username || !email){
        throw new ApiError(400,"Username or email is required");
    }
    const user=await User.findOne({
       $or: [{ username } , { email }]
    });
    if(!user){
        throw new ApiError(404,"User does not exist");
    }
    const isCorrect=await user.isPasswordCorrect(password);
    if(!isCorrect){
        throw new ApiError(401,"Password is incorrect");
    }
    const {accessToken,refreshToken}=await 
    generateAccessandRefreshTokens(user._id);

    //ek aur baar database ko query kre ya phir ussi user jo aaya h usse update krle
    const loggedInuser=await User.findById(user._id)
    .select("-password -refreshToken");

    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,
            {
                //phir refreshToken 
                user:loggedInuser,
                accessToken,
                refreshToken
            },
            "User logged in Successfully"
        )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
    //steps
    /*
    1.cookies clear
    2.refresh token refresh krna
     */
    //refresh token db se hogya gayab
    await User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }

    )
    //cookies wala kaam
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out Successfully"))

})
export {
    registerUser,
    loginUser,
    logoutUser
}

