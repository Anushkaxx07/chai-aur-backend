import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary=async(localFilePath)=>{
    try{
        if(!localFilePath) return null
        //upload the file on cloudinary
        //resource type auto means 
        const res=await cloudinary.uploader.upload(localFilePath, {
            resource_type:'auto'
        })
        //file has been uploaded successfully
        // console.log("File uploaded successfully on Cloudinary",res.url);
        fs.unlinkSync(localFilePath)
        return res
    }
    catch(error){
        //remove the file from local server as file 
        // upload got fail and ye "synchronous" h
        console.log("Cloudinary error",error);
        if(fs.existsSync(localFilePath)){
        fs.unlinkSync(localFilePath)
        }
        return null;

    }
}
export {uploadOnCloudinary}