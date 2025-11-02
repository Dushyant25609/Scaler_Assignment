import { CheckCircle2, MoreVertical, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Task {
  id: number;
  title: string;
  weeksAgo: number;
  completed: boolean;
}


const TaskView = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "take out the trash", weeksAgo: 245, completed: false },
    { id: 2, title: "Download admit card", weeksAgo: 199, completed: false },
  ]);

  const toggleTaskCompletion = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="flex-1 bg-[#131314] overflow-auto max-w-3xl h-fit mx-auto rounded-4xl w-fit transition-all duration-300 px-8 py-6">
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-light text-white">My Tasks</h1>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:bg-[#2D2D2D] hover:text-white rounded-full h-10 w-10"
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>

        {/* Add Task */}
        <div className="flex items-center gap-4 mb-2 cursor-pointer group hover:bg-[#1B1B1B] p-3 -mx-3 rounded-lg transition-colors">
          <CheckCircle2 className="h-5 w-5 text-blue-400" strokeWidth={2} />
          <span className="text-sm text-blue-300 group-hover:text-blue-200">Add a task</span>
        </div>

        {/* Past Section */}
        <div>
          <h2 className="text-xs font-light text-red-300 mb-2">Past</h2>
          
          {/* Task List */}
          <div className="">
            {tasks.map((task) => (
              <div key={task.id} className="group hover:bg-[#1B1B1B] p-3 rounded-lg transition-colors">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-0.5 w-4 h-4 rounded-full border-2 border-gray-500 hover:border-gray-300 flex items-center justify-center transition-colors shrink-0"
                  >
                    {task.completed && (
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </button>

                  {/* Task Content */}
                  <div className="flex-1">
                    <p className={`text-sm leading-relaxed ${task.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {task.title}
                    </p>
                    
                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-2 mt-1 px-3 py-1.5 rounded-full border border-[#3D3D3D] bg-transparent hover:bg-[#2D2D2D] transition-colors cursor-pointer">
                      <Calendar className="h-3.5 w-3.5 text-gray-400" />
                      <span className="text-xs text-red-300">{task.weeksAgo} weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskView;
