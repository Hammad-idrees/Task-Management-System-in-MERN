import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createTask, updateTask, getTask } from "../../services/tasks";
import { getTags } from "../../services/tags";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function TaskForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    tags: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // Fetch task data if editing
  const { data: taskData } = useQuery({
    queryKey: ["task", id],
    queryFn: () => getTask(id),
    enabled: !!id,
    onSuccess: (data) => {
      if (data.task) {
        setFormData({
          title: data.task.title || "",
          description: data.task.description || "",
          dueDate: data.task.dueDate
            ? new Date(data.task.dueDate).toISOString().split("T")[0]
            : "",
          priority: data.task.priority || "Medium",
          tags: data.task.tags?.map((tag) => tag._id) || [],
        });
      }
    },
  });

  // Fetch available tags
  const { data: tagsData } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const tags = tagsData?.tags || [];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task created successfully");
      navigate("/");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to create task";
      toast.error(errorMessage);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task updated successfully");
      navigate("/");
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.message || "Failed to update task";
      toast.error(errorMessage);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    const taskData = {
      ...formData,
      dueDate: new Date(formData.dueDate).toISOString(),
      priority:
        formData.priority.charAt(0).toUpperCase() +
        formData.priority.slice(1).toLowerCase(),
      tags: formData.tags,
    };

    if (id) {
      updateTaskMutation.mutate({ id, data: taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTagChange = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter((id) => id !== tagId)
        : [...prev.tags, tagId],
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-cyan-50 py-8 px-4">
      <motion.div
        className="max-w-2xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 p-6 md:p-8"
          whileHover={{ boxShadow: "0 10px 50px -15px rgba(0, 0, 0, 0.1)" }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-2 h-10 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
            <motion.h2
              className="text-2xl md:text-3xl font-bold text-gray-900 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {id ? "Edit Task" : "Create New Task"}
            </motion.h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("title")}
                  onBlur={() => setFocusedField(null)}
                  className={`block w-full pl-4 pr-4 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.title
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-200 focus:ring-emerald-400"
                  }`}
                  required
                />
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none bg-gradient-to-r from-emerald-400/10 to-teal-400/10`}
                  animate={{
                    opacity: focusedField === "title" ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <AnimatePresence>
                {errors.title && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center text-red-500 text-sm pt-1"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    {errors.title}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Description Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="relative group">
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  onFocus={() => setFocusedField("description")}
                  onBlur={() => setFocusedField(null)}
                  className={`block w-full pl-4 pr-4 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    errors.description
                      ? "border-red-300 focus:ring-red-300"
                      : "border-gray-200 focus:ring-emerald-400"
                  }`}
                />
                <motion.div
                  className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none bg-gradient-to-r from-emerald-400/10 to-teal-400/10`}
                  animate={{
                    opacity: focusedField === "description" ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Due Date Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Due Date
                </label>
                <div className="relative group">
                  <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("dueDate")}
                    onBlur={() => setFocusedField(null)}
                    className={`block w-full pl-4 pr-4 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 ${
                      errors.dueDate
                        ? "border-red-300 focus:ring-red-300"
                        : "border-gray-200 focus:ring-emerald-400"
                    }`}
                    required
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none bg-gradient-to-r from-emerald-400/10 to-teal-400/10`}
                    animate={{
                      opacity: focusedField === "dueDate" ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <AnimatePresence>
                  {errors.dueDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center text-red-500 text-sm pt-1"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      {errors.dueDate}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Priority Field */}
              <motion.div variants={itemVariants} className="space-y-2">
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <div className="relative group">
                  <select
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("priority")}
                    onBlur={() => setFocusedField(null)}
                    className={`block w-full pl-4 pr-10 py-3 bg-white border rounded-xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:border-transparent transition-all duration-300 appearance-none ${
                      errors.priority
                        ? "border-red-300 focus:ring-red-300"
                        : "border-gray-200 focus:ring-emerald-400"
                    }`}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                  <motion.div
                    className={`absolute inset-0 rounded-xl opacity-0 pointer-events-none bg-gradient-to-r from-emerald-400/10 to-teal-400/10`}
                    animate={{
                      opacity: focusedField === "priority" ? 1 : 0,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
              </motion.div>
            </div>

            {/* Tags Field */}
            <motion.div variants={itemVariants} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-3">
                {tags.map((tag) => (
                  <motion.button
                    key={tag._id}
                    type="button"
                    onClick={() => handleTagChange(tag._id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 transform ${
                      formData.tags.includes(tag._id)
                        ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tag.name}
                    {formData.tags.includes(tag._id) && (
                      <span className="ml-2 bg-white/20 rounded-full px-2 py-0.5">
                        ✓
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Form Actions */}
            <motion.div
              className="flex justify-end space-x-4 pt-6"
              variants={itemVariants}
            >
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg ${
                  isLoading
                    ? "bg-emerald-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                }`}
              >
                <div className="flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Processing...
                    </>
                  ) : id ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </div>
              </button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default TaskForm;
