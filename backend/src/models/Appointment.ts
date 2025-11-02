import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  calendarId: string;
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: String,
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    calendarId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
AppointmentSchema.index({ date: 1, calendarId: 1 });

export default mongoose.model<IAppointment>('Appointment', AppointmentSchema);
