import express from 'express';
import { createUser, loginUser, registerUser, getDashboardStats } from '../controllers/userController.js';
const userRouter = express.Router();
userRouter.post('/', (createUser))
userRouter.post('/login', (loginUser))
userRouter.post('/register', registerUser)
userRouter.get('/dashboard-stats', getDashboardStats)

export default userRouter;