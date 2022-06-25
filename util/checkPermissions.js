import { UnAuthorizedError } from './../middleware/error-handler.js';

export const checkPermissions = (requestUserId,resourceUserId) => {
   if(requestUserId.userId === resourceUserId.toString()) return
   else throw new UnAuthorizedError("not authorized to access this");
}