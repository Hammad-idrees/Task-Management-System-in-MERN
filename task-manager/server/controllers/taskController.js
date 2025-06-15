const Task = require('../models/Task');
const Notification = require('../models/Notification');

exports.getTasks = async (req, res, next) => {
  try {
    const filter = { user: req.user.id };
    const { status, priority, search, page, limit } = req.query;
    if (status === 'completed') filter.completed = true;
    else if (status === 'pending') filter.completed = false;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };
    // Pagination
    let query = Task.find(filter)
      .populate({
        path: 'tags',
        select: 'name _id',
      })
      .sort({ createdAt: -1 });
    if (page || limit) {
      const p = parseInt(page, 10) || 1;
      const l = parseInt(limit, 10) || 10;
      const skip = (p - 1) * l;
      query = query.skip(skip).limit(l);
    }
    const tasks = await query;
    res.json({ tasks });
  } catch (err) {
    next(err);
  }
};

exports.createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, tags, order } = req.body;
    const taskData = { title, user: req.user.id };
    if (description) taskData.description = description;
    if (dueDate) taskData.dueDate = dueDate;
    if (priority) taskData.priority = priority;
    if (tags) taskData.tags = tags;
    if (order) taskData.order = order;
    const task = new Task(taskData);
    await task.save();

    // Populate tags before sending response
    await task.populate({
      path: 'tags',
      select: 'name _id',
    });

    // Create notification for task creation
    await Notification.create({
      user: req.user.id,
      task: task._id,
      type: 'created',
      message: `🎯 New task created: "${task.title}"${dueDate ? ` (Due: ${new Date(dueDate).toLocaleDateString()})` : ''}. ${description ? `\nDescription: ${description}` : ''}`,
    });

    res.status(201).json({ task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {};
    [
      'title',
      'description',
      'dueDate',
      'priority',
      'completed',
      'tags',
      'order',
      'sharedWith',
    ].forEach((field) => {
      if (req.body[field] !== undefined) updateData[field] = req.body[field];
    });
    const task = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updateData,
      { new: true },
    ).populate({
      path: 'tags',
      select: 'name _id',
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete all notifications associated with this task
    await Notification.deleteMany({ task: id });

    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

exports.toggleTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    task.completed = !task.completed;
    await task.save();
    res.json({ task });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findOne({ _id: id, user: req.user.id }).populate({
      path: 'tags',
      select: 'name _id',
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task });
  } catch (err) {
    next(err);
  }
};
