import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskList extends Document {
  name: string;
  count: number;
  createdAt: Date;
}

const TaskListSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    count: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<ITaskList>('TaskList', TaskListSchema);
