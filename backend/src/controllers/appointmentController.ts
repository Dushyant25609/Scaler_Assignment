import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const { calendarId, date } = req.query;
    
    let query: any = {};
    
    if (calendarId) {
      query.calendarId = calendarId;
    }
    
    if (date) {
      query.date = date;
    }
    
    const appointments = await Appointment.find(query).sort({ date: 1, startTime: 1 });
    
    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointments'
    });
  }
};

// Get appointment by ID
export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch appointment'
    });
  }
};

// Create new appointment
export const createAppointment = async (req: Request, res: Response) => {
  try {
    const appointmentData = req.body;
    const newAppointment = new Appointment(appointmentData);
    await newAppointment.save();
    
    res.status(201).json({
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create appointment'
    });
  }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment,
      message: 'Appointment updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update appointment'
    });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete appointment'
    });
  }
};
