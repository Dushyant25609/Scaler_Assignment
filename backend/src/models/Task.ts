import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  date: string;
  time?: string;
  deadline?: string;
  description?: string;
  taskListId: string;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema: Schema = new Schema(
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
    time: {
      type: String,
      trim: true
    },
    deadline: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    taskListId: {
      type: String,
      required: true,
      index: true
    },
    isCompleted: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Index for efficient queries
TaskSchema.index({ taskListId: 1, isCompleted: 1 });

export default mongoose.model<ITask>('Task', TaskSchema);
