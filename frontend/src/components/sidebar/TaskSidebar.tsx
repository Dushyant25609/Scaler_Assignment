import { CheckCircle2, Star, ChevronUp, Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CheckBox = ({ label = "Check this box" }: { label?: string }) => {
    const [isChecked, setIsChecked] = useState(false);
    
    return (
        <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={(e) => {
                e.stopPropagation();
                setIsChecked(!isChecked);
            }}
        >
            <div className={`w-4 h-4 rounded-xs flex items-center justify-center transition-colors ${
                isChecked ? 'bg-gray-400' : 'border border-gray-400'
            }`}>
                {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </div>
            <span className="text-sm text-gray-300">{label}</span>
        </div>
    );
};

const TaskSidebar = () => {
  const [isListsExpanded, setIsListsExpanded] = useState(true);
  const [selectedItem, setSelectedItem] = useState<"all" | "starred" | "my-tasks">("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [taskLists, setTaskLists] = useState([
    { id: "my-tasks", name: "My Tasks", count: 2 }
  ]);

  return (
    <div className="w-72 h-screen bg-[#1B1B1B] text-white flex flex-col p-4 transition-all duration-300 ease-in-out overflow-hidden">
      {/* All tasks - Active */}
      <div className="mb-2">
        <Button
          variant="ghost"
          onClick={() => setSelectedItem("all")}
          className={`w-full justify-start gap-3 px-4 py-6 rounded-full ${
            selectedItem === "all"
              ? " bg-[#3D5A80] hover:bg-[#4A6A90] text-white hover:text-white hover:text-white"
              : "hover:bg-gray-600/50 hover:text-white text-white"
          }`}
        >
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-light">All tasks</span>
        </Button>
      </div>

      {/* Starred */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedItem("starred")}
          className={`w-full justify-start gap-3 rounded-full ${
            selectedItem === "starred"
              ? " bg-[#3D5A80] hover:bg-[#4A6A90] text-white hover:text-white "
              : "hover:bg-gray-600/50 hover:text-white text-white"
          }`}
        >
          <Star className="h-5 w-5" />
          <span className="text-sm font-light">Starred</span>
        </Button>
      </div>

      {/* Lists Section */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => setIsListsExpanded(!isListsExpanded)}
          className="w-full justify-between hover:bg-gray-600/50 hover:text-white text-white rounded-lg"
        >
          <span className="text-sm font-light">Lists</span>
          <ChevronUp
            className={`h-5 w-5 transition-transform ${
              isListsExpanded ? "" : "rotate-180"
            }`}
          />
        </Button>
      </div>

      {/* Task Lists */}
      {isListsExpanded && (
        <div className="mb-6 pl-2 space-y-1">
          {taskLists.map((list) => (
            <Button
              key={list.id}
              variant="ghost"
              className={`w-full justify-between px-4 py-3 rounded-lg hover:text-white hover:bg-gray-600/50`}
            >
              <CheckBox label={list.name} />
              <span className="text-sm text-gray-500">{list.count}</span>
            </Button>
          ))}
        </div>
      )}

      {/* Create new list */}
      <div>
        <Button
          variant="ghost"
          onClick={() => setIsDialogOpen(true)}
          className="w-full justify-start gap-3 px-4 py-3 hover:bg-gray-600/50 hover:text-white text-white rounded-lg"
        >
          <Plus className="h-5 w-5" />
          <span className="text-sm font-light">Create new list</span>
        </Button>
      </div>

      {/* Create New List Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#3C3C3C] rounded-2xl w-full max-w-md mx-4 p-8">
            <h2 className="text-white text-2xl font-normal mb-6">Create new list</h2>
            
            <input
              type="text"
              placeholder="Enter name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newListName.trim()) {
                  const newList = {
                    id: `list-${Date.now()}`,
                    name: newListName.trim(),
                    count: 0
                  };
                  setTaskLists([...taskLists, newList]);
                  setNewListName("");
                  setIsDialogOpen(false);
                }
              }}
              className="w-full bg-[#5C5C5C] text-white placeholder-gray-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-8"
              autoFocus
            />
            
            <div className="flex justify-end gap-6">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewListName("");
                }}
                className="text-[#8AB4F8] text-base font-medium hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newListName.trim()) {
                    const newList = {
                      id: `list-${Date.now()}`,
                      name: newListName.trim(),
                      count: 0
                    };
                    setTaskLists([...taskLists, newList]);
                    setNewListName("");
                    setIsDialogOpen(false);
                  }
                }}
                disabled={!newListName.trim()}
                className={`text-base font-medium ${
                  newListName.trim() 
                    ? 'text-[#8AB4F8] hover:underline' 
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskSidebar;
