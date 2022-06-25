import express from  "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import 'express-async-errors';
import cors from "cors";
import morgan from "morgan";
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import helmet from "helmet";
import xss from 'xss-clean';
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
// Middleware
import { PageNotFound } from "./middleware/PageNotFound.js";
import { errorHandler } from './middleware/error-handler.js';
import { connectDB } from "./db/connectDB.js";
import authenticateUser from "./middleware/auth-middleware.js";
import fileUpload from "express-fileupload";
// Routes
import authRouter from "./routes/authRouter.js";
import jobRouter from './routes/jobRouter.js';
import cloudinary from 'cloudinary'
import { sendEmail } from "./controller/sendEmail.js";

dotenv.config();
const cloudinaryUpload = cloudinary.v2
const port = process.env.PORT || 5000;
const app = express();
const corsOptions = {
   origin:"http://localhost:3000",
   optionsSuccessStatus:200
}
const rateLimiter = rateLimit({
   windowMs:15 * 60 * 100,
   max:100,
   standardHeaders:true,
   legacyHeaders:false,
   message:"Too Many Requests from this Ip address, Try again after 15 minutes"
});
cloudinaryUpload.config({
   cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET
})
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(express.static(path.resolve(__dirname,'./client/build')));
app.use(express.static(path.resolve(__dirname,'./client/public')));
app.use(express.static('./public'));
app.use(express.json());
app.use(fileUpload()) // old Method
app.use(fileUpload({useTempFiles:true}))

// app.use(rateLimiter);
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get("/",(req,res,next) => {
   res.redirect('/dashboard');   
   next();
});
app.use("/dashboard",(req,res,next) => {
   res.json({msg:"WELCOME"});
})
if(process.env.NODE_ENV !== "production"){
   app.use(morgan('dev'))
}
app.use("/api/v1/auth",cors(corsOptions),rateLimiter,authRouter);

app.use("/api/v1/jobs",authenticateUser,jobRouter);

app.use('/send',sendEmail)
app.get("*",(req,res) => {
   res.sendFile(path.resolve(__dirname,"./client/","index.html"));
})
app.use("*",PageNotFound);
app.use(errorHandler);

const start = async () => {
   try{
      await connectDB(process.env.MONGO_URL);
      app.listen(port,() => console.log("server listen"));
   }
   catch(err){
      // console.log(err);
   }
}
start();