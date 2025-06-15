import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTasks, toggleTaskCompletion } from "../services/tasks";
import { exportTasksPDF, exportTasksCSV } from "../services/export";
import TaskForm from "../components/tasks/TaskForm";
import toast from "react-hot-toast";

function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [filters, setFilters] = useState({
    status: "all", // all, completed, pending, overdue
    priority: "all", // all, high, medium, low
    search: "",
  });
  const [viewMode, setViewMode] = useState("list"); // list, grid
  const [sortBy, setSortBy] = useState("dueDate"); // dueDate, title, priority

  const queryClient = useQueryClient();

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const toggleMutation = useMutation({
    mutationFn: toggleTaskCompletion,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task status updated");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to update task status"
      );
    },
  });

  const tasks = tasksData?.tasks || [];
  const completedTasks = tasks.filter((task) => task.completed);
  const pendingTasks = tasks.filter((task) => !task.completed);
  const overdueTasks = tasks.filter(
    (task) => !task.completed && new Date(task.dueDate) < new Date()
  );

  const filteredTasks = (
    filters.status === "all"
      ? tasks
      : filters.status === "completed"
      ? completedTasks
      : filters.status === "overdue"
      ? overdueTasks
      : pendingTasks
  ).filter((task) => {
    const matchesPriority =
      filters.priority === "all" ||
      task.priority.toLowerCase() === filters.priority.toLowerCase();

    const matchesSearch =
      !filters.search ||
      task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      task.description?.toLowerCase().includes(filters.search.toLowerCase());

    return matchesPriority && matchesSearch;
  });

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "priority":
        const priorityOrder = { High: 3, Medium: 2, Low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case "dueDate":
      default:
        return new Date(a.dueDate) - new Date(b.dueDate);
    }
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleCompletion = async (taskId, e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMutation.mutate(taskId);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (task) => {
    if (task.completed) return "bg-green-100 text-green-800 border-green-200";
    if (new Date(task.dueDate) < new Date())
      return "bg-red-100 text-red-800 border-red-200";
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getStatusText = (task) => {
    if (task.completed) return "Completed";
    if (new Date(task.dueDate) < new Date()) return "Overdue";
    return "Pending";
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExportPDF = async () => {
    try {
      const blob = await exportTasksPDF();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Tasks exported to PDF successfully");
    } catch (error) {
      toast.error("Failed to export tasks to PDF");
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await exportTasksCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Tasks exported to CSV successfully");
    } catch (error) {
      toast.error("Failed to export tasks to CSV");
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
            Loading your tasks...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              Tasks
            </h1>
            <p className="text-gray-600 animate-fade-in-delay-1">
              Manage and track your tasks efficiently
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500 animate-fade-in-delay-2">
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                Total: {tasks.length}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Completed: {completedTasks.length}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                Pending: {pendingTasks.length}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Overdue: {overdueTasks.length}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="group relative px-4 py-2 bg-white text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
            >
              <span className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Export PDF
              </span>
            </button>
            <button
              onClick={handleExportCSV}
              className="group relative px-4 py-2 bg-white text-gray-700 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-200"
            >
              <span className="relative flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Export CSV
              </span>
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="group relative px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
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
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 mb-8 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="all">All Tasks</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={filters.priority}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sortBy"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Sort By
              </label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="dueDate">Due Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search
              </label>
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  ></path>
                </svg>
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
                />
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">View:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    ></path>
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Showing {sortedTasks.length} of {tasks.length} tasks
            </div>
          </div>
        </div>

        {/* Task List/Grid */}
        {sortedTasks.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-12 text-center animate-fade-in-up">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tasks found
            </h3>
            <p className="text-gray-500 mb-6">
              {filters.search ||
              filters.status !== "all" ||
              filters.priority !== "all"
                ? "Try adjusting your filters or search terms"
                : "Create your first task to get started!"}
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200"
            >
              Create New Task
            </button>
          </div>
        ) : (
          <div
            className={`animate-fade-in-up ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {sortedTasks.map((task, index) => (
              <div
                key={task._id}
                className={`group bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up ${
                  viewMode === "grid" ? "p-6" : "p-4"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={(e) =>
                              handleToggleCompletion(task._id, e)
                            }
                            className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all duration-200"
                          />
                          {task.completed && (
                            <svg
                              className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/tasks/${task._id}/edit`}
                            className="block group-hover:text-blue-600 transition-colors duration-200"
                          >
                            <h3
                              className={`font-semibold text-lg ${
                                task.completed
                                  ? "line-through text-gray-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {task.title}
                            </h3>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {task.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(
                          task
                        )}`}
                      >
                        {getStatusText(task)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          ></path>
                        </svg>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          getDaysUntilDue(task.dueDate) < 0
                            ? "bg-red-100 text-red-800"
                            : getDaysUntilDue(task.dueDate) <= 3
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {getDaysUntilDue(task.dueDate) < 0
                          ? `${Math.abs(
                              getDaysUntilDue(task.dueDate)
                            )} days overdue`
                          : getDaysUntilDue(task.dueDate) === 0
                          ? "Due today"
                          : `${getDaysUntilDue(task.dueDate)} days left`}
                      </span>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag) => (
                          <span
                            key={`${task._id}-${tag._id}`}
                            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  // List View
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={(e) => handleToggleCompletion(task._id, e)}
                          className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer transition-all duration-200"
                        />
                        {task.completed && (
                          <svg
                            className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/tasks/${task._id}/edit`}
                          className="block group-hover:text-blue-600 transition-colors duration-200"
                        >
                          <h3
                            className={`font-semibold ${
                              task.completed
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </Link>

                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.tags.map((tag) => (
                              <span
                                key={`${task._id}-${tag._id}`}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 border border-blue-200"
                              >
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(
                          task
                        )}`}
                      >
                        {getStatusText(task)}
                      </span>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${
                            getDaysUntilDue(task.dueDate) < 0
                              ? "bg-red-100 text-red-800"
                              : getDaysUntilDue(task.dueDate) <= 3
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {getDaysUntilDue(task.dueDate) < 0
                            ? `${Math.abs(
                                getDaysUntilDue(task.dueDate)
                              )} days overdue`
                            : getDaysUntilDue(task.dueDate) === 0
                            ? "Due today"
                            : `${getDaysUntilDue(task.dueDate)} days left`}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Task Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
              <TaskForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Tasks;
