import mongoose, { Schema, Document } from 'mongoose';

export interface ICalendar extends Document {
  name: string;
  color: string;
  isVisible: boolean;
  createdAt: Date;
}

const CalendarSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    color: {
      type: String,
      required: true,
      default: '#1A73E8'
    },
    isVisible: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ICalendar>('Calendar', CalendarSchema);
