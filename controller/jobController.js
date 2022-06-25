import Job from "../models/Job.js";
import { CustomAPIERROR } from './../middleware/error-handler.js';
import { StatusCodes } from 'http-status-codes';
import { checkPermissions } from './../util/checkPermissions';
import mongoose  from 'mongoose';

class JobController {
   async create(req,res){
      const {position,company,jobLocation,jobType,jobStatus} = req.body;
      const createdBy = req.user.userId;
      if(!position || !company)
         throw new CustomAPIERROR("Please provide All Values");

      const jobSuccess =await Job.create({company,position,jobLocation,jobType,jobStatus,createdBy})

      res.status(StatusCodes.CREATED).send({jobSuccess});
   }

   async delete(req,res){
      const {id:jobId} = req.params

      if(!jobId)
         throw new CustomAPIERROR("Please provide All Values");

      const job =await Job.findOne({jobId})
      
      checkPermissions(req.user,job.createdBy)

      if(job){
         await job.remove()
         res.status(StatusCodes.OK).send({msg:`${jobId} is Removed`});
      }
      else{
         throw new CustomAPIERROR("not Found")
      }
   }

   async getAllJob(req,res){
      const jobs = await Job.find({createdBy:req.body.userId})
      res.status(StatusCodes.OK).send({jobs,totalJobs:jobs.length,numOfPages:1});
   }
   async getQueryJobs(req,res){
      const {sort,search,jobType,jobStatus,skipJobs,limitJobs,page} = req.query;
      const queryObject ={
         createdBy:req.user.userId,
         jobStatus: jobStatus || "all",
         jobType : jobType || "all",
         position: {$regex:search,$options:'i'},
      }
      let jobs = Job.find(queryObject)
      // if(jobStatus !== "all")
      //    queryObject.jobStatus = jobStatus 
      if(sort === "latest")
        jobs = jobs.sort("-createdAt")
      else if(sort === "oldest")
         jobs = jobs.sort("createdAt")
      else if(sort === "a-z")
         jobs = jobs.sort("position")
      else if(sort === "z-a")
         jobs = jobs.sort("-position")
      
      const Page = Number(page) || 1;
      const Limit = Number(limitJobs ?? 0) || 10;
      const Skip = (Page - 1) * Limit
      
      jobs.skip(Skip).limit(Limit)
      const finalList = await jobs;

      const totalJobs = await jobs.countDocuments(queryObject);
      const numOfPages = Math.ceil(totalJobs/Limit);

      res.status(StatusCodes.OK).json({jobsList:finalList,totalJobs,numOfPages})
   }
   async updateJob(req,res){
      const {id:jobId}= req.params;
      
      const jobDetails  = await Job.findOne({_id:jobId});
      
      checkPermissions(req.user,req.body.userId)
      
      if(!jobDetails) throw new CustomAPIERROR("Job Not Found");

      const jobUpdates = await Job.findOneAndUpdate({_id:id},req.body,{
         new:true,
         runValidators:true
      });

      if(!jobDetails) throw new N("Job Not Found");

      res.status(StatusCodes.OK).json({jobUpdates})
   }

   async showStatus(req,res){
      let stats = await Job.aggregate([
         {$match:{createdBy:mongoose.Types.ObjectId(req.user.userId)}},
         {$group:{_id:'$jobStatus',count:{$sum:1}}}
      ])
      stats = stats.reduce((acc,curr) => {
         const {_id:title,count} = curr;
         acc[title] = count;
         return acc
      },{})
      console.log(stats);

      const defaultStats = {
         pending:stats.pending || 0,
         interview:stats.interview || 0,
         declined:stats.declined || 0
      }
      let monthlyApplication = [];
      monthlyApplication = await Job.aggregate([
         {$match:{createdBy:mongoose.Types.ObjectId(req.user.userId)}},
         {
            $group:{
               _id:{
                  year:{$year:'$createdAt'},
                  month:{$month:'$createdAt'}
               },
               count:{$sum:1}
            }
         },
         {$sort:{'_id.year':-1,'_id.month':-1}},
         {$limit:6}
      ])
      res.status(StatusCodes.OK).json({defaultStats,monthlyApplication});
   }
}

export default JobController;