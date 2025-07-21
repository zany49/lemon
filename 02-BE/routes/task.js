import express from "express"
import { requireSignin } from "../middleware/auth.js";
import { clearCache, createTask, deleteTask, getTaskById, getTasks, updateTask } from "../controllers/taskController.js";
import { validateTask } from "../middleware/validateBody.js";
const router = express.Router();


router.post('/create-task', requireSignin,validateTask, createTask);
router.get('/get-task-list', requireSignin,getTasks);
router.get('/get-task/:id',requireSignin, getTaskById);
router.put('/update-task/:id', requireSignin,validateTask, updateTask);
router.delete('/delete-task/:id', requireSignin,deleteTask);
router.get('/clear-cache', requireSignin,clearCache);


export default router;