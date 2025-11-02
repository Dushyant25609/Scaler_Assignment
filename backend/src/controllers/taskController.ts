import { Request, Response } from 'express';
import Task from '../models/Task';

// Get all tasks
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const { taskListId, isCompleted } = req.query;
    
    let query: any = {};
    
    if (taskListId) {
      query.taskListId = taskListId;
    }
    
    if (isCompleted !== undefined) {
      query.isCompleted = isCompleted === 'true';
    }
    
    const tasks = await Task.find(query).sort({ date: 1, createdAt: -1 });
    
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
};

// Get task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
};

// Create new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const taskData = req.body;
    const newTask = new Task(taskData);
    await newTask.save();
    
    res.status(201).json({
      success: true,
      data: newTask,
      message: 'Task created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
};

// Update task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update task'
    });
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete task'
    });
  }
};

// Toggle task completion
export const toggleTaskCompletion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    task.isCompleted = !task.isCompleted;
    await task.save();
    
    res.json({
      success: true,
      data: task,
      message: 'Task completion toggled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle task completion'
    });
  }
};
