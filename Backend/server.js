import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoute.js';

const app=express();
const PORT=process.env.PORT || 4000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes
app.use('/api/user',userRouter);
app.get('/',(req,res)=>{
    res.send('API is running');
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on http://localhost:${PORT}`);
        })
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};

startServer();
