const User = require('../models/User');

exports.updateProfile = async (req, res, next) => {
  try {
    const updateData = {};
    const { email, password, name } = req.body;
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (password) updateData.password = password;
    let user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    Object.assign(user, updateData);
    await user.save();
    res.json({ user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
};
