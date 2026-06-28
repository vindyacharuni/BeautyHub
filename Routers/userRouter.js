import express from 'express';
import { createUser, loginUser, registerUser, getDashboardStats, googleLogin } from '../controllers/userController.js';
const userRouter = express.Router();
userRouter.post('/', (createUser))
userRouter.post('/login', (loginUser))
userRouter.post('/register', registerUser)
userRouter.post('/google-login', googleLogin)
userRouter.get('/dashboard-stats', getDashboardStats)

export default userRouter;