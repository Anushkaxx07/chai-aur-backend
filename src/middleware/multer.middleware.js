import multer from "multer";
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        //null=no error handel
        //folder jidhar files rakhna voh h public k andar temp
        cb(null,"./public/temp")
    },
    filename:function(req,file,cb){
       
        //filename m bhi no error handel
        //jis naam se user save kiya ussi se rakh lenge

        cb(null,file.originalname)
        //not a good practice kyuki originalname ka same 4 file ho skta h

    }
})
export const upload=multer({
    storage,
})