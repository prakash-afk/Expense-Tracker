import exrpess from "express";
import { registerUser,loginUser,getUserDetails, updateUserDetails} from "../controller/userController";
import authMiddleware  from "../middleware/auth.js";

const userRouter=express.Router();

userRouter.post('/register',registerUser);
userRouter.post('/login',loginUser);

//protected route to get user details
userRouter.get('/me',authMiddleware,getUserDetails );
//protected route to update user details
userRouter.put('/profileUpdate',authMiddleware,updateUserDetails);

export default userRouter;