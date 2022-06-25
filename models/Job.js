import mongoose from "mongoose";
import validator from "validator";

const JobSchema  = mongoose.Schema({
   position:{
      type:String, 
      // validate:{
      //    validator:validator.isEmpty,
      //    message:'Please Provide Position you want to apply to'
      // },
      required :[true,"Please Provide Position"],
   },
   company:{
      type:String, 
      // validate:{
      //    validator:validator.isEmpty,
      //    message:'Please Provide Company Name'
      // },
      required :[true,"Please Provide Company Name"],
   },
   jobLocation:{
      type:String, 
      default:'my city',
      required :[true,"Please Provide Company's Location"],
   },
   jobStatus:{
      type:String, 
      enum:['interview','declined','pending'],
      default:'pending',
      required :[true,"Please Provide Status"],
   },
   jobType:{
      type:String, 
      enum:['full-time','part-time','remote','internship'],
      default:'full-time',
      required :[true,"Please Provide Type"],
   },
   createdBy:{
      type:mongoose.Types.ObjectId,
      ref:'User',
      required:[true,"Please Provide User"]
   },
   createdAt:{
      type:Date
   }
},
{timestamps:true})
export default mongoose.model('Job',JobSchema)