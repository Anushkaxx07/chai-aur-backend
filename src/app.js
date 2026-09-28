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


export { app }