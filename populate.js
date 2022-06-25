import {readFile} from 'fs/promises';
import dotenv from 'dotenv';
import { connectDB } from "./db/connectDB.js";
import Job from './models/Job.js';

dotenv.config()
const start = async () => {
   try{
      await connectDB(process.env.MONGO_URL);
      await Job.deleteMany()
      const JsonProducts = JSON.parse(await readFile(new URL('./mock_json2.json', import.meta.url)))
      await Job.create(JsonProducts);
      process.exit(0)

   }catch(err){
      console.log(err)
      process.exit(1)
   }
}
start()