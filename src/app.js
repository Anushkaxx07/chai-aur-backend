import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true

}))
//form se data
app.use(express.json({
    limit:"10kb"
}))
//url se data jaise ki hitesh chaudhary ko url kuc bhi
//  bana deta toh udhar se bhi request aane do
app.use(express.urlencoded({extended:true,
    limit:"10kb"
}))
//public asset store krne k liye jaise ki kkoii pdf aai ya phir
//  koi photo aai toh usse store
//public folder
app.use(express.static("public"))

//secure cookie
app.use(cookieParser())
//route import
import userRouter from './routes/user.routes.js'




//route declare we follow good practice
//route and controller alag jagah toh router ko lane k liye middleware lana padega

// /api ka mtlb ye ek api h /v1 mtlb ye abhi iska version 1 hai and /users mtlb user se aane wale request

app.use("/api/v1/users",userRouter)

//localhost:8000/api/v1/users/register
export { app }