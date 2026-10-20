import {Router} from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser,changeCurrentPassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCoverImage, getUserChannelProfile, getwatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { verify } from "jsonwebtoken";
const router=Router()

router.route('/register').post(
    //jo bhi method execture ho rha usse just pehle
    //use krlo like here we have used upload
    
    upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverImage",
            maxCount:1,
        }
    ]),
    registerUser
)
router.route('/login').post(
    loginUser
)
//secured routes
router.route('/logout').post(
    verifyJWT
    ,logoutUser
)
router.route('/refresh-token').post(
    refreshAccessToken
)
router.route('/change-password').post(
    verifyJWT,
    changeCurrentPassword,
)
router.route('/getuser').get(
    verifyJWT,
    getCurrentUser
)
router.route('/updatedetails').patch(
    verifyJWT,
    updateAccountDetails
)
router.route('/update-avatar').patch(
    verifyJWT,
    //pehle hi upload krlo on local phir uska url chala jaega
    upload.single("avatar"),
    updateAvatar
)
router.route('/update-coverimg').patch(
    verifyJWT,
    upload.single("coverImage"),
    updateCoverImage
)
//param send kr rhe h 
router.route("/c/:username").get(
    verifyJWT,
    getUserChannelProfile
)
router.route('/watch-history').get(
    verifyJWT,
    getwatchHistory
)



export default router