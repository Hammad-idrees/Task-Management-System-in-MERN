const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
);

TagSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Tag', TagSchema);
