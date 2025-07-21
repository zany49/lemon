import {Schema,model} from 'mongoose';


const taskSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: {type:Date,required:true},
}, { timestamps: true });
taskSchema.index({ userId: 1, title: 1 }, { unique: true });

export default model('Task', taskSchema);