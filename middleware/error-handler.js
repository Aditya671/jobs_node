import { StatusCodes } from 'http-status-codes';

export class CustomAPIERROR extends Error{
   constructor(message){
      super(message)
      this.statusCode = StatusCodes.BAD_REQUEST
   }
}
export class UnAuthorizedError extends CustomAPIERROR{
   constructor(message){
      super(message)
      this.statusCode = StatusCodes.UNAUTHORIZED
   }
}
export const errorHandler = (err, req, res, next) => {
   
   const default_error = {
      statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg:err.message || "There is an Error"
   }
   if(err.name === "ValidationError"){
      default_error.statusCode = StatusCodes.BAD_REQUEST;
      default_error.msg = Object.values(err.errors).map(item => {
         return {
            fieldName:item.path,
            message:item.message
         }
      })
   }
   if(err.code && err.code === 11000){
      default_error.msg = `${Object.keys(err.keyValue)} has to be unique`;
   }
   res.status(default_error.statusCode).send(
      {
         statusCode:default_error.statusCode,
         msg:default_error.msg}
      );
}

