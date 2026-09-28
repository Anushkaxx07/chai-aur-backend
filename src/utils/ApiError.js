class ApiError extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        //error stack
        stack=""
    ){
        //parent class Error ka constructor chaloa and 
        //ye msg send krdo
        super(message)
        //now we can acess the inherited props and change it
        this.statusCode=statusCode
        this.data=null
        this.message=message
        this.success=false
        this.errors=errors

        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this,
                this.constructor)
        }

    }
}

export {ApiError}