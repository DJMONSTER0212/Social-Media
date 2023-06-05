import express from "express";
import bodyParser from "body-parser"
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv"
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import {register} from "./controllers/auth.js";
import { verifyToken } from "./middleware/auth.js";

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url)  ; //so that we can use directory name in module kind of thing
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"30mb",extended : true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,"public/assets")));

// File Storage
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"public/assets");
    },
    filename :function(req,file,cb){
        cb(null,file.originalname);
    }
});

const upload = multer({storage});

// Routes with file

app.post("/auth/register",upload.single("picture"),register); // why not included in routes folder ? bcz we needed upload variable inside the post one.
app.post("/posts", verifyToken, upload.single("picture"))
// Routes
app.use("/auth",authRoutes);
app.use("/users",userRoutes);
app.use("/posts",postRoutes);

// MOngoose 
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser :true,
    useUnifiedTopology : true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Running on ${PORT} and DB connected`));
}).catch((error)=>console.log(`${error} did not connect`))