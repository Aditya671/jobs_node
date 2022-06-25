import { UnAuthorizedError } from "./error-handler.js";
import jwt  from 'jsonwebtoken';

const auth = (req,res,next) => {
   const header = req.header;
   const authHeader = header.authorization;

   if(!authHeader || !authHeader.startsWith("Bearer"))
      throw new UnAuthorizedError("Authentication Invalid");

   const token = authHeader.split(" ")[1];

   try{
      const payload =jwt.verify(token,process.env.JWT_SECRET);
      req.user = {userId:payload.userId, expireOn:payload.exp};
   }catch(err){
      console.log('\n\n', err , '\n\n');
      throw new UnAuthorizedError("Authentication Invalid");
   }
   next()
}
export default auth;