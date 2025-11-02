import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
  guests?: string;
  location?: string;
  description?: string;
  calendarId: string;
  repeatOption: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
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
      required: false
    },
    endTime: {
      type: String,
      required: false
    },
    isAllDay: {
      type: Boolean,
      default: false
    },
    guests: {
      type: String,
      trim: true
    },
    location: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    calendarId: {
      type: String,
      required: true,
      index: true
    },
    repeatOption: {
      type: String,
      default: 'Does not repeat'
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
EventSchema.index({ date: 1, calendarId: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
