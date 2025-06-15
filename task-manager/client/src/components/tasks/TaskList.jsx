import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Chip,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Select,
  FormControl,
  InputLabel,
  Stack,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, deleteTask, completeTask } from "../../services/tasks";
import toast from "react-hot-toast";

const priorityColors = {
  Low: "success",
  Medium: "warning",
  High: "error",
};

function TaskList() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to load tasks");
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: completeTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task status updated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(id);
    }
  };

  const handleComplete = async (id) => {
    completeTaskMutation.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Failed to load tasks. Please try again later.</p>
      </div>
    );
  }

  const filteredTasks = Array.isArray(tasks)
    ? tasks.filter((task) => {
        if (filter === "all") return true;
        if (filter === "completed") return task.completed;
        if (filter === "pending") return !task.completed;
        return true;
      })
    : [];

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "dueDate") {
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === "priority") {
      return b.priority - a.priority;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-md ${
              filter === "completed"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-md ${
              filter === "pending"
                ? "bg-primary-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="dueDate">Sort by Due Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedTasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No tasks found. Create a new task to get started!
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleComplete(task._id)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div>
                    <h3
                      className={`text-lg font-medium ${
                        task.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{task.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {task.tags?.map((tag) => (
                        <span
                          key={tag._id}
                          className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800"
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>
                        Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                      </p>
                      <p>Priority: {task.priority}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;
