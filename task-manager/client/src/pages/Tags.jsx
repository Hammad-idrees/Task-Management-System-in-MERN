import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getTags, createTag, updateTag, deleteTag } from "../services/tags";
import { getTasks } from "../services/tasks";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function Tags() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [newTagName, setNewTagName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTagFilter, setSelectedTagFilter] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: tagsResponse,
    isLoading: isLoadingTags,
    error: tagsError,
  } = useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
  });

  const {
    data: tasksResponse,
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const tags = tagsResponse?.tags || [];
  const tasks = tasksResponse?.tasks || [];

  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setNewTagName("");
      setIsFormOpen(false);
      toast.success("Tag created successfully");
    },
    onError: () => {
      toast.error("Failed to create tag");
    },
  });

  const updateTagMutation = useMutation({
    mutationFn: updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setSelectedTag(null);
      toast.success("Tag updated successfully");
    },
    onError: () => {
      toast.error("Failed to update tag");
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
      setShowDeleteConfirm(null);
      toast.success("Tag deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete tag");
    },
  });

  const handleCreateTag = (e) => {
    e.preventDefault();
    if (newTagName.trim()) {
      createTagMutation.mutate({ name: newTagName.trim() });
    }
  };

  const handleUpdateTag = (tagId, newName) => {
    if (newName.trim()) {
      updateTagMutation.mutate({ id: tagId, name: newName.trim() });
    }
  };

  const handleDeleteTag = (tagId) => {
    deleteTagMutation.mutate(tagId);
  };

  if (tagsError || tasksError) {
    toast.error("Failed to load data");
  }

  if (isLoadingTags || isLoadingTasks) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="animate-ping absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-400 opacity-30"></div>
          </div>
          <p className="mt-6 text-lg text-gray-600 animate-pulse">
            Loading your tags and tasks...
          </p>
        </div>
      </div>
    );
  }

  // Get all tasks that have at least one tag
  const tasksWithTags = tasks.filter(
    (task) => task.tags && task.tags.length > 0
  );

  // Filter tasks based on search and selected tag
  const filteredTasks = tasksWithTags.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag =
      !selectedTagFilter ||
      task.tags.some((tag) => tag._id === selectedTagFilter._id);
    return matchesSearch && matchesTag;
  });

  // Get tag usage count
  const getTagUsageCount = (tagId) => {
    return tasks.filter(
      (task) => task.tags && task.tags.some((tag) => tag._id === tagId)
    ).length;
  };

  const tagColors = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-purple-100 text-purple-800 border-purple-200",
    "bg-pink-100 text-pink-800 border-pink-200",
    "bg-indigo-100 text-indigo-800 border-indigo-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-red-100 text-red-800 border-red-200",
    "bg-teal-100 text-teal-800 border-teal-200",
  ];

  const getTagColor = (index) => tagColors[index % tagColors.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-fade-in">
              Tags & Tasks
            </h1>
            <p className="text-gray-600 animate-fade-in-delay-1">
              Organize and manage your tasks with powerful tagging system
            </p>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
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
              Add Tag
            </span>
          </button>
        </div>

        {/* Create Tag Form */}
        <div
          className={`transition-all duration-500 ease-out overflow-hidden ${
            isFormOpen ? "max-h-96 opacity-100 mb-8" : "max-h-0 opacity-0"
          }`}
        >
          <form
            onSubmit={handleCreateTag}
            className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-white/20 shadow-xl animate-slide-down"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-gray-800 placeholder-gray-400"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={createTagMutation.isLoading}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  {createTagMutation.isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Create"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false);
                    setNewTagName("");
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Tags Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
              Available Tags
              <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {tags.length}
              </span>
            </h2>
          </div>

          {tags.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500 text-lg">No tags created yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Create your first tag to get started
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tags.map((tag, index) => (
                <div
                  key={tag._id}
                  className={`group relative p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${getTagColor(
                    index
                  )} animate-fade-in-up`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {selectedTag?._id === tag._id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={selectedTag.name}
                        onChange={(e) =>
                          setSelectedTag({
                            ...selectedTag,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border-2 border-white bg-white/90 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleUpdateTag(tag._id, selectedTag.name)
                          }
                          disabled={updateTagMutation.isLoading}
                          className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors duration-200"
                        >
                          {updateTagMutation.isLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setSelectedTag(null)}
                          className="flex-1 px-3 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg truncate pr-2">
                          {tag.name}
                        </h3>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => setSelectedTag(tag)}
                            className="p-1.5 bg-white/80 rounded-lg hover:bg-white text-gray-600 hover:text-blue-600 transition-all duration-200"
                            title="Edit tag"
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              ></path>
                            </svg>
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(tag._id)}
                            className="p-1.5 bg-white/80 rounded-lg hover:bg-white text-gray-600 hover:text-red-600 transition-all duration-200"
                            title="Delete tag"
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
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              ></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm opacity-75">
                          {getTagUsageCount(tag._id)} tasks
                        </span>
                        <button
                          onClick={() =>
                            setSelectedTagFilter(
                              selectedTagFilter?._id === tag._id ? null : tag
                            )
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                            selectedTagFilter?._id === tag._id
                              ? "bg-white text-gray-800 shadow-md"
                              : "bg-white/50 hover:bg-white/80"
                          }`}
                        >
                          {selectedTagFilter?._id === tag._id
                            ? "Clear Filter"
                            : "Filter Tasks"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-6 mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
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
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>
            {selectedTagFilter && (
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-100 text-blue-800 rounded-xl border-2 border-blue-200">
                <span className="text-sm font-medium">Filtering by:</span>
                <span className="font-semibold">{selectedTagFilter.name}</span>
                <button
                  onClick={() => setSelectedTagFilter(null)}
                  className="ml-2 p-1 hover:bg-blue-200 rounded-full transition-colors duration-200"
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
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tasks with Tags Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl p-8 animate-fade-in-up">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <div className="w-2 h-8 bg-gradient-to-b from-purple-600 to-blue-600 rounded-full"></div>
            Tasks with Tags
            <span className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {filteredTasks.length}
            </span>
          </h2>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-500 text-lg">
                {searchTerm || selectedTagFilter
                  ? "No matching tasks found"
                  : "No tasks with tags found"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || selectedTagFilter
                  ? "Try adjusting your search or filter"
                  : "Start by adding tags to your tasks"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredTasks.map((task, index) => (
                <div
                  key={task._id}
                  className="group p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {task.title}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
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
                          Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-gray-600 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, tagIndex) => (
                          <span
                            key={`${task._id}-${tag._id}`}
                            className={`px-3 py-1.5 text-sm font-medium rounded-full border-2 transition-all duration-200 hover:scale-105 cursor-pointer ${getTagColor(
                              tags.findIndex((t) => t._id === tag._id)
                            )}`}
                            onClick={() =>
                              setSelectedTagFilter(
                                selectedTagFilter?._id === tag._id ? null : tag
                              )
                            }
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/tasks/${task._id}/edit`}
                        className="group/link px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        <svg
                          className="w-4 h-4 group-hover/link:rotate-12 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                        Edit Task
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl animate-scale-in">
              <div className="text-center">
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Delete Tag
                </h3>
                <p className="text-gray-600 mb-6">
                  Are you sure you want to delete this tag? This action cannot
                  be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteTag(showDeleteConfirm)}
                    disabled={deleteTagMutation.isLoading}
                    className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {deleteTagMutation.isLoading ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
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

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
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
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Tags;
