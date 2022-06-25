import { CustomAPIERROR } from "./error-handler.js"
import { StatusCodes } from 'http-status-codes';

export class NotFoundPage extends CustomAPIERROR{
   constructor(message){
      super(message);
      this.statusCode = StatusCodes.NOT_FOUND;
   }
}
export const PageNotFound = () => {
   throw new NotFoundPage("Page Not Found");
}