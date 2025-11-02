import { Router } from 'express';
import { 
  getAllTaskLists, 
  getTaskListById, 
  createTaskList, 
  updateTaskList, 
  deleteTaskList 
} from '../controllers/taskListController';

const router = Router();

router.get('/', getAllTaskLists);
router.get('/:id', getTaskListById);
router.post('/', createTaskList);
router.put('/:id', updateTaskList);
router.delete('/:id', deleteTaskList);

export default router;
