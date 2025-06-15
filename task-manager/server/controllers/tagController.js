const Tag = require('../models/Tag');

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({ user: req.user.id });
    res.json({ tags });
  } catch (err) {
    next(err);
  }
};

exports.createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    const existing = await Tag.findOne({ user: req.user.id, name });
    if (existing) {
      return res.status(400).json({ message: 'Tag already exists' });
    }
    const tag = new Tag({ name, user: req.user.id });
    await tag.save();
    res.status(201).json({ tag });
  } catch (err) {
    next(err);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const tag = await Tag.findOneAndUpdate({ _id: id, user: req.user.id }, { name }, { new: true });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json({ tag });
  } catch (err) {
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findOneAndDelete({ _id: id, user: req.user.id });
    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }
    res.json({ message: 'Tag deleted' });
  } catch (err) {
    next(err);
  }
};
