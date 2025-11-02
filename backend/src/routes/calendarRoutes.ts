import { Router } from 'express';
import { 
  createCalendar, 
  deleteCalendar, 
  getAllCalendars, 
  getCalendarById, 
  toggleCalendarVisibility, 
  updateCalendar 
} from '../controllers/calendarController';

const router = Router();

router.get('/', getAllCalendars);
router.get('/:id', getCalendarById);
router.post('/', createCalendar);
router.put('/:id', updateCalendar);
router.delete('/:id', deleteCalendar);
router.patch('/:id/toggle', toggleCalendarVisibility);

export default router;
