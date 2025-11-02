import { Request, Response } from 'express';
import Calendar from '../models/Calendar';

// Get all calendars
export const getAllCalendars = async (req: Request, res: Response) => {
  try {
    const calendars = await Calendar.find().sort({ createdAt: 1 });
    
    res.json({
      success: true,
      data: calendars
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calendars'
    });
  }
};

// Get calendar by ID
export const getCalendarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const calendar = await Calendar.findById(id);
    
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: 'Calendar not found'
      });
    }
    
    res.json({
      success: true,
      data: calendar
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch calendar'
    });
  }
};

// Create new calendar
export const createCalendar = async (req: Request, res: Response) => {
  try {
    const calendarData = req.body;
    const newCalendar = new Calendar(calendarData);
    await newCalendar.save();
    
    res.status(201).json({
      success: true,
      data: newCalendar,
      message: 'Calendar created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create calendar'
    });
  }
};

// Update calendar
export const updateCalendar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const calendar = await Calendar.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: 'Calendar not found'
      });
    }
    
    res.json({
      success: true,
      data: calendar,
      message: 'Calendar updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update calendar'
    });
  }
};

// Delete calendar
export const deleteCalendar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const calendar = await Calendar.findByIdAndDelete(id);
    
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: 'Calendar not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Calendar deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete calendar'
    });
  }
};

// Toggle calendar visibility
export const toggleCalendarVisibility = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const calendar = await Calendar.findById(id);
    
    if (!calendar) {
      return res.status(404).json({
        success: false,
        error: 'Calendar not found'
      });
    }
    
    calendar.isVisible = !calendar.isVisible;
    await calendar.save();
    
    res.json({
      success: true,
      data: calendar,
      message: 'Calendar visibility toggled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle calendar visibility'
    });
  }
};
