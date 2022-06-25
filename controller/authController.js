import { StatusCodes } from "http-status-codes";
import { CustomAPIERROR, UnAuthorizedError } from "../middleware/error-handler.js";
import User from "../models/User.js";
import path from 'path';
import cloudinary from 'cloudinary';
import fs from 'fs';

const cloudImageUpload  = cloudinary.v2
class AuthController {
   async register(req,res){
      const {name,email,password,location,image} = req.body;
      const userExist = await User.findOne({email});
      if(!name || !email || !password){
         throw new CustomAPIERROR('Please provide All Values')
      }
      if(userExist !== null){
         throw new CustomAPIERROR('User Already Exist');
      }
      else{
         console.log(image)
         const imgPath = uploadProfileImage(req)
         const user = await User.create({name,email,password,location,image:imgPath});
         const token = user.createJWT();
         res.status(StatusCodes.CREATED).send({user,token});
      }
   }

   async login(req,res){
      console.log(req);
      const {email,password} = req.body;
      
      if(!email || !password){
         throw new CustomAPIERROR('Please provide All Values')
      }
      const user = await User.findOne({email}).select('+password');

      if(!user){
         throw new UnAuthorizedError("User Not Authorized");
      }
      const isPasswordCorrect = User.comparePassword(password);
      if(!isPasswordCorrect){
         throw new UnAuthorizedError("Invalid Credentials");
      }
      const token = user.createJWT();
      user.password = undefined
      res.status(StatusCodes.OK).send({user,token})
      
   }

   async updateUser(req,res){
      const {email, name,location} = req.body;
      console.log(req.user);
      if(!name || !email || !location){
         throw new CustomAPIERROR('Please provide All Values')
      }
      const user = await User.findOne({_id:req.user.userId});

      user.email = email;
      user.name = name;
      user.location = location;

      await user.save()
      const token = user.createJWT();
      res.status(StatusCodes.CREATED).send({user,token});
   }
   async uploadProfileImage(req,res){
      if (!req.files) throw new CustomAPIERROR("No Files uploaded")

      if (!req.files.image.mimeType.startsWith('image')) throw new CustomAPIERROR("Only Image Accepted")
      
      const receivedFile  = req.files.image;
      
      if (receivedFile.size > 1000) throw new CustomAPIERROR("Size greater than 1mb not allowed")

      const imagePath = path.join(__dirname,'../uploads/'+`${receivedFile.name}`)
      await receivedFile.mv(imagePath)
      res.status(StatusCodes.OK).json({'image':"File Uploaded SuccessFully"});

      // const result = await cloudImageUpload.uploader.upload(receivedFile.tempilePath,{
      //    use_filename:true,folder:'file-upload'
      // })
         // fs.unlinkSync(receivedFile.tempilePath)
      // res.status(StatusCodes.OK).json({'image':`File Uploaded SuccessFully ${result.secure_url}`});

   }
}

export default AuthController;