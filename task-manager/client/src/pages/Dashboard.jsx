import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { getTasks, deleteTask } from "../services/tasks";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ChatBot from "../components/chat/ChatBot";

function Dashboard() {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tasks = response?.tasks || [];

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task deleted successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to delete task");
    },
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-400 opacity-30"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to Load Dashboard
          </h3>
          <p className="text-red-600">
            Failed to load dashboard data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const overdueTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) < new Date()
  );

  const upcomingTasks = tasks
    .filter((task) => !task.completed && new Date(task.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentTasks = tasks
    .sort(
      (a, b) =>
        new Date(b.createdAt || b.updatedAt) -
        new Date(a.createdAt || a.updatedAt)
    )
    .slice(0, 5);

  const stats = [
    {
      title: "Total Tasks",
      value: tasks.length,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          ></path>
        </svg>
      ),
    },
    {
      title: "Completed",
      value: completedTasks.length,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Pending",
      value: pendingTasks.length,
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      ),
    },
    {
      title: "Overdue",
      value: overdueTasks.length,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
      ),
    },
  ];

  const TaskCard = ({ task, showCompletionDate = false }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <p className="text-sm text-gray-500 mt-1">{task.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            {task.priority === "high" && (
              <span className="px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                High
              </span>
            )}
            {task.priority === "medium" && (
              <span className="px-2 py-1 text-xs font-medium text-yellow-700 bg-yellow-100 rounded-full">
                Medium
              </span>
            )}
            {task.priority === "low" && (
              <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                Low
              </span>
            )}
          </div>
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <span
                key={`${task._id}-tag-${index}`}
                className="px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        {showCompletionDate && task.completedAt && (
          <div className="mt-3 text-sm text-gray-500">
            Completed: {new Date(task.completedAt).toLocaleDateString()}
          </div>
        )}
      </motion.div>
    );
  };

  const SectionCard = ({
    title,
    children,
    isEmpty,
    emptyMessage,
    showCreateButton = true,
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {showCreateButton && (
          <Link
            to="/tasks/new"
            className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                ></path>
              </svg>
              Create New Task
            </span>
          </Link>
        )}
      </div>
      {isEmpty ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {emptyMessage}
          </h3>
          {showCreateButton && (
            <Link
              to="/tasks/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Create New Task
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2 animate-fade-in-delay-1">
            Welcome to Taskflow - Your productivity overview
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`${stat.bgColor} rounded-2xl p-6 shadow-lg`}
            >
              <div className="flex items-center">
                <div className={`${stat.textColor} p-3 rounded-lg`}>
                  {stat.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Tasks */}
          <SectionCard
            title="Recent Tasks"
            isEmpty={tasks.length === 0}
            emptyMessage="No tasks found. Create a new task to get started!"
          >
            {recentTasks.map((task, index) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </SectionCard>

          {/* Upcoming Tasks */}
          <SectionCard
            title="Upcoming Tasks"
            isEmpty={upcomingTasks.length === 0}
            emptyMessage="No upcoming tasks"
          >
            {upcomingTasks.map((task, index) => (
              <TaskCard key={task._id} task={task} />
            ))}
          </SectionCard>
        </div>

        {/* Completed Tasks */}
        <div className="mt-8">
          <SectionCard
            title="Completed Tasks"
            isEmpty={completedTasks.length === 0}
            emptyMessage="No completed tasks yet"
            showCreateButton={false}
          >
            {completedTasks.map((task, index) => (
              <TaskCard key={task._id} task={task} showCompletionDate={true} />
            ))}
          </SectionCard>
        </div>
      </div>

      {/* Add ChatBot component */}
      <ChatBot />
    </div>
  );
}

export default Dashboard;
