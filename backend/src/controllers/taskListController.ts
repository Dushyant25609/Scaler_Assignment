import { Request, Response } from 'express';
import TaskList from '../models/TaskList';
import Task from '../models/Task';

// Get all task lists
export const getAllTaskLists = async (req: Request, res: Response) => {
  try {
    const taskLists = await TaskList.find().sort({ createdAt: 1 });
    
    // Update counts based on tasks
    const updatedTaskLists = await Promise.all(
      taskLists.map(async (list) => {
        const count = await Task.countDocuments({
          taskListId: String(list._id),
          isCompleted: false
        });
        return {
          ...list.toObject(),
          count
        };
      })
    );
    
    res.json({
      success: true,
      data: updatedTaskLists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task lists'
    });
  }
};

// Get task list by ID
export const getTaskListById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskList = await TaskList.findById(id);
    
    if (!taskList) {
      return res.status(404).json({
        success: false,
        error: 'Task list not found'
      });
    }
    
    const count = await Task.countDocuments({
      taskListId: id,
      isCompleted: false
    });
    
    res.json({
      success: true,
      data: { ...taskList.toObject(), count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task list'
    });
  }
};

// Create new task list
export const createTaskList = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Task list name is required'
      });
    }
    
    const newTaskList = new TaskList({ name: name.trim(), count: 0 });
    await newTaskList.save();
    
    res.status(201).json({
      success: true,
      data: newTaskList,
      message: 'Task list created successfully'
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Task list with this name already exists'
      });
    }
    res.status(500).json({
      success: false,
      error: 'Failed to create task list'
    });
  }
};

// Update task list
export const updateTaskList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    
    const taskList = await TaskList.findByIdAndUpdate(
      id,
      { name: name.trim() },
      { new: true, runValidators: true }
    );
    
    if (!taskList) {
      return res.status(404).json({
        success: false,
        error: 'Task list not found'
      });
    }
    
    const count = await Task.countDocuments({
      taskListId: id,
      isCompleted: false
    });
    
    res.json({
      success: true,
      data: { ...taskList.toObject(), count },
      message: 'Task list updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task list'
    });
  }
};

// Delete task list
export const deleteTaskList = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const taskList = await TaskList.findByIdAndDelete(id);
    
    if (!taskList) {
      return res.status(404).json({
        success: false,
        error: 'Task list not found'
      });
    }
    
    // Delete all tasks in this list
    await Task.deleteMany({ taskListId: id });
    
    res.json({
      success: true,
      message: 'Task list deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task list'
    });
  }
};
