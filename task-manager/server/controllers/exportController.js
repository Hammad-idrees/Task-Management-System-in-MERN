const Task = require('../models/Task');
const PDFDocument = require('pdfkit');
const { generateCSV } = require('../utils/exportCSV');

exports.exportTasksCSV = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).lean();
    const fields = [
      '_id',
      'title',
      'description',
      'dueDate',
      'priority',
      'completed',
      'createdAt',
      'updatedAt',
    ];
    const data = tasks.map((t) => ({
      _id: t._id,
      title: t.title,
      description: t.description || '',
      dueDate: t.dueDate ? t.dueDate.toISOString() : '',
      priority: t.priority,
      completed: t.completed,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    }));
    const csv = generateCSV(fields, data);
    res.header('Content-Type', 'text/csv');
    res.attachment('tasks.csv');
    return res.send(csv);
  } catch (err) {
    next(err);
  }
};

// PDF export not implemented
exports.exportTasksPDF = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).populate('tags');

    const doc = new PDFDocument();

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.pdf"');

    // Pipe PDF to response
    doc.pipe(res);

    doc.fontSize(18).text('Task List', { underline: true });
    doc.moveDown();

    tasks.forEach((task, index) => {
      doc
        .fontSize(12)
        .text(`Task ${index + 1}`, { bold: true })
        .text(`Title: ${task.title}`)
        .text(`Description: ${task.description || 'N/A'}`)
        .text(
          `Due Date: ${task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}`,
        )
        .text(`Priority: ${task.priority}`)
        .text(`Completed: ${task.completed ? 'Yes' : 'No'}`)
        .text(`Tags: ${task.tags.map((tag) => tag.name).join(', ') || 'None'}`)
        .moveDown();
    });

    doc.end(); // Finalize the PDF and send it
  } catch (err) {
    next(err);
  }
};
